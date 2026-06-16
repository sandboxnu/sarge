const SHORT_MONTH_DAY_YEAR = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
});

export function formatShortMonthDayYear(value: Date | number | string): string {
    const date = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;
    return SHORT_MONTH_DAY_YEAR.format(date);
}

export function formatDeadline(date: Date | null): string {
    if (!date) return 'No due date';
    const d = new Date(date);
    const month = d.toLocaleString('en-US', { month: 'long' });
    const day = d.getDate();
    const year = d.getFullYear();
    const minutes = d.getMinutes();
    const ampm = d.getHours() >= 12 ? 'pm' : 'am';
    const hour12 = d.getHours() % 12 || 12;
    const time =
        minutes === 0 ? `${hour12}${ampm}` : `${hour12}:${String(minutes).padStart(2, '0')}${ampm}`;
    return `${month} ${day}${ordinalSuffix(day)} ${year} at ${time}`;
}

function ordinalSuffix(day: number): string {
    const ones = day % 10;
    const tens = day % 100;
    if (ones === 1 && tens !== 11) return 'st';
    if (ones === 2 && tens !== 12) return 'nd';
    if (ones === 3 && tens !== 13) return 'rd';
    return 'th';
}

export function todayLocalISODate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function endOfDayISO(value: string): string {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day, 23, 59, 59, 999).toISOString();
}

export function formatDuration(totalSeconds: number): string {
    const minutes = Math.round(totalSeconds / 60);
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    return remaining > 0 ? `${hours}h ${remaining}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
}
