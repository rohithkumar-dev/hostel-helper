/**
 * Generates a unique, standardized Request ID in the format:
 * HH-YYYYMMDD-XXXX (e.g. HH-20261002-0001)
 */
export function generateRequestId(sequenceNumber?: number): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  if (sequenceNumber !== undefined && sequenceNumber > 0) {
    const seqStr = String(sequenceNumber).padStart(4, '0');
    return `HH-${dateStr}-${seqStr}`;
  }

  // Fallback random 4-digit hex/number
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `HH-${dateStr}-${randomSuffix}`;
}
