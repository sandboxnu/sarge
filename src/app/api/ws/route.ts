import snapshotService from '@/lib/services/snapshot.service';
import { WS_ROTATE_CLOSE_CODE } from '@/lib/utils/ws.utils';
import { getDeadline, upgradeWebSocket } from '@vercel/functions';
import { jwtVerify } from 'jose';

// Vercel closes each WebSocket at the function's max duration (default 300s). 800s is the
// Pro plan's max, so connections rotate about every 13 minutes instead of every 5.
// Lower this if the project ever moves to Hobby (capped at 300s) or deploys will fail.
export const maxDuration = 800;

const HEARTBEAT_INTERVAL = 5000;
// Close this long before Vercel's max duration so the close handler still gets to run
const ROTATE_BEFORE_DEADLINE_MS = 10_000;

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(request: Request) {
    const token = getTokenFromRequest(request);
    const deadline = getDeadline();

    return upgradeWebSocket(async (ws) => {
        let email: string;
        try {
            email = await verifyToken(token ?? '');
        } catch {
            ws.close(1008, 'Unauthorized');
            return;
        }

        let isAlive = true;

        const heartbeat = setInterval(() => {
            if (!isAlive) {
                // TODO(laith): add an offline timer before the socket gets terminated unique to each user
                // Once done, send an API request back to server to end the OA

                // terminate() jumps to ws.on('close')
                ws.terminate();
                return;
            }
            isAlive = false;
            ws.ping();
        }, HEARTBEAT_INTERVAL);

        // TODO(Alex): implement overlapping socket rotation to avoid gaps in connectivity
        let rotating = false;
        const rotation = deadline
            ? setTimeout(
                  () => {
                      rotating = true;
                      ws.close(WS_ROTATE_CLOSE_CODE, 'Rotating');
                  },
                  Math.max(0, deadline.getTime() - Date.now() - ROTATE_BEFORE_DEADLINE_MS)
              )
            : undefined;

        ws.on('pong', () => {
            isAlive = true;
        });

        ws.on('close', () => {
            clearInterval(heartbeat);
            clearTimeout(rotation);
            if (rotating) return;
            // NOTE(laith): not awaiting this call since we don't want to block the server
            snapshotService.createDisconnectSnapshot(email).catch((err) => {
                console.error('Disconnect snapshot error:', err);
            });
        });

        ws.on('error', (err) => {
            console.error(`Socket error for ${email}:`, err.message);
        });
    });
}

function getTokenFromRequest(request: Request) {
    return new URL(request.url).searchParams.get('token');
}

async function verifyToken(token: string) {
    const { payload } = await jwtVerify<{ email?: unknown }>(token, secret);
    if (typeof payload.email !== 'string') {
        throw new Error('Token is missing email');
    }
    return payload.email;
}
