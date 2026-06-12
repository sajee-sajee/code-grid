import { useState, useEffect } from "react";
import MatrixRain from "../components/MatrixRain";
import Btn from "../components/Btn";
import CyberCard from "../components/CyberCard";

export default function LandingPage({ onNav }) {
    const [tick, setTick] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setTick((t) => t + 1), 80);
        return () => clearInterval(id);
    }, []);
    const glyphs = "CODERSGUILD_NEXUS7_BREACH_PROTOCOL_EXECUTE";
    const scrambled = glyphs.split("").map((c, i) => tick % 3 === i % 3 ? String.fromCharCode(33 + Math.floor(Math.random() * 60)) : c).join("");

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: 16 }}>
            <MatrixRain />
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 1 }} />

            {/* Ambient Background Glows */}
            <div style={{ position: "absolute", top: "20%", left: "30%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />
            <div style={{ position: "absolute", bottom: "10%", right: "20%", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(191,85,236,0.04) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />

            <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: 24, maxWidth: 850, width: "100%" }}>

                {/* Visual Header Node */}
                <div className="aFloat" style={{ marginBottom: 32, display: "inline-flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
                    <div style={{
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        background: "rgba(10, 13, 28, 0.8)",
                        border: "1px solid var(--border-cyan)",
                        boxShadow: "0 0 30px var(--color-cyan-glow), inset 0 0 15px rgba(0, 229, 255, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justify: "center",
                        backdropFilter: "blur(12px)",
                        overflow: "hidden"
                    }}>
                        <img 
                            src="/assests/eye.jpg" 
                            style={{ 
                                width: "100%", 
                                height: "100%", 
                                objectFit: "cover", 
                                borderRadius: "50%" 
                            }} 
                            alt="Cyber Eye" 
                        />
                    </div>
                    {/* Ring orbit decorative line */}
                    <div style={{ position: "absolute", inset: -10, border: "1px dashed rgba(0, 229, 255, 0.15)", borderRadius: "50%", animation: "spin 25s linear infinite" }} />
                </div>

                <h1 className="ORB aGlitch" style={{
                    fontSize: "clamp(32px, 6vw, 64px)",
                    fontWeight: 900,
                    letterSpacing: "0.15em",
                    lineHeight: 1.1,
                    marginBottom: 12,
                    background: "linear-gradient(to right, #ffffff, var(--color-cyan), var(--color-green))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 30px rgba(0,229,255,0.2)"
                }}>
                    CODERS GUILD
                </h1>

                <div className="MONO" style={{ fontSize: "clamp(10px, 1.6vw, 13px)", color: "var(--color-cyan)", opacity: 0.8, letterSpacing: "0.45em", marginBottom: 36, textTransform: "uppercase" }}>
                    {scrambled}
                </div>

                <p style={{
                    fontSize: "clamp(14px, 2vw, 17px)",
                    color: "var(--color-text-secondary)",
                    maxWidth: 600,
                    margin: "0 auto 48px",
                    lineHeight: 1.8,
                    fontWeight: 300
                }}>
                    In a world controlled by MegaCorp algorithms, the <span className="gG" style={{ fontWeight: 600 }}>Coders Guild</span> trains elite programmers to reclaim the network. Your mission begins now, recruit.
                </p>

                <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", marginBottom: 64 }}>
                    <Btn variant="g" size="lg" onClick={() => onNav("signup")}>⚡ Enlist Now</Btn>
                    <Btn variant="ghost" size="lg" onClick={() => onNav("login")}>▶ Access Terminal</Btn>
                </div>

                {/* Dashboard statistics card container */}
                <CyberCard style={{ padding: "28px 40px", maxWidth: 680, margin: "0 auto" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 24 }}>
                        {[
                            ["11", "Districts", "var(--color-green)"],
                            ["33", "Missions", "var(--color-cyan)"],
                            ["∞", "Duels", "var(--color-red)"],
                            ["🔥", "Streaks", "var(--color-yellow)"]
                        ].map(([v, l, c]) => (
                            <div key={l} style={{ textAlign: "center" }}>
                                <div className="ORB" style={{ fontSize: 32, fontWeight: 800, color: c, textShadow: `0 0 15px ${c}55`, marginBottom: 4 }}>{v}</div>
                                <div className="MONO" style={{ fontSize: 10, color: "var(--color-text-muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </CyberCard>
            </div>
        </div>
    );
}
