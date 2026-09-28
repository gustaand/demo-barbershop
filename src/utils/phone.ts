export function normalizeWhatsAppPhone(value: string, defaultCountryCode = '34') {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 9) digits = `${defaultCountryCode}${digits}`;
  return digits.length >= 10 && digits.length <= 15 ? digits : null;
}

export function whatsappConversationUrl(value: string) {
  const phone = normalizeWhatsAppPhone(value);
  return phone ? `https://wa.me/${phone}` : null;
}
