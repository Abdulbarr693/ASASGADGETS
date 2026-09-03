/**
 * Nigerian Naira (₦) Currency Formatter Utilities
 */

export const formatNaira = (amount: number | string | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₦0';
  }
  const num = typeof amount === 'number' ? amount : Number(amount);
  return `₦${num.toLocaleString('en-NG')}`;
};

export const formatCurrency = formatNaira;

export const parseNaira = (value: string): number => {
  const cleaned = value.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
};
