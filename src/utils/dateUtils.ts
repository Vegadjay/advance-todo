
import { format, isToday, isYesterday, addDays } from 'date-fns';

export const formatDate = (date: Date): string => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  
  return format(date, 'MMM dd, yyyy');
};

export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};

export const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const groupByDate = <T extends { createdAt: Date }>(items: T[]): Record<string, T[]> => {
  const grouped: Record<string, T[]> = {};
  
  items.forEach(item => {
    const dateKey = format(item.createdAt, 'yyyy-MM-dd');
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    
    grouped[dateKey].push(item);
  });
  
  return grouped;
};

export const getNextNDays = (n: number): Date[] => {
  const days: Date[] = [];
  const today = new Date();
  
  for (let i = 0; i < n; i++) {
    days.push(addDays(today, i));
  }
  
  return days;
};
