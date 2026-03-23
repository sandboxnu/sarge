import { WebSocketServer } from 'ws';

const ws = new WebSocketServer({ port: 8080 });

ws.on('connection', (ws) => {
    let message;
    ws.on('message', (data) => {
        message = data;
    });
    ws.send(message);
});
