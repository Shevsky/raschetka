import fs from 'node:fs';
import { resolve } from 'node:path';

export enum StorageTarget {
  USERPICS = 'userpics'
}

export async function configureStorage(): Promise<void> {
  await Promise.all(
    Object.values(StorageTarget).map((target) => fs.promises.mkdir(resolve(process.env.STORAGE_PATH, target), { recursive: true }))
  );
}

type StoragePathPair = {
  path: string;
  fullpath: string;
};

export function getStoragePathPair(target: StorageTarget, filename: string, extension: string): StoragePathPair {
  const path = `${target}/${filename}.${extension}`;

  return {
    path,
    fullpath: resolve(process.env.STORAGE_PATH, path)
  };
}
