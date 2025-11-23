export const formatDate = (date: Date): string => {
  const year = date.getFullYear(); // Get the full year (e.g., 2025)
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1 and pad with '0' if needed
  const day = String(date.getDate()).padStart(2, "0"); // Get the day of the month and pad with '0' if needed

  return `${year}-${month}-${day}`;
};
