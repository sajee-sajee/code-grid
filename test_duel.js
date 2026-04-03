import { normalizeDuelResult, getDuelOutcome } from './frontend/src/utils/duelOutcome.js';

console.log(normalizeDuelResult({
    playerScore: 400,
    cpuScore: 0
}));

console.log(normalizeDuelResult({
    playerScore: 0,
    cpuScore: 240
}));

console.log(normalizeDuelResult({
    playerScore: 400,
    cpuScore: 240
}));

console.log(normalizeDuelResult({
    playerScore: 200,
    cpuScore: 240
}));
