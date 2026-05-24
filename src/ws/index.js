import { WebSocketServer } from 'ws';
import { jwtVerify } from 'jose';

const ws = new WebSocketServer({ port: 8080 });
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const INTERNAL_API_URL = process.env.INTERNAL_API_URL ?? 'http://localhost:3000';
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;

console.log('Sarge WS server listening on 8080');

// <candidateEmail, socket>
const clients = new Map();

const HEARTBEAT_INTERVAL = 5000;

async function recordDisconnectSnapshot(candidateEmail) {
    if (!INTERNAL_API_SECRET) {
        console.warn('INTERNAL_API_SECRET not set; skipping disconnect snapshot');
        return;
    }
    try {
        const res = await fetch(`${INTERNAL_API_URL}/api/internal/disconnect-snapshot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-internal-secret': INTERNAL_API_SECRET,
            },
            body: JSON.stringify({ candidateEmail }),
        });
        if (!res.ok) {
            const text = await res.text();
            console.error(`Disconnect snapshot failed (${res.status}): ${text}`);
        }
    } catch (err) {
        console.error('Disconnect snapshot request error:', err.message);
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
            // TODO: add an offline timer before the socket gets terminated unique to each user
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
        // Fire-and-forget: server-side snapshot since the client can't write it
        // from a closed socket.
        recordDisconnectSnapshot(socket.candidateEmail);
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
