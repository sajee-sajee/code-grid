import { useEffect, useRef } from "react";

export default function MatrixRain() {
    const ref = useRef();
    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        
        let timeout;
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        
        const handleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(resize, 200);
        };
        window.addEventListener("resize", handleResize);
        
        const chars = "01ﾅﾆﾇﾈﾉABCDEF<>{}[]|#$%@アイウエオカキクケコ";
        const charArray = chars.split("");
        
        // Setup multi-layered drop particles with dynamic speeds, sizes and opacities for depth (3D grid feel)
        const colWidth = 22;
        const cols = Math.max(20, Math.floor(window.innerWidth / colWidth));
        const drops = Array.from({ length: cols }, (_, i) => ({
            x: i * colWidth + (Math.random() * 6 - 3),
            y: Math.random() * -window.innerHeight,
            speed: 1.2 + Math.random() * 2.5,
            size: 9 + Math.random() * 9,
            opacity: 0.08 + Math.random() * 0.25
        }));

        const draw = () => {
            // Apply trail fade effect
            ctx.fillStyle = "rgba(5, 6, 15, 0.07)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            drops.forEach((drop) => {
                const char = charArray[Math.floor(Math.random() * charArray.length)];
                
                // Cyan and green mix matching the main color scheme
                if (Math.random() > 0.85) {
                    ctx.fillStyle = `rgba(0, 255, 157, ${drop.opacity * 1.5})`;
                } else {
                    ctx.fillStyle = `rgba(0, 229, 255, ${drop.opacity})`;
                }
                
                ctx.font = `${drop.size}px 'Share Tech Mono', monospace`;
                ctx.fillText(char, drop.x, drop.y);
                
                if (drop.y > canvas.height) {
                    drop.y = Math.random() * -120;
                    drop.speed = 1.2 + Math.random() * 2.5;
                    drop.size = 9 + Math.random() * 9;
                    drop.opacity = 0.08 + Math.random() * 0.25;
                } else {
                    drop.y += drop.speed;
                }
            });
        };
        
        const id = setInterval(draw, 33);
        return () => {
            clearInterval(id);
            window.removeEventListener("resize", handleResize);
            clearTimeout(timeout);
        };
    }, []);
    return <canvas ref={ref} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, pointerEvents: "none", opacity: 0.5 }} />;
}
