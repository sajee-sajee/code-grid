import { QUESTIONS } from "../constants/questions";

const DIFFICULTY_ORDER = ["Easy", "Medium", "Hard"];

function getLevelQuestions(levelId) {
    return QUESTIONS[levelId] || QUESTIONS[1] || [];
}

function readNextIndex(storageKey) {
    try {
        const parsed = Number(window.localStorage.getItem(storageKey) || "0");
        return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    } catch {
        return 0;
    }
}

function writeNextIndex(storageKey, nextIndex) {
    try {
        window.localStorage.setItem(storageKey, String(nextIndex));
    } catch {
        // Ignore storage failures and keep duel playable.
    }
}

export function getAvailableDifficulties(levelId) {
    const levelQuestions = getLevelQuestions(levelId);
    return DIFFICULTY_ORDER.filter((diff) => levelQuestions.some((q) => q.diff === diff));
}

export function getQuestionSet(levelId, diff) {
    const levelQuestions = getLevelQuestions(levelId);
    const matchedQuestions = levelQuestions.filter((q) => q.diff === diff);
    return matchedQuestions.length ? matchedQuestions : levelQuestions;
}

export function pickNextQuestion(levelId, diff) {
    const questionSet = getQuestionSet(levelId, diff);
    if (!questionSet.length) return null;
    if (questionSet.length === 1 || typeof window === "undefined") return questionSet[0];

    const storageKey = `cg_duel_question_index_${levelId}_${diff || "all"}`;
    const nextIndex = readNextIndex(storageKey);
    const selectedQuestion = questionSet[nextIndex % questionSet.length];

    writeNextIndex(storageKey, nextIndex + 1);
    return selectedQuestion;
}
