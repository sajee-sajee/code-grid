function toFiniteScore(value) {
    const score = Number(value);
    return Number.isFinite(score) ? score : null;
}

export function getDuelOutcome(result = {}) {
    const playerScore = toFiniteScore(result.playerScore);
    const cpuScore = toFiniteScore(result.cpuScore);

    if (playerScore !== null && cpuScore !== null) {
        if (playerScore > cpuScore) {
            return { won: true, isTie: false };
        }

        if (playerScore < cpuScore) {
            return { won: false, isTie: false };
        }

        return { won: false, isTie: true };
    }

    return { won: Boolean(result.won), isTie: false };
}

export function normalizeDuelResult(result = {}) {
    const playerScore = toFiniteScore(result.playerScore) ?? 0;
    const cpuScore = toFiniteScore(result.cpuScore) ?? 0;
    const outcome = getDuelOutcome({ ...result, playerScore, cpuScore });

    return {
        ...result,
        playerScore,
        cpuScore,
        won: outcome.won,
        isTie: outcome.isTie,
    };
}
