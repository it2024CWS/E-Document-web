const pad = (n: number) => String(n).padStart(2, '0');

export const formatDate = (value: string | number | Date | null | undefined): string => {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '-';
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

export const formatDateTime = (value: string | number | Date | null | undefined): string => {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '-';
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
