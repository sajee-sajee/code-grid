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
        if (!finished) { setFinished(true); onDuelEnd({ won: ps > cs, playerScore: ps, cpuScore: cs, question: q }); }
    }, [playerScore, cpuScore, finished]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((t) => { if (t <= 1) { clearInterval(timer); finalize(); return 0; } return t - 1; });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const cpuTimer = setInterval(() => {
            setCpuProgress((p) => {
                const next = p + (100 / cpuDelay);
                if (next >= 100 && !cpuDone) { setCpuDone(true); setCpuScore(Math.floor(200 + Math.random() * 80)); }
                return Math.min(100, next);
            });
        }, 1000);
        return () => clearInterval(cpuTimer);
    }, []);

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
    const timerColor = timeLeft < 30 ? "#ff0033" : timeLeft < 60 ? "#ffcc00" : "#00ff41";
    const circumference = 2 * Math.PI * 45;

    return (
        <div style={{ minHeight: "100vh", padding: 16, maxWidth: 1300, margin: "0 auto" }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            <div style={{ position: "relative", zIndex: 1 }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                        <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(0,15,30,.9)", border: "2px solid #00ff41", boxShadow: "0 0 15px rgba(0,255,65,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{user.avatar?.face || "🤖"}</div>
                        <div>
                            <div className="ORB gG" style={{ fontSize: 14, fontWeight: 700 }}>{user.username}</div>
                            <div className="MONO gG" style={{ fontSize: 20, fontWeight: 700 }}>{playerScore}</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ position: "relative", width: 100, height: 100 }}>
                            <svg width={100} height={100} style={{ transform: "rotate(-90deg)" }}>
                                <circle cx={50} cy={50} r={45} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={6} />
                                <circle cx={50} cy={50} r={45} fill="none" stroke={timerColor} strokeWidth={6} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - timeLeft / 180)} style={{ transition: "stroke-dashoffset 1s linear, stroke .5s", filter: `drop-shadow(0 0 6px ${timerColor})` }} />
                            </svg>
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div className="ORB" style={{ fontSize: 18, fontWeight: 700, color: timerColor, textShadow: `0 0 10px ${timerColor}` }}>
                                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                                </div>
                            </div>
                        </div>
                        <div className="MONO" style={{ fontSize: 10, color: "rgba(160,180,200,.4)", letterSpacing: ".2em" }}>⚔️ VS CPU</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, justifyContent: "flex-end" }}>
                        <div>
                            <div className="ORB gR" style={{ fontSize: 14, fontWeight: 700, textAlign: "right" }}>NEXUS-7 AI</div>
                            <div className="MONO gR" style={{ fontSize: 20, fontWeight: 700, textAlign: "right" }}>{cpuDone ? cpuScore : "?"}</div>
                        </div>
                        <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(30,0,8,.9)", border: "2px solid #ff0033", boxShadow: "0 0 15px rgba(255,0,51,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🤖</div>
                    </div>
                </div>
                {/* CPU Progress */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span className="MONO" style={{ fontSize: 11, color: "rgba(160,180,200,.4)" }}>CPU ANALYSIS PROGRESS</span>
                        <span className="MONO gR" style={{ fontSize: 11 }}>{cpuDone ? "SOLVED ✓" : `${Math.floor(cpuProgress)}%`}</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,.06)" }}>
                        <div style={{ width: `${cpuProgress}%`, height: "100%", background: "linear-gradient(90deg,#400010,#ff0033)", transition: "width .5s" }} />
                    </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <CyberCard style={{ padding: 24 }} color="#ff0033">
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                            <div className="ORB" style={{ fontSize: 16, color: "#e0e8f0" }}>{q.title}</div>
                            <span className={`badge-${q.diff === "Easy" ? "e" : q.diff === "Medium" ? "m" : "h"}`}>{q.diff}</span>
                        </div>
                        <div className="MONO" style={{ fontSize: 13, color: "rgba(180,200,220,.8)", lineHeight: 1.8, whiteSpace: "pre-line", marginBottom: 12 }}>{q.desc}</div>
                        {q.examples.slice(0, 2).map((ex, i) => (
                            <div key={i} style={{ background: "rgba(30,0,8,.6)", border: "1px solid rgba(255,0,51,.15)", padding: 10, marginBottom: 8 }}>
                                <div className="MONO" style={{ fontSize: 11, color: "rgba(255,0,51,.5)" }}>Example {i + 1}</div>
                                <div className="MONO" style={{ fontSize: 12, color: "rgba(180,200,220,.7)" }}>In: <span style={{ color: "#ffcc00" }}>{ex.i}</span></div>
                                <div className="MONO" style={{ fontSize: 12, color: "rgba(180,200,220,.7)" }}>Out: <span style={{ color: "#00ff41" }}>{ex.o}</span></div>
                            </div>
                        ))}
                    </CyberCard>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <CyberCard style={{ padding: 0, overflow: "hidden" }}>
                            <div style={{ padding: "10px 16px", background: "rgba(255,0,51,.04)", borderBottom: "1px solid rgba(255,0,51,.2)", display: "flex", gap: 8 }}>
                                <div style={{ display: "flex", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff0033" }} /><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffcc00" }} /><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00ff41" }} /></div>
                                <span className="MONO" style={{ fontSize: 11, color: "rgba(255,0,51,.5)", letterSpacing: ".15em" }}>DUEL_BATTLE.js</span>
                            </div>
                            <CodeEditor value={code} onChange={setCode} height={240} />
                        </CyberCard>
                        <Btn variant="r" onClick={run} disabled={running || finished} style={{ justifyContent: "center" }}>
                            {finished ? "⚔️ BATTLE ENDED" : running ? "⏳ EXECUTING..." : "▶ SUBMIT ANSWER"}
                        </Btn>
                        {results && (
                            <CyberCard style={{ padding: 12 }} color={results.every((r) => r.passed) ? "#00ff41" : "#ff0033"}>
                                {results.map((r, i) => (
                                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                                        <span className="MONO" style={{ fontSize: 11, color: "rgba(180,200,220,.5)" }}>{r.label}</span>
                                        <span className={`MONO ${r.passed ? "gG" : "gR"}`} style={{ fontSize: 11 }}>{r.passed ? "✓" : r.error ? "Error" : `Got ${r.output}`}</span>
                                    </div>
                                ))}
                            </CyberCard>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
