export function isOK(statusCode: number): boolean {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  return statusCode >= 200 && statusCode <= 299;
}
