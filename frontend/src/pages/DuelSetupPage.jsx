import { useState } from "react";
import CyberCard from "../components/CyberCard";
import Btn from "../components/Btn";
import { DISTRICTS } from "../constants/districts";

export default function DuelSetupPage({ onNav, onStartDuel }) {
    const [topic, setTopic] = useState("Arrays");
    const [diff, setDiff] = useState("Easy");
    const topics = DISTRICTS.map((d) => d.topic);

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            
            {/* Ambient glows */}
            <div style={{ position: "absolute", width: 450, height: 450, background: "radial-gradient(circle, rgba(255, 45, 85, 0.05) 0%, transparent 70%)", zIndex: 1, pointerEvents: "none" }} />
            
            <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 520, animation: "fadeIn 0.4s ease" }}>
                <CyberCard style={{ padding: 40 }} color="var(--color-red)">
                    <div style={{ textAlign: "center", marginBottom: 32 }}>
                        <div className="aFloat" style={{ fontSize: 48, marginBottom: 12, filter: "drop-shadow(0 0 10px var(--color-red))" }}>⚔️</div>
                        <h2 className="ORB gR" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.15em", marginBottom: 6 }}>
                            DUEL ARENA
                        </h2>
                        <div className="MONO" style={{ fontSize: 11, color: "var(--color-text-muted)", letterSpacing: "0.2em" }}>
                            CONFIGURE SIMULATED BREACH TARGET PARAMETERS
                        </div>
                    </div>
                    
                    <div style={{ marginBottom: 24 }}>
                        <label className="MONO" style={{ display: "block", fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 10, letterSpacing: "0.15em", fontWeight: 600 }}>
                            TARGET ALGORITHM SUB-MODULE
                        </label>
                        <select value={topic} onChange={(e) => setTopic(e.target.value)} style={{ width: "100%" }}>
                            {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    
                    <div style={{ marginBottom: 36 }}>
                        <label className="MONO" style={{ display: "block", fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 10, letterSpacing: "0.15em", fontWeight: 600 }}>
                            AI DIALECTIC RESISTANCE LEVEL (DIFFICULTY)
                        </label>
                        <div style={{ display: "flex", gap: 10 }}>
                            {[
                                { name: "Easy", color: "var(--color-green)", bg: "rgba(0, 255, 157, 0.1)" },
                                { name: "Medium", color: "var(--color-yellow)", bg: "rgba(250, 204, 21, 0.1)" },
                                { name: "Hard", color: "var(--color-red)", bg: "rgba(255, 45, 85, 0.1)" }
                            ].map((d) => {
                                const active = diff === d.name;
                                return (
                                    <div 
                                        key={d.name} 
                                        onClick={() => setDiff(d.name)} 
                                        style={{ 
                                            flex: 1, 
                                            padding: "12px 0", 
                                            textAlign: "center", 
                                            cursor: "pointer", 
                                            background: active ? d.bg : "rgba(10, 13, 28, 0.6)", 
                                            border: active ? `1px solid ${d.color}` : "1px solid rgba(255,255,255,0.08)", 
                                            borderRadius: 4,
                                            fontFamily: "var(--font-title)", 
                                            fontSize: 11, 
                                            fontWeight: 700, 
                                            letterSpacing: "0.08em", 
                                            color: active ? d.color : "var(--color-text-secondary)", 
                                            transition: "all 0.25s",
                                            boxShadow: active ? `0 0 10px ${d.color}44` : "none",
                                            transform: active ? "scale(1.03)" : "none"
                                        }}
                                    >
                                        {d.name.toUpperCase()}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div style={{ display: "flex", gap: 16 }}>
                        <Btn variant="ghost" onClick={() => onNav("dashboard")} style={{ flex: 1, justifyContent: "center", borderRadius: 4 }}>
                            ← DISCONNECT
                        </Btn>
                        <Btn variant="r" onClick={() => onStartDuel({ topic, diff })} style={{ flex: 2, justifyContent: "center" }}>
                            ⚔️ CONNECT UPLINK
                        </Btn>
                    </div>
                </CyberCard>
            </div>
        </div>
    );
}
