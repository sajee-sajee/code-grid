import { useEffect, useRef } from "react";

export default function MatrixRain() {
    const ref = useRef();
    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        
        const chars = "アイウエオカキクケコ01ﾅﾆﾇﾈﾉABCDEF<>{}[]|#$%@";
        let drops = [];
        
        const resize = () => { 
            canvas.width = window.innerWidth; 
            canvas.height = window.innerHeight; 
            const cols = Math.floor(canvas.width / 18);
            
            // Keep existing drops to prevent reset jumping, push new columns if wider
            drops = Array(cols).fill(1).map((_, i) => drops[i] || Math.random() * -100);
        };
        resize();
        
        let timeout;
        const handleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(resize, 200); // Debounce resize to stop heavy lagging on mobile scroll
        };
        window.addEventListener("resize", handleResize);
        
        const draw = () => {
            ctx.fillStyle = "rgba(3,3,8,0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = "14px 'Share Tech Mono',monospace"; // Must reapply font every frame because resize wipes it
            
            drops.forEach((y, i) => {
                ctx.fillStyle = i % 3 === 0 ? "#00ff41" : i % 3 === 1 ? "rgba(0,212,255,0.6)" : "rgba(0,255,65,0.3)";
                ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 18, y * 18);
                if (y * 18 > canvas.height && Math.random() > 0.97) drops[i] = 0;
                drops[i]++;
            });
        };
        
        const id = setInterval(draw, 50);
        return () => { clearInterval(id); window.removeEventListener("resize", handleResize); clearTimeout(timeout); };
    }, []);
    return <canvas ref={ref} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, opacity: 0.35, pointerEvents: "none" }} />;
}
