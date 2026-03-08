import { useState, useEffect, useRef } from "react";
import { SCENES } from "../constants/scenes";

export default function CinematicScene({ sceneId, onSkip }) {
    const scene = SCENES[sceneId];
    const [subtitleLine, setSubtitleLine] = useState(0);
    const [typedText, setTypedText] = useState("");
    const [charIdx, setCharIdx] = useState(0);
    const [done, setDone] = useState(false);
    const [particles, setParticles] = useState([]);
    const canvasRef = useRef();

    useEffect(() => {
        const spawned = Array.from({ length: 18 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 10 + Math.random() * 16,
            opacity: 0.08 + Math.random() * 0.18,
            delay: Math.random() * 4,
            dur: 3 + Math.random() * 4,
            label: scene.particles[i % scene.particles.length],
        }));
        setParticles(spawned);
    }, [sceneId]);

    useEffect(() => {
        setTypedText("");
        setCharIdx(0);
    }, [subtitleLine, sceneId]);

    useEffect(() => {
        const line = scene.lines[subtitleLine] || "";
        if (charIdx >= line.length) {
            if (subtitleLine < scene.lines.length - 1) {
                const t = setTimeout(() => setSubtitleLine((s) => s + 1), 900);
                return () => clearTimeout(t);
            } else {
                const t = setTimeout(() => setDone(true), 1200);
                return () => clearTimeout(t);
            }
        }
        const t = setTimeout(() => {
            setTypedText(line.slice(0, charIdx + 1));
            setCharIdx((c) => c + 1);
        }, 32);
        return () => clearTimeout(t);
    }, [charIdx, subtitleLine, scene.lines]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let frame = 0;
        let raf;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let y = 0; y < canvas.height; y += 4) {
                ctx.fillStyle = `rgba(0,0,0,${0.06 + Math.sin(frame * 0.02 + y * 0.01) * 0.02})`;
                ctx.fillRect(0, y, canvas.width, 2);
            }
            const scanY = ((frame * 2) % (canvas.height + 100)) - 50;
            const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
            grad.addColorStop(0, "rgba(0,255,65,0)");
            grad.addColorStop(0.5, "rgba(0,212,255,.06)");
            grad.addColorStop(1, "rgba(0,255,65,0)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, scanY - 30, canvas.width, 60);
            frame++;
            raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(raf);
    }, [sceneId]);

    return (
        <div
            onClick={onSkip}
            style={{ position: "fixed", inset: 0, zIndex: 1000, cursor: "pointer", background: scene.bgColor, animation: "sceneFlicker 8s ease-in-out infinite" }}
        >
            <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,.85) 100%)", animation: "vignettePulse 4s ease-in-out infinite" }} />
            <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", backgroundImage: `linear-gradient(${scene.accentColor}08 1px, transparent 1px), linear-gradient(90deg, ${scene.accentColor}08 1px, transparent 1px)`, backgroundSize: "60px 60px", animation: "gridShimmer 4s ease-in-out infinite" }} />
            <div style={{ position: "absolute", inset: 0, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ fontSize: "min(40vw, 40vh)", opacity: 0.06, animation: scene.bgAnim, filter: `blur(2px) drop-shadow(0 0 80px ${scene.accentColor})`, transformOrigin: "center center" }}>
                    {scene.bgEmoji}
                </div>
            </div>
            {particles.map((p) => (
                <div key={p.id} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, fontSize: p.size, opacity: p.opacity, color: scene.accentColor, fontFamily: "'Share Tech Mono', monospace", fontWeight: 700, animation: `sceneFgFloat ${p.dur}s ease-in-out ${p.delay}s infinite`, textShadow: `0 0 12px ${scene.accentColor}`, pointerEvents: "none", zIndex: 4 }}>
                    {p.label}
                </div>
            ))}
            <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ fontSize: "min(20vw, 22vh)", opacity: 0.22, animation: scene.fgAnim, filter: `drop-shadow(0 0 40px ${scene.accentColor})` }}>
                    {scene.fgEmoji}
                </div>
            </div>
            <div style={{ position: "absolute", top: 40, left: 0, right: 0, zIndex: 10, textAlign: "center", pointerEvents: "none", animation: "subtitleReveal .8s ease both" }}>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "clamp(11px,1.8vw,16px)", fontWeight: 700, letterSpacing: ".35em", color: scene.accentColor, textShadow: `0 0 20px ${scene.accentColor}, 0 0 40px ${scene.accentColor}66`, textTransform: "uppercase" }}>◈ {scene.title} ◈</div>
                <div style={{ marginTop: 8, width: "min(400px, 60%)", height: 1, margin: "8px auto 0", background: `linear-gradient(90deg, transparent, ${scene.accentColor}, transparent)` }} />
            </div>
            <div style={{ position: "absolute", bottom: 60, right: 40, zIndex: 10, maxWidth: "min(500px, 70vw)", animation: "subtitleReveal .6s .3s ease both", pointerEvents: "none" }}>
                {scene.lines.slice(0, subtitleLine).map((line, i) => (
                    <div key={i} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "clamp(11px,1.4vw,14px)", color: "rgba(160,180,160,.45)", lineHeight: 1.7, textAlign: "right", marginBottom: 2 }}>{line}</div>
                ))}
                <div style={{ background: "rgba(0,0,0,.75)", border: `1px solid ${scene.accentColor}55`, boxShadow: `0 0 20px ${scene.glowColor}, inset 0 0 20px rgba(0,0,0,.5)`, padding: "12px 20px", marginTop: 4, backdropFilter: "blur(4px)" }}>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "clamp(12px,1.6vw,16px)", color: scene.accentColor, lineHeight: 1.8, textAlign: "right", textShadow: `0 0 8px ${scene.accentColor}` }}>
                        <span style={{ opacity: 0.5, marginRight: 8 }}>&gt;_</span>
                        {typedText}
                        {!done && <span style={{ display: "inline-block", width: 2, height: "1em", background: scene.accentColor, marginLeft: 2, verticalAlign: "middle", animation: "skipBlink 0.7s step-end infinite" }} />}
                    </div>
                </div>
            </div>
            <div style={{ position: "absolute", top: 24, right: 28, zIndex: 10, fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "rgba(255,255,255,.35)", letterSpacing: ".15em", animation: "skipBlink 2s ease-in-out infinite", pointerEvents: "none" }}>Click to Skip &gt;&gt;</div>
            {[{ t: 16, l: 16, bt: "borderTop", bl: "borderLeft" }, { b: 16, l: 16, bt: "borderBottom", bl: "borderLeft" }, { t: 16, r: 16, bt: "borderTop", bl: "borderRight" }, { b: 16, r: 16, bt: "borderBottom", bl: "borderRight" }].map((corner, i) => (
                <div key={i} style={{ position: "absolute", top: corner.t, bottom: corner.b, left: corner.l, right: corner.r, zIndex: 6, pointerEvents: "none" }}>
                    <div style={{ width: 30, height: 30, [corner.bt]: `2px solid ${scene.accentColor}`, [corner.bl]: `2px solid ${scene.accentColor}`, opacity: 0.6 }} />
                </div>
            ))}
            {done && (
                <div style={{ position: "absolute", bottom: 24, left: 0, right: 0, zIndex: 10, textAlign: "center", pointerEvents: "none", animation: "skipBlink 1s ease-in-out infinite" }}>
                    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: scene.accentColor, letterSpacing: ".3em", textShadow: `0 0 12px ${scene.accentColor}` }}>◈ CLICK TO CONTINUE ◈</div>
                </div>
            )}
        </div>
    );
}
