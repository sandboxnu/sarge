const SHORT_MONTH_DAY_YEAR = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
});

export function formatShortMonthDayYear(value: Date | number | string): string {
    const date =
        typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;
    return SHORT_MONTH_DAY_YEAR.format(date);
}

export function formatDeadline(date: Date | null): string {
    // TODO(laith): update when deadlines are a thing
    if (!date) return 'April 12, 2026 11:59PM EST';
    return new Date(date).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

export function formatDuration(totalSeconds: number): string {
    const minutes = Math.round(totalSeconds / 60);
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    return remaining > 0 ? `${hours}h ${remaining}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
}
