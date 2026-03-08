import { useRef } from "react";

export default function CodeEditor({ value, onChange, height = 300 }) {
    const ref = useRef();
    const handleKeyDown = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const s = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const newVal = value.substring(0, s) + "  " + value.substring(end);
            onChange(newVal);
            requestAnimationFrame(() => {
                ref.current.selectionStart = ref.current.selectionEnd = s + 2;
            });
        }
    };
    return (
        <textarea
            ref={ref}
            className="code-ed"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ height, width: "100%", display: "block" }}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
        />
    );
}
