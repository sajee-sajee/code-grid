export function getNow() {
    return Date.now();
}

export function getTodayIsoDate() {
    return new Date(getNow()).toISOString().slice(0, 10);
}
