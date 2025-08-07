import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k: number = 1024;
  const size: string[] = ["Bytes", "KB", "MB", "GB", "TB"];

  const i: number = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + size[i];
};

export const generateUUID = () => crypto.randomUUID();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
