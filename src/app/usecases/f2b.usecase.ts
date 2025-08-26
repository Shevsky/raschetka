import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { noop } from '~/utils/misc/noop';

const execFileP = promisify(execFile);

const defaultJail = 'nginx-probes';

function f2b(...args: Array<string>): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  return execFileP('/usr/bin/fail2ban-client', args, { timeout: 5000, maxBuffer: 1 << 20 }).then(({ stdout }) => stdout.trim());
}

export async function f2bList(jail: string = defaultJail): Promise<Array<string>> {
  return f2b('status', jail)
    .then((stdout) => stdout.split('\n'))
    .then((lines) =>
      lines
        .map((line) => line.trim())
        .map((line) => {
          const [, ips] = /Banned IP list:\s+(.+)/.exec(line) ?? [];

          if (ips) {
            return ips.split(' ');
          } else {
            return null;
          }
        })
        .filter(Boolean)
        .flat()
    );
}

export async function f2bBan(ip: string, jail: string = defaultJail): Promise<void> {
  return f2b('set', jail, 'banip', ip).then(noop);
}

export async function f2bUnban(ip: string, jail: string = defaultJail): Promise<void> {
  return f2b('set', jail, 'unbanip', ip).then(noop);
}
