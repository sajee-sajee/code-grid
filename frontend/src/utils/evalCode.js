export function evalCode(code, tests) {
    return tests.map((t) => {
        try {
            const fn = new Function(
                `${code}\nif(typeof solve==='function')return solve;\nthrow new Error('No function named solve')`
            )();
            const raw = t.r(fn);
            const out = typeof raw === "object" ? JSON.parse(JSON.stringify(raw)) : raw;
            const passed = JSON.stringify(out) === JSON.stringify(t.e);
            return { label: t.l, passed, output: JSON.stringify(out), expected: JSON.stringify(t.e), error: null };
        } catch (e) {
            return { label: t.l, passed: false, output: null, expected: JSON.stringify(t.e), error: e.message };
        }
    });
}
