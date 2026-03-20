export function normalizeValue(value) {
    if (value === undefined) return { __type: "undefined" };
    if (typeof value === "number") {
        if (Number.isNaN(value)) return { __type: "NaN" };
        if (!Number.isFinite(value)) return { __type: value > 0 ? "Infinity" : "-Infinity" };
        return value;
    }
    if (Array.isArray(value)) {
        return value.map(normalizeValue);
    }
    if (value && typeof value === "object") {
        return Object.keys(value).sort().reduce((acc, key) => {
            acc[key] = normalizeValue(value[key]);
            return acc;
        }, {});
    }
    return value;
}

export function formatValue(value) {
    try {
        const serialized = JSON.stringify(normalizeValue(value));
        return serialized === undefined ? String(value) : serialized;
    } catch {
        return String(value);
    }
}

export function valuesEqual(left, right) {
    return formatValue(left) === formatValue(right);
}
