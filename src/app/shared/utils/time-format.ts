export function formatDurationAsHHMM(minutes: number | null | undefined): string {
  if (minutes == null || minutes <= 0) {
    return '00:00';
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}
