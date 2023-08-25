
export function getDisplayTime(to: Date, from?: Date): string {
    const currentTime = (from || new Date()).getTime();
    const targetTime = to.getTime();
    const diff = Math.abs(currentTime - targetTime);

    // Last minute: Just Now
    if (diff <= 60000) {
        return 'Just now';
    }

    // Last hour: minutes (8 min)
    if (diff < 3.6e+6) {
        return Math.round(diff / 60000).toString() + ' min';
    }

    // Last 24 hours: short time (4:34PM)
    if (diff < 8.64e+7) {
        return to.toLocaleTimeString(undefined, { minute: '2-digit', hour: 'numeric' });
    }

    // Last week: short day (Wed)
    if (diff < 6.048e+8) {
        return to.toLocaleDateString(undefined, { weekday: 'short' });
    }

    // Last year: short month/day (Aug 28)
    if (diff < 3.154e+10) {
        return to.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
    }

    // More than a year: short date (8/28/2022)
    return to.toLocaleDateString();
}