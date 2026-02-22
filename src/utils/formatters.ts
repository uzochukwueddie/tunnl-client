import type { Tunnel } from '../types';

export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

export function calculateUptime(tunnel: Tunnel): string {
  if (!tunnel) return '';

  const start = new Date(tunnel.created_at).getTime();

  // For active tunnels, measure to now.
  // For closed tunnels, measure to closed_at if available, otherwise last_activity.
  const end =
    tunnel.status === 'active'
      ? Date.now()
      : new Date(tunnel.closed_at ?? tunnel.last_activity ?? tunnel.created_at).getTime();

  const totalSeconds = Math.max(0, Math.floor((end - start) / 1000));

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Build the string from largest to smallest unit, skipping leading zeros
  // but always showing at least seconds (e.g. "0s" for a brand new tunnel)
  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}
