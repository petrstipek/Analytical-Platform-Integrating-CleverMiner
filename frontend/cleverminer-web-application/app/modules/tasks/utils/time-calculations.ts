function formatElapsedMs(ms: number) {
  if (!Number.isFinite(ms) || ms < 0) return '—';

  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

type DateLike = string | Date | null | undefined;

function toMs(value: DateLike): number | null {
  if (!value) return null;
  if (value instanceof Date) return value.getTime();
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? null : ms;
}

export function elapsed(start?: DateLike, end?: DateLike) {
  const startMs = toMs(start);
  if (startMs === null) return '—';

  const endMs = toMs(end) ?? Date.now();
  return formatElapsedMs(endMs - startMs);
}
