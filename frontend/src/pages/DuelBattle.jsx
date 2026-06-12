import { useState, useEffect, useCallback } from "react";
import CyberCard from "../components/CyberCard";
import Btn from "../components/Btn";
import CodeEditor from "../components/CodeEditor";
import { DISTRICTS } from "../constants/districts";
import { QUESTIONS } from "../constants/questions";
import { evalCode } from "../utils/evalCode";

export default function DuelBattle({ user, duelConfig, onNav, onDuelEnd }) {
    const topicDistrict = DISTRICTS.find((d) => d.topic === duelConfig.topic);
    const levelQs = QUESTIONS[topicDistrict?.id || 1] || QUESTIONS[1];
    const filteredQs = levelQs.filter((q) => q.diff === duelConfig.diff);
    const [q] = useState(filteredQs[0] || levelQs[0]);
    const [code, setCode] = useState(q.start);
    const [results, setResults] = useState(null);
    const [running, setRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180);
    const [cpuProgress, setCpuProgress] = useState(0);
    const [cpuDone, setCpuDone] = useState(false);
    const [playerScore, setPlayerScore] = useState(0);
    const [cpuScore, setCpuScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const cpuDelay = duelConfig.diff === "Easy" ? 60 : duelConfig.diff === "Medium" ? 100 : 150;

    const finalize = useCallback((ps = playerScore, cs = cpuScore) => {
        if (!finished) { 
            setFinished(true); 
            onDuelEnd({ won: ps > cs, playerScore: ps, cpuScore: cs, question: q }); 
        }
    }, [playerScore, cpuScore, finished, q, onDuelEnd]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((t) => { 
                if (t <= 1) { 
                    clearInterval(timer); 
                    finalize(); 
                    return 0; 
                } 
                return t - 1; 
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [finalize]);

    useEffect(() => {
        const cpuTimer = setInterval(() => {
            setCpuProgress((p) => {
                const next = p + (100 / cpuDelay);
                if (next >= 100 && !cpuDone) { 
                    setCpuDone(true); 
                    setCpuScore(Math.floor(200 + Math.random() * 80)); 
                }
                return Math.min(100, next);
            });
        }, 1000);
        return () => clearInterval(cpuTimer);
    }, [cpuDelay, cpuDone]);

    const run = () => {
        if (finished) return;
        setRunning(true);
        setTimeout(() => {
            const res = evalCode(code, q.tests);
            setResults(res);
            setRunning(false);
            if (res.every((r) => r.passed)) {
                const score = 200 + Math.floor(timeLeft * 1.2);
                setPlayerScore(score);
                finalize(score, cpuScore);
            }
        }, 400);
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timerColor = timeLeft < 30 ? "var(--color-red)" : timeLeft < 60 ? "var(--color-yellow)" : "var(--color-green)";
    const circumference = 2 * Math.PI * 45;

    return (
        <div style={{ minHeight: "100vh", padding: 20, maxWidth: 1350, margin: "0 auto", position: "relative" }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            
            <div style={{ position: "relative", zIndex: 1 }}>
                
                {/* HUD Top Header Battle Metrics */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
                    
                    {/* Player Stats */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 200 }}>
                        <div className="avatar-ring" style={{ 
                            width: 54, 
                            height: 54, 
                            border: "2px solid var(--color-green)", 
                            boxShadow: "0 0 15px rgba(0, 255, 157, 0.4)", 
                            fontSize: 26 
                        }}>
                            {user.avatar?.face || "🤖"}
                        </div>
                        <div>
                            <div className="ORB gG" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em" }}>{user.username.toUpperCase()}</div>
                            <div className="MONO gG" style={{ fontSize: 22, fontWeight: 800, textShadow: "0 0 10px rgba(0, 255, 157, 0.3)", marginTop: 2 }}>{playerScore} PTS</div>
                        </div>
                    </div>
                    
                    {/* SVG Countdown Timer Ring */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <div style={{ position: "relative", width: 100, height: 100 }}>
                            <svg width={100} height={100} style={{ transform: "rotate(-90deg)" }}>
                                <circle cx={50} cy={50} r={45} fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth={5} />
                                <circle 
                                    cx={50} 
                                    cy={50} 
                                    r={45} 
                                    fill="none" 
                                    stroke={timerColor} 
                                    strokeWidth={5} 
                                    strokeDasharray={circumference} 
                                    strokeDashoffset={circumference * (1 - timeLeft / 180)} 
                                    style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s", filter: `drop-shadow(0 0 8px ${timerColor})` }} 
                                />
                            </svg>
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div className="ORB" style={{ fontSize: 18, fontWeight: 800, color: timerColor, textShadow: `0 0 10px ${timerColor}55` }}>
                                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                                </div>
                            </div>
                        </div>
                        <div className="MONO" style={{ fontSize: 9, color: "var(--color-text-muted)", letterSpacing: "0.2em" }}>SYSTEM TIMEOUT</div>
                    </div>
                    
                    {/* CPU Stats */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, justifyContent: "flex-end", minWidth: 200 }}>
                        <div style={{ textAlign: "right" }}>
                            <div className="ORB gR" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em" }}>NEXUS-7 AI</div>
                            <div className="MONO gR" style={{ fontSize: 22, fontWeight: 800, textShadow: "0 0 10px rgba(255, 45, 85, 0.3)", marginTop: 2 }}>
                                {cpuDone ? `${cpuScore} PTS` : "ANALYZING..."}
                            </div>
                        </div>
                        <div className="avatar-ring" style={{ 
                            width: 54, 
                            height: 54, 
                            border: "2px solid var(--color-red)", 
                            boxShadow: "0 0 15px rgba(255, 45, 85, 0.4)", 
                            fontSize: 26,
                            background: "rgba(30, 0, 8, 0.9)"
                        }}>
                            👾
                        </div>
                    </div>
                </div>

                {/* CPU Progress Bar Row */}
                <CyberCard style={{ padding: "12px 20px", marginBottom: 24 }} color="var(--color-red)">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                        <span className="MONO" style={{ fontSize: 10, color: "var(--color-text-muted)", letterSpacing: "0.12em", fontWeight: 600 }}>NEXUS-7 COGNITIVE RESOLUTION RATIO</span>
                        <span className="MONO gR" style={{ fontSize: 11, fontWeight: 700 }}>{cpuDone ? "TARGET SOLVED ✓" : `${Math.floor(cpuProgress)}% RESOLVED`}</span>
                    </div>
                    <div style={{ height: 6, background: "rgba(255, 255, 255, 0.04)", borderRadius: 3, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ width: `${cpuProgress}%`, height: "100%", background: "linear-gradient(90deg, #4d0016, var(--color-red))", boxShadow: "0 0 8px var(--color-red)", transition: "width 0.5s ease" }} />
                    </div>
                </CyberCard>

                {/* Interactive splitscreen panels */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: 20 }}>
                    
                    {/* Left: Combat question brief */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <CyberCard style={{ padding: 24 }} color="var(--color-red)">
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                                <h3 className="ORB" style={{ fontSize: 17, color: "var(--color-text-primary)" }}>{q.title}</h3>
                                <span className={`badge-${q.diff === "Easy" ? "e" : q.diff === "Medium" ? "m" : "h"}`}>{q.diff}</span>
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
                            
                            {q.examples.slice(0, 2).map((ex, i) => (
                                <div key={i} style={{ 
                                    background: "rgba(30, 0, 8, 0.4)", 
                                    border: "1px solid rgba(255, 45, 85, 0.1)", 
                                    padding: 14, 
                                    marginBottom: 10,
                                    borderRadius: 4
                                }}>
                                    <div className="MONO" style={{ fontSize: 10, color: "var(--color-red)", marginBottom: 6, fontWeight: 600 }}>EXAMPLE_NODE_0{i + 1}</div>
                                    <div className="MONO" style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Input: <span style={{ color: "var(--color-yellow)" }}>{ex.i}</span></div>
                                    <div className="MONO" style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>Output: <span style={{ color: "var(--color-green)" }}>{ex.o}</span></div>
                                </div>
                            ))}
                        </CyberCard>
                    </div>

                    {/* Right: Code area */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <CyberCard style={{ padding: 0, overflow: "hidden" }} color="var(--color-red)">
                            <div style={{ 
                                padding: "12px 18px", 
                                background: "rgba(255, 45, 85, 0.04)", 
                                borderBottom: "1px solid rgba(255, 45, 85, 0.15)", 
                                display: "flex", 
                                gap: 10 
                            }}>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-red)" }} />
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-yellow)" }} />
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-green)" }} />
                                </div>
                                <span className="MONO" style={{ fontSize: 11, color: "rgba(255, 45, 85, 0.6)", letterSpacing: "0.15em", fontWeight: 600 }}>
                                    ARENA_DECRYPT_STREAM.js
                                </span>
                            </div>
                            <CodeEditor value={code} onChange={setCode} height={310} />
                        </CyberCard>
                        
                        <Btn variant="r" onClick={run} disabled={running || finished} style={{ justifyContent: "center" }}>
                            {finished ? "⚔️ DUEL COMPLETED" : running ? "⏳ INITIATING DECRYPT ENGINE..." : "▶ TRANSMIT BREACH SOLUTION"}
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
