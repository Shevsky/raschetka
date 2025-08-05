/** Функциональный способ выкинуть ошибку */
export function raise(error: unknown): never {
  throw error;
}
