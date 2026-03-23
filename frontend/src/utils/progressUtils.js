import { QUESTIONS } from "../constants/questions";

export function getQuestionCountForLevel(levelId) {
    return (QUESTIONS[levelId] || []).length;
}

export function getSolvedCountForLevel(user, levelId) {
    return (user?.solved || []).filter((solve) => solve.levelId === levelId).length;
}
