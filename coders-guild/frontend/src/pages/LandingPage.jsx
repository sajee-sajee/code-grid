import { useState, useEffect } from "react";
import MatrixRain from "../components/MatrixRain";
import Btn from "../components/Btn";

export default function LandingPage({ onNav }) {
    const [tick, setTick] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setTick((t) => t + 1), 80);
        return () => clearInterval(id);
    }, []);
    const glyphs = "CODERSGUILD_NEXUS7_BREACH_PROTOCOL_EXECUTE";
    const scrambled = glyphs.split("").map((c, i) => tick % 3 === i % 3 ? String.fromCharCode(33 + Math.floor(Math.random() * 60)) : c).join("");

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <MatrixRain />
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 1 }} />
            <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: 24, maxWidth: 800 }}>
                <div className="aFloat" style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 72, marginBottom: 8 }}>⚡</div>
                </div>
                <div className="ORB gG aGlitch" style={{ fontSize: "clamp(28px,5vw,56px)", fontWeight: 900, letterSpacing: ".12em", lineHeight: 1.1, marginBottom: 8 }}>
                    CODERS GUILD
                </div>
                <div className="ORB" style={{ fontSize: "clamp(10px,1.5vw,14px)", color: "rgba(0,212,255,.7)", letterSpacing: ".4em", marginBottom: 32, fontFamily: "Share Tech Mono,monospace" }}>
                    {scrambled}
                </div>
                <div className="MONO" style={{ fontSize: 16, color: "rgba(160,180,200,.8)", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.8 }}>
                    In a world controlled by MegaCorp algorithms, the <span className="gG">Coders Guild</span> trains elite programmers to reclaim the network.
                    <br />Your mission begins now, recruit.
                </div>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                    <Btn variant="g" size="lg" onClick={() => onNav("signup")}>⚡ Enlist Now</Btn>
                    <Btn variant="ghost" size="lg" onClick={() => onNav("login")}>▶ Access Terminal</Btn>
                </div>
                <div style={{ marginTop: 48, display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
                    {[["11", "Districts"], ["33", "Missions"], ["∞", "Duels"], ["🔥", "Streaks"]].map(([v, l]) => (
                        <div key={l} style={{ textAlign: "center" }}>
                            <div className="ORB gC" style={{ fontSize: 28, fontWeight: 700 }}>{v}</div>
                            <div className="MONO" style={{ fontSize: 11, color: "rgba(160,180,200,.5)", letterSpacing: ".2em" }}>{l.toUpperCase()}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
