export function formatDeadline(date: Date | null): string {
    if (!date) return 'No deadline';
    return new Date(date).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

export function formatDuration(totalSeconds: number): string {
    const minutes = Math.round(totalSeconds / 60);
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    return remaining > 0 ? `${hours}h ${remaining}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
}
