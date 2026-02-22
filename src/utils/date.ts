export const formatLocalizedDate = (value: Date | string): string => {
  if (!value) return '';

  const date = new Date(value);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userLocale = navigator.language;

  return date.toLocaleString(userLocale, {
    timeZone: userTimeZone,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};
