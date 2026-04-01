'use client';

import { useEffect, useRef, useState } from 'react';

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function useAssessmentTimer(totalTimeSeconds: number, started: boolean) {
    const [remainingSeconds, setRemainingSeconds] = useState(totalTimeSeconds);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!started) return;

        intervalRef.current = setInterval(() => {
            setRemainingSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [started]);

    return {
        remainingSeconds,
        formattedTime: formatTime(remainingSeconds),
        isExpired: remainingSeconds === 0 && started,
    };
}
