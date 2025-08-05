import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { prepareZXingModule, readBarcodes } from 'zxing-wasm/reader';

// import.meta.resolve работает не так, поэтому через createRequire
const zxingWasmPath = createRequire(import.meta.url).resolve('zxing-wasm/reader/zxing_reader.wasm');

prepareZXingModule({
  overrides: { wasmBinary: readFileSync(zxingWasmPath).buffer as ArrayBuffer }
});

/** Декодинг QR кодов */
export async function decodeQRData(buffer: ArrayBuffer): Promise<Nullish<string>> {
  const result = await readBarcodes(buffer, {
    formats: ['QRCode'],
    tryHarder: true,
    tryDenoise: true,
    tryRotate: false,
    maxNumberOfSymbols: 1
  });

  if (!result.length) {
    return null;
  }

  return result[0].text;
}
