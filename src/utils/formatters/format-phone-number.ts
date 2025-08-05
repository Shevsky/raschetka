const phoneNumberRegex = /^\+\d{11}$/;

/** Форматирование номера телефона */
export function formatPhoneNumber(phoneNumber: string): string {
  const cleanPhoneNumber = clearPhoneNumber(phoneNumber);

  if (!phoneNumberRegex.test(cleanPhoneNumber)) {
    return phoneNumber;
  }

  return cleanPhoneNumber.replace(/^\+(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/, `+$1 $2 $3‑$4‑$5`);
}

/** Очистка номера телефона от мусорных символов */
export function clearPhoneNumber(phoneNumber: string): string {
  return '+'.concat(phoneNumber.replaceAll(/\D/g, '').replace(/^8/, '7'));
}
