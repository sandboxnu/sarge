import { WebSocketServer } from 'ws';

const ws = new WebSocketServer({ port: 8080 });

ws.on('connection', (ws) => {
    ws.on('message', (data) => {
        ws.send(data.toString('utf-8'));
    });
});
