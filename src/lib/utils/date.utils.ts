import { DateTime } from 'luxon';

const OA_TIMEZONE = 'America/New_York';

export function formatShortMonthDayYear(value: Date | number | string): string {
    return DateTime.fromJSDate(new Date(value)).setZone(OA_TIMEZONE).toFormat('MMM dd, yyyy');
}

export function formatDeadline(date: Date | string | null): string {
    if (!date) return 'No due date';

    let dt: DateTime;
    if (typeof date === 'string') {
        dt = DateTime.fromISO(date, { zone: OA_TIMEZONE });
    } else {
        dt = DateTime.fromJSDate(date).setZone(OA_TIMEZONE);
    }

    if (!dt.isValid) return 'Invalid due date';

    const day = dt.day;
    const time =
        dt.minute === 0 ? dt.toFormat('ha').toLowerCase() : dt.toFormat('h:mma').toLowerCase();
    const tz = dt.offsetNameShort;

    return `${dt.toFormat('MMM')} ${day}${ordinalSuffix(day)} ${dt.year} at ${time} (${tz})`;
}

function ordinalSuffix(day: number): string {
    const ones = day % 10;
    const tens = day % 100;
    if (ones === 1 && tens !== 11) return 'st';
    if (ones === 2 && tens !== 12) return 'nd';
    if (ones === 3 && tens !== 13) return 'rd';
    return 'th';
}

export function getMinPickableDate(): string {
    return DateTime.now().setZone(OA_TIMEZONE).toISODate() ?? '';
}

export function getDateToEOD(value: string): string {
    return DateTime.fromISO(value, { zone: OA_TIMEZONE }).endOf('day').toUTC().toISO() ?? '';
}

export function formatDuration(totalSeconds: number): string {
    const minutes = Math.round(totalSeconds / 60);

    if (minutes < 60) {
        return `${minutes} minutes`;
    }

    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    return remaining > 0 ? `${hours}h ${remaining}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
}
