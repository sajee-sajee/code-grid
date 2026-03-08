export function xpToLevel(xp) {
    return Math.floor(xp / 300) + 1;
}

export function levelXp(xp) {
    return xp % 300;
}
