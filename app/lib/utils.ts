import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(imageId: string) {
  return `${process.env.DB_DOMAIN}:${process.env.DB_PORT}/assets/${imageId}`;
}
