import { DateTime } from 'luxon';

const OA_TIMEZONE = 'America/New_York';

const INTERNAL_API_URL = process.env.INTERNAL_API_URL;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;

async function runExpire() {
    if (!INTERNAL_API_SECRET || !INTERNAL_API_URL) {
        console.warn('INTERNAL_API_SECRET or INTERNAL_API_URL is missing, skipping expiry check');
        return;
    }
    try {
        const res = await fetch(`${INTERNAL_API_URL}/api/internal/expire`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-SARGE-INTERNAL-SECRET': INTERNAL_API_SECRET,
            },
        });

        if (!res.ok) {
            console.error(`Expiry check failed (${res.status})`);
            return;
        }
    } catch (err) {
        console.error('Expiry check error:', err.message);
    }
}

function msUntilNextMidnight() {
    const now = DateTime.now().setZone(OA_TIMEZONE);
    const nextMidnight = now.plus({ days: 1 }).startOf('day');
    return nextMidnight.diff(now).as('milliseconds');
}

function scheduleNextExpire() {
    const delay = msUntilNextMidnight();
    console.log(
        `Sarge scheduler: next expiry check in ${Math.round(delay / 1000)} seconds (midnight ${OA_TIMEZONE})`
    );
    setTimeout(() => {
        runExpire();
        // NOTE(laith): recursive call which calculcates the delay to avoid the few times of year where daylight savings occurs and we don't accidently expire OAs an hour before or after midnight
        scheduleNextExpire();
    }, delay);
}

scheduleNextExpire();
