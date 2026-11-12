import { useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import { ReadyState } from 'react-use-websocket';
import { WS_ROTATE_CLOSE_CODE } from '@/lib/utils/ws.utils';

const WS_URL =
    process.env.NEXT_PUBLIC_WS_URL ??
    (typeof window !== 'undefined'
        ? `wss://ws.${window.location.hostname}`
        : 'ws://localhost:8080');

const WS_DISABLED = process.env.NEXT_PUBLIC_WS_DISABLED === 'true';

export function useHeartbeat(token: string | null) {
    const lastCloseCode = useRef<number | null>(null);

    // a null url means react-use-websocket never connects
    const ws = useWebSocket(!WS_DISABLED && token ? `${WS_URL}?token=${token}` : null, {
        // 1008 = Policy Violation (server sends this on bad token), don't retry
        shouldReconnect: (closeEvent) => {
            lastCloseCode.current = closeEvent.code;
            return closeEvent.code !== 1008;
        },
        // a planned rotation should reconnect right away so the candidate is barely offline
        reconnectInterval: () => (lastCloseCode.current === WS_ROTATE_CLOSE_CODE ? 0 : 5000), // 5 seconds
        reconnectAttempts: 1440, // 2 hours total
    });

    return {
        ...ws,
        isConnected: WS_DISABLED || ws.readyState === ReadyState.OPEN,
    };
}
