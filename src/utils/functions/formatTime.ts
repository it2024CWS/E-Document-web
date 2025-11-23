export const formatTime = (value: Date | string | number): string => {
  const date = new Date(value);

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit', // e.g., '09'
    minute: '2-digit', // e.g., '34'
    hour12: true, // Use 12-hour clock with AM/PM
  });
};
