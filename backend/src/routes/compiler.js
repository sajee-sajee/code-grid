const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const { randomUUID } = require("crypto");
const { spawn } = require("child_process");
const router = require("express").Router();

const EXECUTION_TIMEOUT_MS = 8000;

function runCommand(command, args, { cwd, input, timeoutMs = EXECUTION_TIMEOUT_MS } = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { cwd, stdio: "pipe" });
        let stdout = "";
        let stderr = "";
        let settled = false;
        let timedOut = false;

        const timer = setTimeout(() => {
            timedOut = true;
            child.kill("SIGKILL");
        }, timeoutMs);

        child.stdout.on("data", (chunk) => {
            stdout += chunk.toString();
        });

        child.stderr.on("data", (chunk) => {
            stderr += chunk.toString();
        });

        child.on("error", (error) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            reject(error);
        });

        child.on("close", (code, signal) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            resolve({ code, signal, stdout, stderr, timedOut });
        });

        if (input) {
            child.stdin.write(input);
        }
        child.stdin.end();
    });
}

function buildErrorResults(tests, message) {
    return tests.map(() => ({ output: null, error: message }));
}

function ensureJavaSolutionClass(code) {
    if (/\bclass\s+Solution\b/.test(code)) {
        return code;
    }

    return `public class Solution {\n${code}\n}\n`;
}

async function runPython(code, tests, tempDir) {
    const runnerPath = path.join(tempDir, "runner.py");
    const runner = `
import json
import sys


def normalize(value):
    if isinstance(value, tuple):
        return [normalize(item) for item in value]
    if isinstance(value, list):
        return [normalize(item) for item in value]
    if isinstance(value, dict):
        return {str(key): normalize(item) for key, item in value.items()}
    if isinstance(value, set):
        return sorted([normalize(item) for item in value], key=lambda item: json.dumps(item, sort_keys=True))
    return value


payload = json.loads(sys.stdin.read() or "{}")
tests = payload.get("tests", [])
code = payload.get("code", "")
results = []

try:
    compiled = compile(code, "<submitted>", "exec")
except Exception as error:
    message = f"{error.__class__.__name__}: {error}"
    print(json.dumps([{"output": None, "error": message} for _ in tests]))
    raise SystemExit(0)

for test in tests:
    try:
        namespace = {}
        exec(compiled, namespace)
        fn = namespace.get("solve") or namespace.get("solution") or namespace.get("main")
        if not callable(fn):
            funcs = [v for k, v in namespace.items() if callable(v) and not k.startswith("__")]
            if funcs:
                fn = funcs[-1]
        
        if not callable(fn):
            raise Exception("No callable solution found. Define solve(...).")
        output = fn(*test.get("args", []))
        results.append({"output": normalize(output), "error": None})
    except Exception as error:
        results.append({"output": None, "error": f"{error.__class__.__name__}: {error}"})

print(json.dumps(results))
`.trimStart();

    await fs.writeFile(runnerPath, runner, "utf8");

    const { stdout, stderr, timedOut, code: exitCode } = await runCommand("python3", [runnerPath], {
        cwd: tempDir,
        input: JSON.stringify({ code, tests }),
    });

    if (timedOut) {
        return buildErrorResults(tests, "ExecutionError: Python execution timed out.");
    }

    if (exitCode !== 0) {
        return buildErrorResults(tests, `ExecutionError: ${stderr.trim() || "Python execution failed."}`);
    }

    try {
        return JSON.parse(stdout || "[]");
    } catch {
        return buildErrorResults(tests, "ExecutionError: Python runner returned invalid output.");
    }
}

