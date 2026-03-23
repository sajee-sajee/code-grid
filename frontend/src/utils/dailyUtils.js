const MS_PER_DAY = 86400000;

function toTimestamp(value) {
    if (value instanceof Date) return value.getTime();
    if (typeof value === "number") return value;
    if (typeof value === "string") return new Date(value).getTime();
    return Number.NaN;
}

export function getUtcDayStamp(value = Date.now()) {
    const timestamp = toTimestamp(value);
    return Number.isFinite(timestamp) ? Math.floor(timestamp / MS_PER_DAY) : null;
}

export function hasCompletedDailyToday(user) {
    if (!user?.lastDailyDate) return false;

    const lastDailyStamp = getUtcDayStamp(user.lastDailyDate);
    if (lastDailyStamp === null) return false;

    return lastDailyStamp === getUtcDayStamp(Date.now());
}
