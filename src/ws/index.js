import { WebSocketServer } from 'ws';
import { jwtVerify } from 'jose';

const ws = new WebSocketServer({ port: 8080 });
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// <userId, socket>
const clients = new Map();

const HEARTBEAT_INTERVAL = 5000;

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
    }, HEARTBEAT_INTERVAL);
}

ws.on('connection', async (socket, request) => {
    const token = getTokenFromRequest(request);
    try {
        const payload = await verifyToken(token ?? '');
        socket.userId = payload.userId;
        socket.isAlive = true;
        clients.set(payload.userId, socket);
    } catch {
        socket.close(1008, 'Unauthorized');
        return;
    }

    socket.heartbeat = startHeartbeat(socket);

    socket.on('message', (data) => {
        socket.send(data.toString('utf-8'));
    });

    socket.on('pong', () => {
        socket.isAlive = true;
    });

    socket.on('close', (code, reason) => {
        if (!socket.userId) return;
        clearInterval(socket.heartbeat);
        clients.delete(socket.userId);
        console.log(
            `Client ${socket.userId} disconnected | code: ${code}, reason: ${reason.toString()}`
        );
    });

    socket.on('error', (err) => {
        console.error(`Socket error for ${socket.userId}:`, err.message);
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
