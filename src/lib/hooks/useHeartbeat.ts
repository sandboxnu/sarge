import useWebSocket from 'react-use-websocket';
import { ReadyState } from 'react-use-websocket';

const WS_URL = 'ws://localhost:8080';

export function useHeartbeat(token: string | null) {
    const ws = useWebSocket(token ? `${WS_URL}?token=${token}` : null, {
        // 1008 = Policy Violation (server sends this on bad token), don't retry
        shouldReconnect: (closeEvent) => closeEvent.code !== 1008,
    });

    return {
        ...ws,
        isConnected: ws.readyState === ReadyState.OPEN,
    };
}
