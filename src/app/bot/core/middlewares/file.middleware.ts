import { Context, MiddlewareFn } from 'grammy';
import { Document, PhotoSize } from 'grammy/types';
import * as fs from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { BodyMixin, request } from 'undici';

type DownloadFileAs = KeyofTyped<BodyMixin, () => Promise<unknown>>;

type DownloadFileResult<T extends DownloadFileAs> = Awaited<ReturnType<BodyMixin[T]>>;

export type FileMiddlewareFlavor<C extends Context> = C & {
  streamFile: (source: PhotoSize | Document, path: string) => Promise<void>;
  downloadFile: <T extends DownloadFileAs>(source: PhotoSize | Document, as: T) => Promise<DownloadFileResult<T>>;
};

/** Добавляем метод скачивания файла. Умеет работать с фотками и документами, потому что большее и не требуется */
export function fileMiddleware() {
  return ((ctx, next) => {
    const patched = ctx as FileMiddlewareFlavor<Context>;

    const getFileUrl = async (id: string) => {
      const file = await ctx.api.getFile(id);

      return `https://api.telegram.org/file/bot${ctx.api.token}/${file.file_path}`;
    };

    patched.streamFile = async (source, path) => {
      const url = await getFileUrl(source.file_id);
      const response = await request(url);

      await pipeline(response.body, fs.createWriteStream(path));
    };

    patched.downloadFile = async (source, as) => {
      const url = await getFileUrl(source.file_id);
      const response = await request(url);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return response.body[as]() as DownloadFileResult<any>;
    };

    return next();
  }) satisfies MiddlewareFn;
}
