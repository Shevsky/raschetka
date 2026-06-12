import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { prepareZXingModule, writeBarcode } from 'zxing-wasm/writer';

// import.meta.resolve работает не так, поэтому через createRequire
const zxingWasmPath = createRequire(import.meta.url).resolve('zxing-wasm/writer/zxing_writer.wasm');

prepareZXingModule({
  overrides: { wasmBinary: readFileSync(zxingWasmPath).buffer as ArrayBuffer }
});

/** Генератор QR кодов */
export async function generateQRImage(input: string): Promise<Nullish<Uint8Array>> {
  const output = await writeBarcode(input, {
    ecLevel: 'M',
    sizeHint: 512,
    withQuietZones: true
  });

  if (!output.image) {
    return null;
  }

  return new Uint8Array(await output.image.arrayBuffer());
}
