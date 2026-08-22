import { format } from 'date-fns';

export const getInitials = (fullName: string | undefined) => {
  if (!fullName) return 'N/A';
  return fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
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
