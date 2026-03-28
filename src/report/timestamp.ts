import type { ReportTimestamp } from './types.js';

export function generateTimestamp(): ReportTimestamp {
  const now = new Date();

  return {
    iso: now.toISOString(),
    local: now.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    }),
  };
}
