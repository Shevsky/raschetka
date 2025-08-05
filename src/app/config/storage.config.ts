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
  filename: string;
  path: string;
};

export function getStoragePathPair(target: StorageTarget, id: string): StoragePathPair {
  const filename = `${target}/${id}`;

  return {
    filename,
    path: resolve(process.env.STORAGE_PATH, filename)
  };
}
