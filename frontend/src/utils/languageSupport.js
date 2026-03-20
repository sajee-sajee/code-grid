import { buildExecutionPlan } from "./testPlan.js";

export const SUPPORTED_LANGUAGES = [
    { id: "javascript", label: "JavaScript" },
    { id: "python", label: "Python" },
    { id: "java", label: "Java" },
];

const FILE_EXTENSIONS = {
    javascript: "js",
    python: "py",
    java: "java",
};

function extractArgNames(startCode) {
    const match = startCode.match(/function\s+\w+\s*\(([^)]*)\)/);
    if (!match) return ["input"];
    return match[1]
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => part.replace(/\s*=.+$/, "").trim());
}

function inferJavaType(value) {
    if (Array.isArray(value)) {
        if (!value.length) return "Object[]";
        const firstNonNull = value.find((item) => item !== null);
        if (firstNonNull === undefined) return "Object[]";
        const childType = inferJavaType(firstNonNull);
        if (/^(int|long|double|boolean|String|Integer|Long|Double|Boolean|Object)(\[\])*$/.test(childType)) {
            if (value.some((item) => item === null) && childType === "int") return "Integer[]";
            if (value.some((item) => item === null) && childType === "double") return "Double[]";
            if (value.some((item) => item === null) && childType === "boolean") return "Boolean[]";
            return `${childType}[]`;
        }
        return "Object[]";
    }
    if (typeof value === "number") {
        return Number.isInteger(value) ? "int" : "double";
    }
    if (typeof value === "boolean") {
        return "boolean";
    }
    if (typeof value === "string") {
        return "String";
    }
    if (value === null || value === undefined) {
        return "Object";
    }
    return "Object";
}

function inferJavaReturnType(planItem) {
    if (planItem?.comparator === "peakIndex" || planItem?.comparator === "equals") {
        return "int";
    }
    return inferJavaType(planItem?.expected);
}

function getJavaDefaultReturn(type) {
    if (type.endsWith("[]")) {
        const depth = (type.match(/\[\]/g) || []).length;
        const baseType = type.replace(/\[\]/g, "");
        return depth === 1 ? `new ${baseType}[0]` : `new ${baseType}[0][0]`;
    }
    if (type === "int" || type === "long") return "0";
    if (type === "double") return "0.0";
    if (type === "boolean") return "false";
    if (type === "String") return "\"\"";
    return "null";
}

function buildPythonStarter(question) {
    const argNames = extractArgNames(question.start);
    return `def solve(${argNames.join(", ")}):\n    # Write your solution here.\n    return None`;
}

function buildJavaStarter(question) {
    const argNames = extractArgNames(question.start);
    const plan = buildExecutionPlan(question.tests);
    const firstPlan = plan[0];
    const parameterTypes = (firstPlan?.args || []).map(inferJavaType);
    const returnType = inferJavaReturnType(firstPlan);
    const params = argNames.map((name, index) => `${parameterTypes[index] || "Object"} ${name}`).join(", ");

    return `class Solution {\n    public static ${returnType} solve(${params}) {\n        // Write your solution here.\n        return ${getJavaDefaultReturn(returnType)};\n    }\n}`;
}

export function getStarterCode(question, language) {
    if (language === "python") return buildPythonStarter(question);
    if (language === "java") return buildJavaStarter(question);
    return question.start;
}

export function buildStarterMap(question) {
    return SUPPORTED_LANGUAGES.reduce((acc, language) => {
        acc[language.id] = getStarterCode(question, language.id);
        return acc;
    }, {});
}

export function getFileExtension(language) {
    return FILE_EXTENSIONS[language] || "txt";
}
