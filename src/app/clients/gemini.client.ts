import { timeout } from 'decorio';
import { request, Socks5ProxyAgent } from 'undici';
import { RuntimeError } from '~/utils/errors/runtime.error';
import { isOK } from '~/utils/misc/is-ok';

const timeoutMs = 10_000;

class GeminiError extends RuntimeError {}

class GeminiClient {
  readonly #url = process.env.GEMINI_URL;
  readonly #model = process.env.GEMINI_MODEL;
  readonly #key = process.env.GEMINI_KEY;
  readonly #dispatcher = process.env.SOCKS_PROXY_URL ? new Socks5ProxyAgent(process.env.SOCKS_PROXY_URL) : undefined;

  @timeout(timeoutMs) async generateTextContent(prompt: string): Promise<Nullish<string>> {
    const { signal } = timeout;

    return request(`${this.#url}/v1beta/models/${this.#model}:generateContent?key=${this.#key}`, {
      dispatcher: this.#dispatcher,
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
      signal
    }).then(async (response) => {
      const result = await response.body.json().catch(() => response.body.text());

      if (!isOK(response.statusCode)) {
        const patched = result as { error?: { code?: number; message?: string; status?: string } };

        throw new GeminiError(`Ошибка выполнения запроса: ${patched.error?.message ?? JSON.stringify(patched)} (${response.statusCode})`);
      }

      const patched = result as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };

      return patched.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
    });
  }
}

export const geminiClient = new GeminiClient();
