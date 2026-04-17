import { formatValue, valuesEqual } from "./valueUtils.js";

function readExpression(source, startIndex, endChar, initialDepths = {}) {
    let index = startIndex;
    let depthParen = initialDepths.paren || 0;
    let depthBracket = initialDepths.bracket || 0;
    let depthBrace = initialDepths.brace || 0;
    let inString = false;
    let stringQuote = "";

    while (index < source.length) {
        const char = source[index];
        const prev = source[index - 1];

        if (inString) {
            if (char === stringQuote && prev !== "\\") {
                inString = false;
            }
            index += 1;
            continue;
        }

        if (char === "'" || char === '"' || char === "`") {
            inString = true;
            stringQuote = char;
            index += 1;
            continue;
        }

        if (char === "(") depthParen += 1;
        if (char === ")") depthParen -= 1;
        if (char === "[") depthBracket += 1;
        if (char === "]") depthBracket -= 1;
        if (char === "{") depthBrace += 1;
        if (char === "}") depthBrace -= 1;

        if (
            char === endChar &&
            depthParen === 0 &&
            depthBracket === 0 &&
            depthBrace === 0
        ) {
            return source.slice(startIndex, index);
        }

        index += 1;
    }

    return source.slice(startIndex);
}

function extractAssignedValue(source, variableName) {
    const assignmentIndex = source.indexOf(`const ${variableName} = `);
    if (assignmentIndex === -1) return null;
    const startIndex = assignmentIndex + `const ${variableName} = `.length;
    return readExpression(source, startIndex, ";");
}

function evaluateExpression(expression) {
    return new Function(`return (${expression});`)();
}

function safeExtractArgs(testFunc, source) {
    try {
        let captured = [];
        const mock = (...args) => { captured = args; return Object.assign([], { length: 0, sort:()=>[], map:()=>[] }); };
        testFunc(mock);
        if (captured.length > 0) return captured;
    } catch (e) {
        // ignore
    }
    
    // Fallback if proxy failed
    try {
        const callIndex = source.indexOf("f(");
        if (callIndex !== -1) {
            const rawArgs = readExpression(source, callIndex + 2, ")", { paren: 1 });
            return new Function(`return [${rawArgs}];`)();
        }
    } catch(e) {}
    
    return [];
}

function parseExpectedValue(source, expected) {
    if (source.includes("JSON.stringify(") && typeof expected === "string") {
        try {
            return JSON.parse(expected);
        } catch {
            return expected;
        }
    }
    return expected;
}

function detectTransform(source) {
    if (source.includes(".map(x => Math.round(x * 100) / 100)")) {
        return "round2";
    }
    if (source.includes(".sort((a, b) => a - b)")) {
        return "numericSort";
    }
    if (source.includes(".sort()")) {
        return "defaultSort";
    }
    return "identity";
}

function detectComparator(source) {
    if (source.includes("a[i] >") || source.includes("][i] >")) {
        return "peakIndex";
    }
    if (source.includes("i === 0")) {
        return "equals";
    }
    return "deepEqual";
}

export function applyOutputTransform(value, transform) {
    if (!Array.isArray(value)) return value;

    if (transform === "round2") {
        return value.map((item) => Math.round(Number(item) * 100) / 100);
    }
    if (transform === "numericSort") {
        return [...value].sort((left, right) => left - right);
    }
    if (transform === "defaultSort") {
        return [...value].sort();
    }

    return value;
}

function isValidPeakIndex(index, nums) {
    if (!Number.isInteger(index) || index < 0 || index >= nums.length) {
        return false;
    }

    const left = index > 0 ? nums[index - 1] : -Infinity;
    const right = index < nums.length - 1 ? nums[index + 1] : -Infinity;
    return nums[index] > left && nums[index] > right;
}

export function buildExecutionPlan(tests) {
    return tests.map((test) => {
        const source = test.r.toString();
        const comparator = detectComparator(source);
        const transform = detectTransform(source);
        const customArgs = extractAssignedValue(source, "a");
        const args = customArgs ? [evaluateExpression(customArgs)] : safeExtractArgs(test.r, source);
        const expected = comparator === "equals" ? 0 : parseExpectedValue(source, test.e);
        const expectedDisplay = comparator === "peakIndex" ? "valid peak index" : formatValue(applyOutputTransform(expected, transform));

        return {
            label: test.l,
            args,
            expected,
            expectedDisplay,
            transform,
            comparator,
        };
    });
}

export function buildCompilerTests(tests) {
    return buildExecutionPlan(tests).map(({ label, args }) => ({ label, args }));
}

export function resolveRemoteResult(planItem, executionResult) {
    if (executionResult?.error) {
        return {
            label: planItem.label,
            passed: false,
            output: null,
            expected: planItem.expectedDisplay,
            error: executionResult.error,
        };
    }

    const transformedOutput = applyOutputTransform(executionResult?.output, planItem.transform);
    const passed = planItem.comparator === "peakIndex"
        ? isValidPeakIndex(transformedOutput, planItem.args[0])
        : valuesEqual(transformedOutput, planItem.expected);

    return {
        label: planItem.label,
        passed,
        output: formatValue(transformedOutput),
        expected: planItem.expectedDisplay,
        error: null,
    };
}
