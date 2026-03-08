import { useEffect, useRef } from "react";

export default function MatrixRain() {
    const ref = useRef();
    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        window.addEventListener("resize", resize);
        const chars = "アイウエオカキクケコ01ﾅﾆﾇﾈﾉABCDEF<>{}[]|#$%@";
        const cols = Math.floor(canvas.width / 18);
        const drops = Array(cols).fill(1);
        const draw = () => {
            ctx.fillStyle = "rgba(3,3,8,0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drops.forEach((y, i) => {
                ctx.fillStyle = i % 3 === 0 ? "#00ff41" : i % 3 === 1 ? "rgba(0,212,255,0.6)" : "rgba(0,255,65,0.3)";
                ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 18, y * 18);
                if (y * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            });
        };
        ctx.font = "14px 'Share Tech Mono',monospace";
        const id = setInterval(draw, 50);
        return () => { clearInterval(id); window.removeEventListener("resize", resize); };
    }, []);
    return <canvas ref={ref} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, opacity: 0.35 }} />;
}
