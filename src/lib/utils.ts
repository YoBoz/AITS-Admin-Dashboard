import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import type { Role } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, pattern = 'MMM dd, yyyy'): string {
  return format(new Date(date), pattern);
}

export function formatNumber(num: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(num);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function getRoleColor(role: Role): string {
  const colors: Record<Role, string> = {
    super_admin: 'bg-brand text-white',
    terminal_admin: 'bg-status-info text-white',
    operator: 'bg-status-success text-white',
    viewer: 'bg-gray-500 text-white',
  };
  return colors[role] || 'bg-gray-500 text-white';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-status-success/10 text-status-success',
    inactive: 'bg-gray-500/10 text-gray-500',
    maintenance: 'bg-status-warning/10 text-status-warning',
    error: 'bg-status-error/10 text-status-error',
    online: 'bg-status-success/10 text-status-success',
    offline: 'bg-gray-500/10 text-gray-500',
  };
  return colors[status] || 'bg-gray-500/10 text-gray-500';
}
