const BR_DATE = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})/;

export const EXPIRING_SOON_DAYS = 7;

/** Formats digits typed by the user as DD/MM/AAAA. */
export function maskBrDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/** Converts DD/MM/AAAA to yyyy-mm-dd, or null if the date is invalid. */
export function brToIso(value: string): string | null {
  const match = BR_DATE.exec(value);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  const date = new Date(Date.UTC(year, month - 1, day));
  const isValid =
    year >= 1900 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
  return isValid ? `${yyyy}-${mm}-${dd}` : null;
}

export function isoToBr(value: string) {
  const match = ISO_DATE.exec(value);
  if (!match) return value;
  const [, yyyy, mm, dd] = match;
  return `${dd}/${mm}/${yyyy}`;
}

export function formatDateTimeBr(isoDateTime: string) {
  return new Date(isoDateTime).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function todayIso() {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${mm}-${dd}`;
}

function daysBetween(fromIso: string, toIso: string) {
  return Math.round((Date.parse(toIso) - Date.parse(fromIso)) / 86_400_000);
}

export type ExpiryStatus = 'expired' | 'expiringSoon' | 'ok';

export function getExpiryStatus(expiryIso: string): ExpiryStatus {
  const days = daysBetween(todayIso(), expiryIso);
  if (days < 0) return 'expired';
  if (days <= EXPIRING_SOON_DAYS) return 'expiringSoon';
  return 'ok';
}
