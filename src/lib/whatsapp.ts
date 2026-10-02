/**
 * WhatsApp message generator and link builder for Hostel Helper
 */

interface WhatsAppMessageParams {
  phoneNumber: string; // e.g. "6300141729" or "916300141729"
  requestId: string;
  sectionName: string;
  formName: string;
  fields: { label: string; value: string }[];
  submittedAt?: Date;
}

export function formatWhatsAppMessage({
  requestId,
  sectionName,
  formName,
  fields,
  submittedAt = new Date(),
}: Omit<WhatsAppMessageParams, 'phoneNumber'>): string {
  const formattedDate = submittedAt.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const header = `📦 *HOSTEL HELPER - ${formName.toUpperCase()} REQUEST*`;
  const meta = `\n🆔 *Request ID:* ${requestId}\n📍 *Section:* ${sectionName}\n📋 *Service:* ${formName}\n⏰ *Time:* ${formattedDate}\n`;

  const detailsList = fields
    .filter((f) => f.value && f.value.trim().length > 0)
    .map((f) => `▪️ *${f.label}:* ${f.value.trim()}`)
    .join('\n');

  const footer = `\n\n🙏 *Please process this request. Thank you!*`;

  return `${header}\n${meta}\n*SUBMITTED DETAILS:*\n${detailsList}${footer}`;
}

export function cleanPhoneNumber(phone: string): string {
  // Strip non-digit characters
  const digits = phone.replace(/\D/g, '');
  // If 10 digits (standard Indian number), prefix with country code 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

export function getWhatsAppUrl({
  phoneNumber,
  requestId,
  sectionName,
  formName,
  fields,
  submittedAt,
}: WhatsAppMessageParams): string {
  const cleanedPhone = cleanPhoneNumber(phoneNumber);
  const message = formatWhatsAppMessage({
    requestId,
    sectionName,
    formName,
    fields,
    submittedAt,
  });

  return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;
}

export function getGeneralWhatsAppUrl(phoneNumber: string, messageText = 'Hello! I need help with Hostel Helper.'): string {
  const cleanedPhone = cleanPhoneNumber(phoneNumber);
  return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(messageText)}`;
}
