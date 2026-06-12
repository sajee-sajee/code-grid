import { useState } from "react";
import CyberCard from "../components/CyberCard";
import Btn from "../components/Btn";
import CodeEditor from "../components/CodeEditor";
import { DAILY_POOL } from "../constants/achievements";
import { evalCode } from "../utils/evalCode";
import { completeDaily } from "../services/api";
import { useUser } from "../contexts/UserContext";

export default function DailyQuestPage({ onNav }) {
    const { user, patchUser } = useUser();
    const [q] = useState(() => DAILY_POOL[Math.floor(Date.now() / 86400000) % DAILY_POOL.length]);
    const [code, setCode] = useState(q.start);
    const [results, setResults] = useState(null);
    const [running, setRunning] = useState(false);
    const [hintShown, setHintShown] = useState(false);
    const done = user.dailyDone;

    const run = () => {
        setRunning(true);
        setTimeout(async () => {
            const res = evalCode(code, q.tests);
            setResults(res);
            setRunning(false);
            if (res.every((r) => r.passed) && !done) {
                const xpGain = q.xp + 20;
                try { await completeDaily({ qId: q.id, xp: xpGain }); } catch (_) { }
                const now = new Date();
                const lastDate = user.lastDailyDate ? new Date(user.lastDailyDate) : null;
                const newStreak = lastDate && (now - lastDate) < 172800000 ? user.streak + 1 : 1;
                patchUser({ xp: user.xp + xpGain, dailyDone: true, streak: newStreak, lastDailyDate: now.toISOString() });
            }
        }, 400);
    };

    return (
        <div style={{ minHeight: "100vh", padding: 20, maxWidth: 1250, margin: "0 auto", position: "relative" }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            
            <div style={{ position: "relative", zIndex: 1 }}>
                
                {/* Header Section */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
                    <Btn variant="ghost" size="sm" onClick={() => onNav("dashboard")}>← BACK</Btn>
                    <div>
                        <h2 className="ORB gY" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.15em", textShadow: "0 0 12px var(--color-yellow-glow)" }}>
                            📅 DAILY BREAKOUT
                        </h2>
                        <div className="MONO" style={{ fontSize: 11, color: "var(--color-text-muted)", letterSpacing: "0.1em", marginTop: 4 }}>
                            24HR SECTOR ATTACK CONTEXT ROUTING
                        </div>
                    </div>
                    {done && (
                        <span className="MONO gG" style={{ 
                            fontSize: 11, 
                            fontWeight: 700, 
                            background: "rgba(0, 255, 157, 0.12)", 
                            border: "1px solid var(--border-green)", 
                            padding: "4px 12px", 
                            borderRadius: 4, 
                            marginLeft: 8 
                        }}>
                            ✓ STREAK SECURED FOR TODAY
                        </span>
                    )}
                </div>

                {/* Streak Metrics Cards */}
                <div style={{ display: "flex", gap: 20, marginBottom: 28, flexWrap: "wrap" }}>
                    <CyberCard style={{ padding: 24, flex: "1 1 200px" }} color="var(--color-yellow)">
                        <div style={{ textAlign: "center" }}>
                            <div className="ORB" style={{ fontSize: 44, color: "var(--color-yellow)", textShadow: "0 0 20px var(--color-yellow-glow)", fontWeight: 900 }}>
                                {user.streak}🔥
                            </div>
                            <div className="MONO" style={{ fontSize: 11, color: "var(--color-text-muted)", letterSpacing: "0.15em", marginTop: 4 }}>
                                OPERATIVE SOLVE STREAK
                            </div>
                        </div>
                    </CyberCard>
                    
                    <CyberCard style={{ padding: 24, flex: "3 3 500px" }} color="var(--color-yellow)">
                        <div className="ORB gY" style={{ fontSize: 11, letterSpacing: "0.12em", marginBottom: 12, fontWeight: 700 }}>
                            14-DAY ATTACK RECORD MATRIX
                        </div>
                        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                            {Array.from({ length: 14 }).map((_, i) => {
                                const active = i >= 14 - user.streak;
                                return (
                                    <div 
                                        key={i} 
                                        style={{ 
                                            flex: 1, 
                                            minWidth: 32,
                                            height: 36, 
                                            background: active ? "rgba(250, 204, 21, 0.15)" : "rgba(10, 13, 28, 0.6)", 
                                            border: `1px solid ${active ? "var(--color-yellow)" : "rgba(255,255,255,0.06)"}`, 
                                            borderRadius: 4,
                                            display: "flex", 
                                            alignItems: "center", 
                                            justifyContent: "center", 
                                            fontSize: 16,
                                            boxShadow: active ? "0 0 10px rgba(250, 204, 21, 0.2)" : "none",
                                            transition: "all 0.25s"
                                        }}
                                    >
                                        {active ? "🔥" : ""}
                                    </div>
                                );
                            })}
                        </div>
                    </CyberCard>
                </div>

                {/* Main Splitscreen Layout */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: 20 }}>
                    
                    {/* Left: Quest brief */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <CyberCard style={{ padding: 24 }} color="var(--color-yellow)">
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                                <h3 className="ORB" style={{ fontSize: 17, color: "var(--color-text-primary)" }}>{q.title}</h3>
                                <span className="badge-e">{q.diff}</span>
                                <span className="MONO gY" style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600 }}>
                                    +{q.xp + 20} XP TOTAL
                                </span>
                            </div>
                            
                            <p className="MONO" style={{ 
                                fontSize: 13, 
                                color: "var(--color-text-secondary)", 
                                lineHeight: 1.7, 
                                whiteSpace: "pre-line", 
                                marginBottom: 20,
                                paddingBottom: 16,
                                borderBottom: "1px dashed rgba(255,255,255,0.06)"
                            }}>
                                {q.desc}
                            </p>
                            
                            {/* Examples */}
                            {q.examples.map((ex, i) => (
                                <div key={i} style={{ 
                                    background: "rgba(10, 13, 28, 0.4)", 
                                    border: "1px solid rgba(250, 204, 21, 0.1)", 
                                    padding: 14, 
                                    marginBottom: 10,
                                    borderRadius: 4
                                }}>
                                    <div className="MONO" style={{ fontSize: 10, color: "var(--color-yellow)", marginBottom: 6, fontWeight: 600 }}>EXAMPLE_0{i + 1}</div>
                                    <div className="MONO" style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Input: <span style={{ color: "var(--color-yellow)" }}>{ex.i}</span></div>
                                    <div className="MONO" style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>Output: <span style={{ color: "var(--color-green)" }}>{ex.o}</span></div>
                                </div>
                            ))}
                            
                            <div style={{ marginTop: 16 }}>
                                <Btn variant="ghost" size="sm" onClick={() => setHintShown((s) => !s)} style={{ borderRadius: 4, fontSize: 10 }}>
                                    💡 Toggle Hint
                                </Btn>
                                {hintShown && q.hints.map((h, i) => (
                                    <div key={i} className="MONO bgP" style={{ border: "1px solid var(--border-purple)", padding: 12, marginTop: 10, fontSize: 12, color: "#e8d5ff", borderRadius: 4 }}>
                                        {h}
                                    </div>
                                ))}
                            </div>
                        </CyberCard>
                    </div>

                    {/* Right: Coding workspace */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <CyberCard style={{ padding: 0, overflow: "hidden" }} color="var(--color-yellow)">
                            <div style={{ 
                                padding: "12px 18px", 
                                background: "rgba(250, 204, 21, 0.04)", 
                                borderBottom: "1px solid rgba(250, 204, 21, 0.15)", 
                                display: "flex", 
                                gap: 10 
                            }}>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-red)" }} />
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-yellow)" }} />
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-green)" }} />
                                </div>
                                <span className="MONO" style={{ fontSize: 11, color: "rgba(250, 204, 21, 0.6)", letterSpacing: "0.15em", fontWeight: 600 }}>
                                    DAILY_BREACH_{new Date().toISOString().slice(0, 10)}.js
                                </span>
                            </div>
                            <CodeEditor value={code} onChange={setCode} height={310} />
                        </CyberCard>
                        
                        <Btn variant={done ? "ghost" : "g"} onClick={run} disabled={running || done} style={{ justifyContent: "center" }}>
                            {done ? "✓ SECURED FOR TODAY" : running ? "⏳ EVALUATING VECTORS..." : "▶ DEPLOY SOLUTION DECRYPT"}
                        </Btn>
                        
                        {results && (
                            <CyberCard style={{ padding: 14 }} color={results.every((r) => r.passed) ? "var(--color-green)" : "var(--color-red)"}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    {results.map((r, i) => (
                                        <div key={i} style={{ 
                                            display: "flex", 
                                            justifyContent: "space-between", 
                                            padding: "6px 0", 
                                            borderBottom: "1px dashed rgba(255,255,255,0.06)",
                                            alignItems: "center"
                                        }}>
                                            <span className="MONO" style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{r.label}</span>
                                            <span className={`MONO ${r.passed ? "gG" : "gR"}`} style={{ fontSize: 12, fontWeight: 700 }}>
                                                {r.passed ? "✓ PASS" : r.error ? `✗ ERROR` : `✗ FAIL`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CyberCard>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
