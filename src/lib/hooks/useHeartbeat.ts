import useWebSocket from 'react-use-websocket';
import { ReadyState } from 'react-use-websocket';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8080';

export function useHeartbeat(token: string | null) {
    const ws = useWebSocket(token ? `${WS_URL}?token=${token}` : null, {
        // 1008 = Policy Violation (server sends this on bad token), don't retry
        shouldReconnect: (closeEvent) => closeEvent.code !== 1008,
        reconnectInterval: 5000, // 5 seconds
        reconnectAttempts: 1440, // 2 hours total
    });

    return {
        ...ws,
        isConnected: ws.readyState === ReadyState.OPEN,
    };
}
