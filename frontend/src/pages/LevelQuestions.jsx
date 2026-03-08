import { useState } from "react";
import CyberCard from "../components/CyberCard";
import Btn from "../components/Btn";
import CodeEditor from "../components/CodeEditor";
import { DISTRICTS } from "../constants/districts";
import { QUESTIONS } from "../constants/questions";
import { evalCode } from "../utils/evalCode";
import { recordSolve } from "../services/api";
import { useUser } from "../contexts/UserContext";

export default function LevelQuestions({ levelId, onNav, onLevelComplete }) {
    const { user, patchUser } = useUser();
    const district = DISTRICTS.find((d) => d.id === levelId);
    const questions = QUESTIONS[levelId] || [];
    const solvedInLevel = user.solved.filter((s) => s.levelId === levelId).map((s) => s.qId);
    const [qIdx, setQIdx] = useState(() => {
        const f = questions.findIndex((q) => !solvedInLevel.includes(q.id));
        return f >= 0 ? f : 0;
    });
    const q = questions[qIdx];
    const [code, setCode] = useState(q?.start || "");
    const [results, setResults] = useState(null);
    const [running, setRunning] = useState(false);
    const [hintIdx, setHintIdx] = useState(-1);
    const [startTime] = useState(Date.now());
    const [xpPopup, setXpPopup] = useState(null);
    const [levelDone, setLevelDone] = useState(false);
    const alreadySolved = q && solvedInLevel.includes(q.id);

    const handleQSwitch = (idx) => { setQIdx(idx); setCode(questions[idx].start); setResults(null); setHintIdx(-1); };

    if (!district || !q) return null;

    if (levelDone) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 500 }}>
                <div className="aLevelUp" style={{ fontSize: 80, marginBottom: 24 }}>🏆</div>
                <div className="ORB gG" style={{ fontSize: 28, fontWeight: 700, letterSpacing: ".12em", marginBottom: 8 }}>DISTRICT CLEARED</div>
                <div className="MONO" style={{ fontSize: 14, color: "rgba(0,212,255,.6)", marginBottom: 32 }}>{district.name.toUpperCase()} LIBERATED</div>
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                    {levelId < 11 && <Btn variant="g" onClick={() => onNav("solo")}>▶ NEXT DISTRICT</Btn>}
                    <Btn variant="ghost" onClick={() => onNav("dashboard")}>DASHBOARD</Btn>
                </div>
            </div>
        </div>
    );

    const runCode = () => {
        setRunning(true);
        setTimeout(async () => {
            const res = evalCode(code, q.tests);
            setResults(res);
            setRunning(false);
            const allPass = res.every((r) => r.passed);
            if (allPass && !alreadySolved) {
                const elapsed = (Date.now() - startTime) / 1000;
                const solveData = { qId: q.id, levelId, diff: q.diff, xp: q.xp, fast: elapsed < 60, ts: Date.now() };
                try { await recordSolve(solveData); } catch (_) { }
                patchUser({ xp: user.xp + q.xp, solved: [...user.solved, solveData] });
                setXpPopup(`+${q.xp} XP`);
                setTimeout(() => setXpPopup(null), 1500);
                const newSolvedCount = solvedInLevel.length + 1;
                if (newSolvedCount >= questions.length) {
                    setTimeout(() => { onLevelComplete(levelId); setLevelDone(true); }, 1200);
                }
            }
        }, 400);
    };

    return (
        <div style={{ minHeight: "100vh", padding: 16, maxWidth: 1400, margin: "0 auto" }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                    <Btn variant="ghost" size="sm" onClick={() => onNav("solo")}>← BACK</Btn>
                    <div style={{ fontSize: 20 }}>{district.icon}</div>
                    <div className="ORB" style={{ fontSize: 14, color: district.color, fontWeight: 700, letterSpacing: ".1em" }}>{district.name}</div>
                    <div style={{ flex: 1 }} />
                    <div style={{ display: "flex", gap: 8 }}>
                        {questions.map((qq, i) => (
                            <div key={i} onClick={() => handleQSwitch(i)}
                                style={{ width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: solvedInLevel.includes(qq.id) ? "rgba(0,255,65,.2)" : qIdx === i ? "rgba(0,212,255,.15)" : "rgba(0,8,18,.9)", border: solvedInLevel.includes(qq.id) ? "1px solid #00ff41" : qIdx === i ? `1px solid ${district.color}` : "1px solid rgba(255,255,255,.1)", color: solvedInLevel.includes(qq.id) ? "#00ff41" : qIdx === i ? district.color : "rgba(160,180,200,.5)", fontFamily: "Orbitron,monospace", fontSize: 12, fontWeight: 700, transition: "all .2s" }}>
                                {solvedInLevel.includes(qq.id) ? "✓" : i + 1}
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {/* Problem panel */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <CyberCard style={{ padding: 24 }} color={district.color}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                                <div className="ORB" style={{ fontSize: 17, color: "#e0e8f0", fontWeight: 700 }}>{q.title}</div>
                                <span className={`badge-${q.diff === "Easy" ? "e" : q.diff === "Medium" ? "m" : "h"}`}>{q.diff}</span>
                                <div className="MONO" style={{ marginLeft: "auto", fontSize: 11, color: district.color }}>+{q.xp} XP</div>
                            </div>
                            <div className="MONO" style={{ fontSize: 13, color: "rgba(180,200,220,.8)", lineHeight: 1.8, whiteSpace: "pre-line", marginBottom: 16 }}>{q.desc}</div>
                            {q.examples.map((ex, i) => (
                                <div key={i} style={{ background: "rgba(0,15,30,.6)", border: "1px solid rgba(0,212,255,.15)", padding: 12, marginBottom: 8 }}>
                                    <div className="MONO" style={{ fontSize: 11, color: "rgba(0,212,255,.5)", marginBottom: 4 }}>EXAMPLE {i + 1}</div>
                                    <div className="MONO" style={{ fontSize: 12, color: "rgba(180,200,220,.7)" }}>Input: <span style={{ color: "#00d4ff" }}>{ex.i}</span></div>
                                    <div className="MONO" style={{ fontSize: 12, color: "rgba(180,200,220,.7)" }}>Output: <span style={{ color: "#00ff41" }}>{ex.o}</span></div>
                                    {ex.e && <div className="MONO" style={{ fontSize: 11, color: "rgba(160,180,200,.4)" }}>Explanation: {ex.e}</div>}
                                </div>
                            ))}
                            <div style={{ marginTop: 12 }}>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    {q.hints.map((_, i) => (
                                        <Btn key={i} variant={hintIdx >= i ? "p" : "ghost"} size="sm" onClick={() => setHintIdx(i)}>💡 Hint {i + 1}</Btn>
                                    ))}
                                </div>
                                {hintIdx >= 0 && (
                                    <div className="MONO bgP" style={{ border: "1px solid rgba(191,0,255,.3)", padding: 12, marginTop: 8, fontSize: 13, color: "#e0c0ff", lineHeight: 1.7 }}>
                                        {q.hints[hintIdx]}
                                    </div>
                                )}
                            </div>
                        </CyberCard>
                    </div>
                    {/* Code panel */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <CyberCard style={{ padding: 0, overflow: "hidden" }}>
                            <div style={{ padding: "10px 16px", background: "rgba(0,255,65,.05)", borderBottom: "1px solid rgba(0,255,65,.2)", display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff0033" }} />
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffcc00" }} />
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00ff41" }} />
                                </div>
                                <div className="MONO" style={{ fontSize: 11, color: "rgba(0,255,65,.5)", letterSpacing: ".15em" }}>MISSION_{q.id.toUpperCase()}.js</div>
                                {alreadySolved && <span className="MONO gG" style={{ marginLeft: "auto", fontSize: 11 }}>✓ SOLVED</span>}
                                {xpPopup && <div className="MONO aXp gG" style={{ fontSize: 14, fontWeight: 700, marginLeft: "auto" }}>{xpPopup}</div>}
                            </div>
                            <CodeEditor value={code} onChange={setCode} height={280} />
                        </CyberCard>
                        <div style={{ display: "flex", gap: 10 }}>
                            <Btn variant="c" onClick={runCode} disabled={running} style={{ flex: 1, justifyContent: "center" }}>
                                {running ? "⏳ EXECUTING..." : "▶ RUN CODE"}
                            </Btn>
                            <Btn variant="ghost" size="sm" onClick={() => { setCode(q.start); setResults(null); }}>↺ RESET</Btn>
                        </div>
                        {results && (
                            <CyberCard style={{ padding: 16 }} color={results.every((r) => r.passed) ? "#00ff41" : "#ff0033"}>
                                <div className="ORB" style={{ fontSize: 12, letterSpacing: ".12em", marginBottom: 12, color: results.every((r) => r.passed) ? "#00ff41" : "#ff0033" }}>
                                    {results.every((r) => r.passed) ? "✓ ALL TESTS PASSED" : `✗ ${results.filter((r) => !r.passed).length} TESTS FAILED`}
                                </div>
                                {results.map((r, i) => (
                                    <div key={i} style={{ marginBottom: 8, padding: 10, background: "rgba(0,8,18,.8)", border: `1px solid ${r.passed ? "rgba(0,255,65,.3)" : "rgba(255,0,51,.3)"}` }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                            <span className="MONO" style={{ fontSize: 12, color: "rgba(180,200,220,.7)" }}>{r.label}</span>
                                            <span className={`MONO ${r.passed ? "gG" : "gR"}`} style={{ fontSize: 12 }}>{r.passed ? "✓ PASS" : "✗ FAIL"}</span>
                                        </div>
                                        {!r.passed && (
                                            <div className="MONO" style={{ fontSize: 11, color: "rgba(160,180,200,.5)" }}>
                                                {r.error ? <span className="gR">Error: {r.error}</span> : <>Expected: <span style={{ color: "#00ff41" }}>{r.expected}</span> · Got: <span style={{ color: "#ff0033" }}>{r.output}</span></>}
                                            </div>
                                        )}
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
