import { runCompiler } from "../services/api.js";
import { formatValue, valuesEqual } from "./valueUtils.js";
import { buildExecutionPlan, resolveRemoteResult } from "./testPlan.js";

function getErrorMessage(error) {
    if (error instanceof Error) {
        return `${error.name}: ${error.message}`;
    }
    return String(error);
}

function compileSolutionFactory(code) {
    const fnMatch = code.match(/function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(/);
    const arrowMatch = code.match(/(?:const|let|var)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*(?:\([^)]*\)|[a-zA-Z_$][0-9a-zA-Z_$]*)\s*=>/);
    const extractedName = (fnMatch && fnMatch[1]) || (arrowMatch && arrowMatch[1]);
    
    const dynamicCandidate = (extractedName && !["solve", "solution", "main"].includes(extractedName))
        ? `(typeof ${extractedName} === "function" && ${extractedName}) || `
        : "";

    return new Function(`
        "use strict";
        return function createSolve() {
            const module = { exports: {} };
            const exports = module.exports;

            ${code}

            const candidate =
                ${dynamicCandidate}(typeof solve === "function" && solve) ||
                (typeof solution === "function" && solution) ||
                (typeof main === "function" && main) ||
                (typeof module.exports === "function" && module.exports) ||
                (module.exports && typeof module.exports.solve === "function" && module.exports.solve) ||
                (exports && typeof exports.solve === "function" && exports.solve);

            if (typeof candidate === "function") {
                return candidate;
            }

            throw new Error("No callable solution found. Define solve(...) in the editor.");
        };
    `)();
}

function evalJavaScript(code, tests) {
    let createSolve;

    try {
        createSolve = compileSolutionFactory(code);
    } catch (error) {
        const message = getErrorMessage(error);
        return tests.map((test) => ({
            label: test.l,
            passed: false,
            output: null,
            expected: formatValue(test.e),
            error: message,
        }));
    }

    return tests.map((test) => {
        try {
            const solve = createSolve();
            const actual = test.r(solve);
            const passed = valuesEqual(actual, test.e);

            return {
                label: test.l,
                passed,
                output: formatValue(actual),
                expected: formatValue(test.e),
                error: null,
            };
        } catch (error) {
            return {
                label: test.l,
                passed: false,
                output: null,
                expected: formatValue(test.e),
                error: getErrorMessage(error),
            };
        }
    });
}

async function evalRemoteLanguage(code, tests, language) {
    const plan = buildExecutionPlan(tests);

    try {
        const response = await runCompiler({
            language,
            code,
            tests: plan.map(({ label, args }) => ({ label, args })),
        });

        const results = Array.isArray(response.data?.results) ? response.data.results : [];
        return plan.map((planItem, index) => resolveRemoteResult(planItem, results[index]));
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Remote compiler failed.";
        return plan.map((planItem) => ({
            label: planItem.label,
            passed: false,
            output: null,
            expected: planItem.expectedDisplay,
            error: message,
        }));
    }
}

export async function evalCode(code, tests, language = "javascript") {
    if (language === "javascript") {
        return evalJavaScript(code, tests);
    }

    return evalRemoteLanguage(code, tests, language);
}
