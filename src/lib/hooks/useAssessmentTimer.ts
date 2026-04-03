'use client';

import { useEffect, useState } from 'react';

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function useAssessmentTimer(totalTimeSeconds: number, started: boolean) {
    const [remainingSeconds, setRemainingSeconds] = useState(totalTimeSeconds);

    // totalTimeSeconds is 0 on first render (sections not loaded); sync when tasks arrive.
    useEffect(() => {
        setRemainingSeconds(totalTimeSeconds);
    }, [totalTimeSeconds]);

    useEffect(() => {
        if (!started) return;

        const id = setInterval(() => {
            setRemainingSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(id);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(id);
    }, [started]);

    return {
        remainingSeconds,
        formattedTime: formatTime(remainingSeconds),
        isExpired: remainingSeconds === 0 && started,
    };
}
