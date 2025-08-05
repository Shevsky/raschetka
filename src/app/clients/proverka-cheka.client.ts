import { timeout } from 'decorio';
import { Dispatcher, FormData, request } from 'undici';
import { FiscalReceiptRaw } from '~/persistence';
import { RuntimeError } from '~/utils/errors/runtime.error';
import { isOK } from '~/utils/misc/is-ok';

const timeoutMs = 30_000;

class ProverkaChekaError extends RuntimeError {}

class ProverkaChekaClient {
  readonly #url = process.env.PROVERKA_CHEKA_URL;
  readonly #token = process.env.PROVERKA_CHEKA_TOKEN;

  @timeout(timeoutMs) async getReceiptByQRData(data: string): Promise<FiscalReceiptRaw> {
    const { signal } = timeout;

    return request(`${this.#url}/api/v1/check/get`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        token: this.#token,
        qrraw: data
      }),
      signal
    }).then(this.#handleResponse);
  }

  @timeout(timeoutMs) async getReceiptByQRFile(buffer: ArrayBuffer): Promise<FiscalReceiptRaw> {
    const { signal } = timeout;

    const data = new FormData();
    data.append('token', this.#token);
    // @ts-ignore чёта ему тут не нравится ну и пошёл ты нахуй
    data.append('qrfile', new Blob([buffer]));

    return request(`${this.#url}/api/v1/check/get`, {
      method: 'POST',
      body: data,
      signal
    }).then(this.#handleResponse);
  }

  #handleResponse = async (response: Dispatcher.ResponseData): Promise<FiscalReceiptRaw> => {
    if (!isOK(response.statusCode)) {
      throw new ProverkaChekaError(`Отвалился запрос с статус-кодом ${response.statusCode}`);
    }

    const result = await response.body.json();

    if (!result || typeof result !== 'object') {
      throw new ProverkaChekaError(`В ответе пришёл не json: ${JSON.stringify(result)}`);
    }

    if (!('data' in result) || !result.data) {
      throw new ProverkaChekaError(`Получили объект без поля data: ${JSON.stringify(result)}`);
    }

    if (typeof result.data !== 'object') {
      throw new ProverkaChekaError(
        typeof result.data === 'string' ? result.data : `Кривой ответ от сервера: ${JSON.stringify(result.data)}`
      );
    }

    const patched = result as { data: { json: FiscalReceiptRaw } };

    // Если какого-то ключа нет, то просто выстрелит TypeError
    return patched.data.json;
  };
}

export const proverkaChekaClient = new ProverkaChekaClient();
