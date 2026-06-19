const INTERNAL_API_URL = process.env.INTERNAL_API_URL;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;

async function runExpire() {
    if (!INTERNAL_API_SECRET || !INTERNAL_API_URL) {
        console.warn(
            'INTERNAL_API_SECRET or INTERNAL_API_URL is missing, skipping expiry check'
        );
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
        console.error('Expiry sweep error:', err.message);
    }
}

function msUntilNextMidnight() {
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);
    return nextMidnight.getTime() - now.getTime();
}

function scheduleNextExpire() {
    const delay = msUntilNextMidnight();
    console.log(
        `Sarge scheduler: next expiry check in ${Math.round(delay / 1000)} seconds (midnight)`
    );
    setTimeout(() => {
        runExpire();
        // NOTE(laith): recursive call which calculcates the delay to avoid the few times of year where daylight savings occurs and we don't accidently expire OAs an hour before or after midnight
        scheduleNextExpire();
    }, delay);
}

scheduleNextExpire();
