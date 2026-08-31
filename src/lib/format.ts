import { format } from 'date-fns';

export const getInitials = (fullName: string | undefined) => {
  if (!fullName) return 'N/A';
  return fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

/** The JWT payload carries no display name, so the email local part is the most
 *  human handle an account has. Title cased here rather than by a `capitalize`
 *  class, so a caller can use the words in a sentence. */
export const displayNameFromEmail = (email: string | undefined) => {
  if (!email) return 'there';

  return email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatDate = (date?: string | number | Date, dateFormat?: string) => {
  if (!date) return '-';
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return '-';
  return dateFormat ? format(parsedDate, dateFormat) : format(parsedDate, 'dd MMM yyyy, hh:mm a');
};

/** Every money value crossing the API is a signed integer in paise. Convert at
 *  the edges only - never do the arithmetic inline in a component. */
export const rupeesToPaise = (rupees: number) => Math.round(rupees * 100);

/** Indian digit grouping, two decimals, sign preserved. */
export const formatPaise = (paise: number | null | undefined, currency = 'INR') => {
  if (paise === null || paise === undefined) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(paise / 100);
};
