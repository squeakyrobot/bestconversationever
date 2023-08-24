
export function getDisplayTime(time: Date, from?: Date): string {
    const currentTime = (from || new Date()).getTime();
    const targetTime = time.getTime();
    const diff = Math.abs(currentTime - targetTime);

    if (diff <= 60000) {
        return 'Just now';
    }

    if (diff <= 3.6e+6) {
        return Math.round(diff / 60000).toString() + ' min';
    }

    if (diff <= 8.64e+7) {
        return time.toLocaleTimeString(undefined, { minute: '2-digit', hour: '2-digit' });
    }

    if (diff <= 6.048e+8) {
        return time.toLocaleDateString(undefined, { weekday: 'short' });
    }

    if (diff <= 3.154e+10) {
        return time.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
    }

    return time.toLocaleDateString();
}