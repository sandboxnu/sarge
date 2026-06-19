import { WebSocketServer } from 'ws';
import { jwtVerify } from 'jose';

const HEARTBEAT_INTERVAL = 5000;
const INTERNAL_API_URL = process.env.INTERNAL_API_URL;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;

const ws = new WebSocketServer({ port: 8080 });
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// <candidateEmail, socket>
const clients = new Map();

console.log('Sarge WS server listening on 8080');

async function postDisconnectSnapshot(candidateEmail) {
    if (!INTERNAL_API_SECRET || !INTERNAL_API_URL) {
        console.warn(
            'INTERNAL_API_SECRET or INTERNAL_API_URL is missing, skipping disconnect snapshot'
        );
        return;
    }
    try {
        const res = await fetch(`${INTERNAL_API_URL}/api/internal/snapshot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-SARGE-INTERNAL-SECRET': INTERNAL_API_SECRET,
            },
            body: JSON.stringify({ candidateEmail }),
        });
        if (!res.ok) {
            console.error(`Disconnect snapshot failed (${res.status})`);
        }
    } catch (err) {
        console.error('Disconnect snapshot error:', err.message);
    }
}

function getTokenFromRequest(request) {
    return new URL(request.url ?? '/', 'ws://x').searchParams.get('token');
}

async function verifyToken(token) {
    const { payload } = await jwtVerify(token, secret);
    return payload;
}

function startHeartbeat(socket) {
    return setInterval(() => {
        if (!socket.isAlive) {
            // TODO(laith): add an offline timer before the socket gets terminated unique to each user
            // Once done, send an API request back to server to end the OA

            // terminate() jumps to socket.on('close')
            socket.terminate();
            return;
        }
        socket.isAlive = false;
        socket.ping();
        console.log(`[${new Date().toISOString()}] PINGING ${socket.candidateEmail}`);
    }, HEARTBEAT_INTERVAL);
}

ws.on('connection', async (socket, request) => {
    const token = getTokenFromRequest(request);
    try {
        const payload = await verifyToken(token ?? '');
        socket.candidateEmail = payload.email;
        socket.isAlive = true;
        console.log(`Candidate Connected: ${socket.candidateEmail}`);
        clients.set(payload.candidateEmail, socket);
    } catch {
        socket.close(1008, 'Unauthorized');
        console.log(`[${new Date().toISOString()}] Unauthorized connection. Closing.`);
        return;
    }

    socket.heartbeat = startHeartbeat(socket);

    socket.on('message', (data) => {
        socket.send(data.toString('utf-8'));
    });

    socket.on('pong', () => {
        console.log(`[${new Date().toISOString()}] PONG FROM ${socket.candidateEmail}`);
        socket.isAlive = true;
    });

    socket.on('close', (code, reason) => {
        if (!socket.candidateEmail) return;
        clearInterval(socket.heartbeat);
        clients.delete(socket.candidateEmail);
        console.log(
            `Client ${socket.candidateEmail} disconnected | code: ${code}, reason: ${reason.toString()}`
        );
        // NOTE(laith): not awaiting this call since we don't want to block the server
        postDisconnectSnapshot(socket.candidateEmail);
    });

    socket.on('error', (err) => {
        console.error(`Socket error for ${socket.candidateEmail}:`, err.message);
    });
});

ws.on('error', (err) => {
    console.error('Socket error: ', err);
});

ws.on('close', () => {
    for (const socket of clients.values()) {
        socket.close(1001, 'Shutting down server');
    }
});
