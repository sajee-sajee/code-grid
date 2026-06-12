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

    const handleQSwitch = (idx) => { 
        setQIdx(idx); 
        setCode(questions[idx].start); 
        setResults(null); 
        setHintIdx(-1); 
    };

    if (!district || !q) return null;

    if (levelDone) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            <div style={{ position: "absolute", width: 450, height: 450, background: "radial-gradient(circle, rgba(0, 255, 157, 0.05) 0%, transparent 70%)", zIndex: 1, pointerEvents: "none" }} />
            
            <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 520, textAlign: "center" }}>
                <CyberCard style={{ padding: "48px 32px" }} color="var(--color-green)">
                    <div className="aLevelUp" style={{ fontSize: 80, marginBottom: 24, filter: "drop-shadow(0 0 15px var(--color-green))" }}>🏆</div>
                    <h2 className="ORB gG" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "0.15em", marginBottom: 8, textShadow: "0 0 12px var(--color-green-glow)" }}>
                        DISTRICT SECURED
                    </h2>
                    <div className="MONO" style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 40, letterSpacing: "0.15em" }}>
                        {district.name.toUpperCase()} HAS BEEN RECLAIMED
                    </div>
                    <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                        {levelId < 11 && <Btn variant="g" onClick={() => onNav("solo")}>▶ NEXT SECTOR</Btn>}
                        <Btn variant="ghost" onClick={() => onNav("dashboard")}>DASHBOARD</Btn>
                    </div>
                </CyberCard>
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
        <div style={{ minHeight: "100vh", padding: 20, maxWidth: 1350, margin: "0 auto", position: "relative" }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            
            <div style={{ position: "relative", zIndex: 1 }}>
                
                {/* Control bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                    <Btn variant="ghost" size="sm" onClick={() => onNav("solo")}>← SECTOR MAP</Btn>
                    <div style={{ fontSize: 24, filter: `drop-shadow(0 0 8px ${district.color})` }}>{district.icon}</div>
                    <div>
                        <div className="ORB" style={{ fontSize: 13, color: district.color, fontWeight: 700, letterSpacing: "0.1em" }}>
                            {district.name.toUpperCase()}
                        </div>
                        <div className="MONO" style={{ fontSize: 9, color: "var(--color-text-muted)", letterSpacing: "0.1em" }}>
                            GRID PROTOCOL CONTEXT: JS_V8_SANDBOXED
                        </div>
                    </div>
                    
                    <div style={{ flex: 1 }} />
                    
                    {/* Mission selector nodes */}
                    <div style={{ display: "flex", gap: 10, alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span className="MONO" style={{ fontSize: 9, color: "var(--color-text-muted)", marginRight: 6, letterSpacing: "0.1em" }}>SUB-NODES:</span>
                        {questions.map((qq, i) => {
                            const solved = solvedInLevel.includes(qq.id);
                            const active = qIdx === i;
                            return (
                                <div 
                                    key={i} 
                                    onClick={() => handleQSwitch(i)}
                                    style={{ 
                                        width: 34, 
                                        height: 34, 
                                        borderRadius: "50%", 
                                        cursor: "pointer", 
                                        display: "flex", 
                                        alignItems: "center", 
                                        justifyContent: "center", 
                                        background: solved ? "rgba(0, 255, 157, 0.12)" : active ? `${district.color}18` : "rgba(10, 13, 28, 0.7)", 
                                        border: solved ? "1px solid var(--color-green)" : active ? `1px solid ${district.color}` : "1px solid rgba(255,255,255,0.08)", 
                                        color: solved ? "var(--color-green)" : active ? district.color : "var(--color-text-secondary)", 
                                        fontFamily: "var(--font-title)", 
                                        fontSize: 11, 
                                        fontWeight: 700, 
                                        transition: "all 0.25s",
                                        boxShadow: active ? `0 0 10px ${district.color}44` : solved ? "0 0 10px rgba(0, 255, 157, 0.2)" : "none"
                                    }}
                                >
                                    {solved ? "✓" : i + 1}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Splitscreen Layout */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: 20 }}>
                    
                    {/* Left: Mission brief and details */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <CyberCard style={{ padding: 24 }} color={district.color}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                                <h3 className="ORB" style={{ fontSize: 18, color: "var(--color-text-primary)", fontWeight: 700 }}>{q.title}</h3>
                                <span className={`badge-${q.diff === "Easy" ? "e" : q.diff === "Medium" ? "m" : "h"}`}>{q.diff}</span>
                                <div className="MONO" style={{ marginLeft: "auto", fontSize: 11, color: district.color, fontWeight: 600 }}>
                                    +{q.xp} XP AWARD
                                </div>
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
                                    border: "1px solid rgba(0, 229, 255, 0.1)", 
                                    padding: 14, 
                                    marginBottom: 10,
                                    borderRadius: 4
                                }}>
                                    <div className="MONO" style={{ fontSize: 10, color: "var(--color-cyan)", marginBottom: 6, fontWeight: 600 }}>EXAMPLE_0{i + 1}</div>
                                    <div className="MONO" style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Input: <span style={{ color: "var(--color-cyan)" }}>{ex.i}</span></div>
                                    <div className="MONO" style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>Output: <span style={{ color: "var(--color-green)" }}>{ex.o}</span></div>
                                    {ex.e && <div className="MONO" style={{ fontSize: 10, color: "var(--color-text-muted)", marginTop: 6, borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: 4 }}>Note: {ex.e}</div>}
                                </div>
                            ))}

                            {/* Hints */}
                            <div style={{ marginTop: 20 }}>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                                    {q.hints.map((_, i) => (
                                        <Btn 
                                            key={i} 
                                            variant={hintIdx === i ? "p" : "ghost"} 
                                            size="sm" 
                                            onClick={() => setHintIdx(hintIdx === i ? -1 : i)}
                                            style={{ borderRadius: 4, textTransform: "none", fontSize: 10 }}
                                        >
                                            💡 Hint 0{i + 1}
                                        </Btn>
                                    ))}
                                </div>
                                {hintIdx >= 0 && (
                                    <div className="MONO bgP" style={{ border: "1px solid var(--border-purple)", padding: 14, fontSize: 12, color: "#e8d5ff", lineHeight: 1.6, borderRadius: 4 }}>
                                        {q.hints[hintIdx]}
                                    </div>
                                )}
                            </div>
                        </CyberCard>
                    </div>

                    {/* Right: Coding board and run result console */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <CyberCard style={{ padding: 0, overflow: "hidden" }} color="var(--color-green)">
                            {/* Interactive header tabs style */}
                            <div style={{ 
                                padding: "12px 18px", 
                                background: "rgba(0, 255, 157, 0.04)", 
                                borderBottom: "1px solid rgba(0, 255, 157, 0.15)", 
                                display: "flex", 
                                alignItems: "center", 
                                gap: 10 
                            }}>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-red)" }} />
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-yellow)" }} />
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-green)" }} />
                                </div>
                                <div className="MONO" style={{ fontSize: 11, color: "rgba(0, 255, 157, 0.6)", letterSpacing: "0.15em", fontWeight: 600 }}>
                                    MISSION_DECRYPT_{q.id.toUpperCase()}.js
                                </div>
                                {alreadySolved && (
                                    <span className="MONO gG" style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, background: "rgba(0,255,157,0.12)", padding: "2px 8px", borderRadius: 4 }}>
                                        ✓ COMPLETED
                                    </span>
                                )}
                                {xpPopup && <div className="MONO aXp gG" style={{ fontSize: 13, fontWeight: 700, marginLeft: "auto" }}>{xpPopup}</div>}
                            </div>
                            <CodeEditor value={code} onChange={setCode} height={310} />
                        </CyberCard>
                        
                        <div style={{ display: "flex", gap: 12 }}>
                            <Btn variant="g" onClick={runCode} disabled={running} style={{ flex: 1, justifyContent: "center" }}>
                                {running ? "⏳ COMPILING CYBERCODE..." : "▶ DEPLOY VECTOR (RUN)"}
                            </Btn>
                            <Btn variant="ghost" size="sm" onClick={() => { setCode(q.start); setResults(null); }} style={{ borderRadius: 4 }}>
                                ↺ RESET
                            </Btn>
                        </div>

                        {/* Sandbox Console readout */}
                        {results && (
                            <CyberCard style={{ padding: 18 }} color={results.every((r) => r.passed) ? "var(--color-green)" : "var(--color-red)"}>
                                <div className="ORB" style={{ fontSize: 12, letterSpacing: "0.12em", marginBottom: 12, fontWeight: 700, color: results.every((r) => r.passed) ? "var(--color-green)" : "var(--color-red)" }}>
                                    {results.every((r) => r.passed) ? "✓ PROTOCOL DECRYPTED SUCCESSFULLY" : `✗ DECRYPT FAILED: ${results.filter((r) => !r.passed).length} ERROR(S) LOCATED`}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {results.map((r, i) => (
                                        <div key={i} style={{ 
                                            padding: 10, 
                                            background: "rgba(10, 13, 28, 0.6)", 
                                            border: `1px solid ${r.passed ? "rgba(0, 255, 157, 0.15)" : "rgba(255, 45, 85, 0.15)"}`,
                                            borderRadius: 4
                                        }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                                <span className="MONO" style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{r.label}</span>
                                                <span className={`MONO ${r.passed ? "gG" : "gR"}`} style={{ fontSize: 11, fontWeight: 700 }}>{r.passed ? "✓ PASS" : "✗ FAIL"}</span>
                                            </div>
                                            {!r.passed && (
                                                <div className="MONO" style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 4 }}>
                                                    {r.error ? (
                                                        <span className="gR">Error: {r.error}</span>
                                                    ) : (
                                                        <>Expected: <span style={{ color: "var(--color-green)" }}>{r.expected}</span> · Returned: <span style={{ color: "var(--color-red)" }}>{r.output}</span></>
                                                    )}
                                                </div>
                                            )}
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
