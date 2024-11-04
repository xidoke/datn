import {
  format,
  parseISO,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";

export const formatDate = (
  date: string | Date,
  formatString: string = "yyyy-MM-dd",
): string => {
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return format(parsedDate, formatString);
};

export const getRelativeTime = (date: string | Date): string => {
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  const now = new Date();

  const daysDiff = differenceInDays(now, parsedDate);
  if (daysDiff > 0) return `${daysDiff} day${daysDiff > 1 ? "s" : ""} ago`;

  const hoursDiff = differenceInHours(now, parsedDate);
  if (hoursDiff > 0) return `${hoursDiff} hour${hoursDiff > 1 ? "s" : ""} ago`;

  const minutesDiff = differenceInMinutes(now, parsedDate);
  if (minutesDiff > 0)
    return `${minutesDiff} minute${minutesDiff > 1 ? "s" : ""} ago`;

  return "Just now";
};