async function runJava(code, tests, tempDir) {
    const solutionPath = path.join(tempDir, "Solution.java");
    const harnessPath = path.join(tempDir, "Harness.java");
    const harness = `
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.lang.reflect.Array;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class Harness {
    public static void main(String[] args) throws Exception {
        String input = readAll();
        Object parsed = new JsonParser(input).parse();
        List<?> tests = parsed instanceof List<?> ? (List<?>) parsed : List.of();
        List<Object> results = new ArrayList<>();

        Class<?> solutionClass = Class.forName("Solution");

        for (Object testObj : tests) {
            Map<?, ?> test = testObj instanceof Map<?, ?> ? (Map<?, ?>) testObj : Map.of();
            List<?> testArgs = test.get("args") instanceof List<?> ? (List<?>) test.get("args") : List.of();

            try {
                Method method = findMethod(solutionClass, testArgs.size());
                Object target = Modifier.isStatic(method.getModifiers()) ? null : solutionClass.getDeclaredConstructor().newInstance();
                Object[] convertedArgs = convertArgs(testArgs, method.getParameterTypes());
                Object output = method.invoke(target, convertedArgs);
                results.add(resultMap(toJsonCompatible(output), null));
            } catch (Exception error) {
                Throwable cause = error.getCause() != null ? error.getCause() : error;
                results.add(resultMap(null, cause.getClass().getSimpleName() + ": " + cause.getMessage()));
            }
        }

        System.out.print(JsonWriter.write(results));
    }

    private static Method findMethod(Class<?> solutionClass, int argCount) throws Exception {
        String[] names = { "solve", "solution", "main" };
        for (String name : names) {
            for (Method method : solutionClass.getDeclaredMethods()) {
                if (method.getName().equals(name) && method.getParameterCount() == argCount) {
                    method.setAccessible(true);
                    return method;
                }
            }
        }
        for (Method method : solutionClass.getDeclaredMethods()) {
            if (method.getParameterCount() == argCount && !method.getName().contains("$")) {
                method.setAccessible(true);
                return method;
            }
        }
        throw new Exception("No callable solution found. Define solve(...).");
    }

    private static Object[] convertArgs(List<?> args, Class<?>[] parameterTypes) throws Exception {
        Object[] converted = new Object[parameterTypes.length];
        for (int i = 0; i < parameterTypes.length; i++) {
            converted[i] = convertValue(args.get(i), parameterTypes[i]);
        }
        return converted;
    }

    private static Object convertValue(Object value, Class<?> type) throws Exception {
        if (value == null) {
            if (type.isPrimitive()) {
                throw new Exception("Null cannot be passed to primitive type " + type.getSimpleName());
            }
            return null;
        }

        if (type == Object.class) {
            return value;
        }
        if (type == String.class) {
            return String.valueOf(value);
        }
        if (type == int.class || type == Integer.class) {
            return ((Number) value).intValue();
        }
        if (type == long.class || type == Long.class) {
            return ((Number) value).longValue();
        }
        if (type == double.class || type == Double.class) {
            return ((Number) value).doubleValue();
        }
        if (type == float.class || type == Float.class) {
            return ((Number) value).floatValue();
        }
        if (type == boolean.class || type == Boolean.class) {
            return (Boolean) value;
        }
        if (type.isArray()) {
            List<?> list = (List<?>) value;
            Class<?> componentType = type.getComponentType();
            Object array = Array.newInstance(componentType, list.size());
            for (int i = 0; i < list.size(); i++) {
                Array.set(array, i, convertValue(list.get(i), componentType));
            }
            return array;
        }
        if (List.class.isAssignableFrom(type)) {
            return value;
        }
        return value;
    }

    private static Map<String, Object> resultMap(Object output, String error) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("output", output);
        result.put("error", error);
        return result;
    }

    private static Object toJsonCompatible(Object value) {
        if (value == null) return null;
        if (value instanceof String || value instanceof Number || value instanceof Boolean) return value;
        Class<?> type = value.getClass();
        if (type.isArray()) {
            int length = Array.getLength(value);
            List<Object> list = new ArrayList<>(length);
            for (int i = 0; i < length; i++) {
                list.add(toJsonCompatible(Array.get(value, i)));
            }
            return list;
        }
        if (value instanceof Collection<?>) {
            List<Object> list = new ArrayList<>();
            for (Object item : (Collection<?>) value) {
                list.add(toJsonCompatible(item));
            }
            return list;
        }
        if (value instanceof Map<?, ?>) {
            Map<String, Object> map = new LinkedHashMap<>();
            for (Map.Entry<?, ?> entry : ((Map<?, ?>) value).entrySet()) {
                map.put(String.valueOf(entry.getKey()), toJsonCompatible(entry.getValue()));
            }
            return map;
        }
        return String.valueOf(value);
    }

    private static String readAll() throws Exception {
        StringBuilder builder = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(System.in, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                builder.append(line);
            }
        }
        return builder.toString();
    }

    static class JsonWriter {
        static String write(Object value) {
            if (value == null) return "null";
            if (value instanceof String) return quote((String) value);
            if (value instanceof Number || value instanceof Boolean) return String.valueOf(value);
            if (value instanceof Map<?, ?> map) {
                StringBuilder builder = new StringBuilder("{");
                boolean first = true;
                for (Map.Entry<?, ?> entry : map.entrySet()) {
                    if (!first) builder.append(",");
                    first = false;
                    builder.append(quote(String.valueOf(entry.getKey()))).append(":").append(write(entry.getValue()));
                }
                return builder.append("}").toString();
            }
            if (value instanceof Collection<?> collection) {
                StringBuilder builder = new StringBuilder("[");
                boolean first = true;
                for (Object item : collection) {
                    if (!first) builder.append(",");
                    first = false;
                    builder.append(write(item));
                }
                return builder.append("]").toString();
            }
            return quote(String.valueOf(value));
        }

        static String quote(String value) {
            StringBuilder builder = new StringBuilder("\\\"");
            for (int i = 0; i < value.length(); i++) {
                char ch = value.charAt(i);
                switch (ch) {
                    case '\\\\' -> builder.append("\\\\\\\\");
                    case '"' -> builder.append('\\\\').append('"');
                    case '\\b' -> builder.append("\\\\b");
                    case '\\f' -> builder.append("\\\\f");
                    case '\\n' -> builder.append("\\\\n");
                    case '\\r' -> builder.append("\\\\r");
                    case '\\t' -> builder.append("\\\\t");
                    default -> {
                        if (ch < 32) {
                            builder.append(String.format("\\\\u%04x", (int) ch));
                        } else {
                            builder.append(ch);
                        }
                    }
                }
            }
            return builder.append('"').toString();
        }
    }

    static class JsonParser {
        private final String input;
        private int index = 0;

        JsonParser(String input) {
            this.input = input == null ? "" : input.trim();
        }

        Object parse() {
            skipWhitespace();
            Object value = parseValue();
            skipWhitespace();
            return value;
        }

        private Object parseValue() {
            skipWhitespace();
            if (index >= input.length()) return null;
            char ch = input.charAt(index);
            if (ch == '{') return parseObject();
            if (ch == '[') return parseArray();
            if (ch == '"') return parseString();
            if (ch == 't') return parseLiteral("true", Boolean.TRUE);
            if (ch == 'f') return parseLiteral("false", Boolean.FALSE);
            if (ch == 'n') return parseLiteral("null", null);
            return parseNumber();
        }

        private Map<String, Object> parseObject() {
            Map<String, Object> map = new LinkedHashMap<>();
            index++;
            skipWhitespace();
            if (input.charAt(index) == '}') {
                index++;
                return map;
            }
            while (index < input.length()) {
                String key = parseString();
                skipWhitespace();
                index++;
                Object value = parseValue();
                map.put(key, value);
                skipWhitespace();
                char ch = input.charAt(index++);
                if (ch == '}') break;
            }
            return map;
        }

        private List<Object> parseArray() {
            List<Object> list = new ArrayList<>();
            index++;
            skipWhitespace();
            if (input.charAt(index) == ']') {
                index++;
                return list;
            }
            while (index < input.length()) {
                list.add(parseValue());
                skipWhitespace();
                char ch = input.charAt(index++);
                if (ch == ']') break;
            }
            return list;
        }

        private String parseString() {
            StringBuilder builder = new StringBuilder();
            index++;
            while (index < input.length()) {
                char ch = input.charAt(index++);
                if (ch == '"') break;
                if (ch == '\\\\') {
                    char esc = input.charAt(index++);
                    switch (esc) {
                        case '"' -> builder.append('"');
                        case '\\\\' -> builder.append('\\\\');
                        case '/' -> builder.append('/');
                        case 'b' -> builder.append('\\b');
                        case 'f' -> builder.append('\\f');
                        case 'n' -> builder.append('\\n');
                        case 'r' -> builder.append('\\r');
                        case 't' -> builder.append('\\t');
                        case 'u' -> {
                            String hex = input.substring(index, index + 4);
                            builder.append((char) Integer.parseInt(hex, 16));
                            index += 4;
                        }
                        default -> builder.append(esc);
                    }
                } else {
                    builder.append(ch);
                }
            }
            return builder.toString();
        }

        private Object parseNumber() {
            int start = index;
            while (index < input.length()) {
                char ch = input.charAt(index);
                if ((ch >= '0' && ch <= '9') || ch == '-' || ch == '+' || ch == '.' || ch == 'e' || ch == 'E') {
                    index++;
                } else {
                    break;
                }
            }
            String token = input.substring(start, index);
            if (token.contains(".") || token.contains("e") || token.contains("E")) {
                return Double.parseDouble(token);
            }
            long value = Long.parseLong(token);
            return value >= Integer.MIN_VALUE && value <= Integer.MAX_VALUE ? (int) value : value;
        }

        private Object parseLiteral(String literal, Object value) {
            index += literal.length();
            return value;
        }

        private void skipWhitespace() {
            while (index < input.length() && Character.isWhitespace(input.charAt(index))) {
                index++;
            }
        }
    }
}
`.trimStart();

    await fs.writeFile(solutionPath, ensureJavaSolutionClass(code), "utf8");
    await fs.writeFile(harnessPath, harness, "utf8");

    const compileResult = await runCommand("javac", ["Solution.java", "Harness.java"], { cwd: tempDir });
    if (compileResult.timedOut) {
        return buildErrorResults(tests, "ExecutionError: Java compilation timed out.");
    }
    if (compileResult.code !== 0) {
        return buildErrorResults(tests, `CompilationError: ${compileResult.stderr.trim() || "Java compilation failed."}`);
    }

    const runResult = await runCommand("java", ["-cp", tempDir, "Harness"], {
        cwd: tempDir,
        input: JSON.stringify(tests),
    });

    if (runResult.timedOut) {
        return buildErrorResults(tests, "ExecutionError: Java execution timed out.");
    }
    if (runResult.code !== 0) {
        return buildErrorResults(tests, `ExecutionError: ${runResult.stderr.trim() || "Java execution failed."}`);
    }

    try {
        return JSON.parse(runResult.stdout || "[]");
    } catch {
        return buildErrorResults(tests, "ExecutionError: Java runner returned invalid output.");
    }
}

router.post("/run", async (req, res) => {
    const { language, code, tests } = req.body || {};

    if (!["python", "java"].includes(language)) {
        return res.status(400).json({ message: "Unsupported language." });
    }
    if (typeof code !== "string" || !code.trim()) {
        return res.status(400).json({ message: "Code is required." });
    }
    if (!Array.isArray(tests)) {
        return res.status(400).json({ message: "Tests are required." });
    }

    const tempDir = path.join(os.tmpdir(), `cg-compiler-${randomUUID()}`);

    try {
        await fs.mkdir(tempDir, { recursive: true });
        const results = language === "python"
            ? await runPython(code, tests, tempDir)
            : await runJava(code, tests, tempDir);

        res.json({ results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        await fs.rm(tempDir, { recursive: true, force: true });
    }
});

module.exports = router;
