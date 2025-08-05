import { TypedMessage } from '~/app/bot/types/message';

export function getUnknownMimeTypeErrorMessage(mimeType: string) {
  return [`🙅‍♂️ С таким я работать не умею (${mimeType}) — мне нужно либо фото с QR кодом чека, либо его json`] satisfies TypedMessage;
}

export function getNotAJSONErrorMessage() {
  return [`🤔 Не знаю, что это такое, но на json это не похоже`] satisfies TypedMessage;
}

export function getNotAReceiptJSONErrorMessage() {
  return [`🤭 Окей, это конечно json, но мне для работы требуется конкретный json фискального чека`] satisfies TypedMessage;
}

export function getQRNotFoundErrorMessage() {
  return [`🏜️🌵 На этой фотографии может быть что угодно, но QR кода на ней я не вижу`] satisfies TypedMessage;
}

export function getNotAFiscalQRErrorMessage() {
  return [`🌝 Упс... Не похоже это на QR код фискального чека`] satisfies TypedMessage;
}
