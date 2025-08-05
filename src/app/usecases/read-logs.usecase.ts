import { format, toZonedTime } from 'date-fns-tz';
import Dockerode from 'dockerode';
import { PassThrough, Readable } from 'node:stream';

const dockerode = new Dockerode();

/** Возвращает логи текущего контейнера */
export async function readLogs(lines: number): Promise<string> {
  const cid = process.env.HOSTNAME || null;

  if (!cid) {
    throw new Error('Не определен ID контейнера');
  }

  const bufferOrStream: Buffer | NodeJS.ReadableStream = await dockerode.getContainer(cid).logs({
    stdout: true,
    stderr: true,
    tail: lines,
    follow: false,
    timestamps: true
  });

  const input = Buffer.isBuffer(bufferOrStream) ? Readable.from(bufferOrStream) : bufferOrStream;

  const out = new PassThrough();
  const err = new PassThrough();

  // убираем заголовки
  dockerode.modem.demuxStream(input, out, err);

  // Без этого out/err могут не закрыться и Promise зависнет
  input.on('end', () => {
    out.end();
    err.end();
  });
  input.on('error', (e) => {
    out.destroy(e);
    err.destroy(e);
  });

  const [o, e] = await Promise.all(
    [out, err].map(async (stream) => {
      let acc = '';

      for await (const chunk of stream) {
        acc += chunk.toString('utf8');
      }

      return acc;
    })
  );

  // Объединяем и сортируем по timestamp (они уже RFC3339 и сортируются лексикографически)
  return [...o.split('\n'), ...e.split('\n')].filter(Boolean).sort().slice(-lines).map(convertLineTimestamp).join('\n');
}

function convertLineTimestamp(line: string): string {
  const match = line.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(\.\d+)?Z\s(.*)$/);

  if (!match) {
    return line;
  }

  const [, base, _, rest] = match;

  const zdt = toZonedTime(`${base}Z`, process.env.TZ!);
  const head = format(zdt, 'dd.MM.yyyy HH:mm:ss', { timeZone: process.env.TZ });

  return `${head} ${rest}`;
}
