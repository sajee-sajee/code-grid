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
        <div style={{ minHeight: "100vh", padding: 24, maxWidth: 900, margin: "0 auto" }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <Btn variant="ghost" size="sm" onClick={() => onNav("dashboard")}>← BACK</Btn>
                    <div className="ORB gY" style={{ fontSize: 20, fontWeight: 700, letterSpacing: ".12em" }}>📅 DAILY QUEST</div>
                    {done && <span className="MONO gG" style={{ fontSize: 12 }}>✓ COMPLETED TODAY</span>}
                </div>
                <div style={{ display: "flex", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
                    <CyberCard style={{ padding: 20, flex: 1 }} color="#ffcc00">
                        <div style={{ textAlign: "center" }}>
                            <div className="ORB" style={{ fontSize: 40, color: "#ff6600", textShadow: "0 0 20px #ff6600" }}>{user.streak}🔥</div>
                            <div className="MONO" style={{ fontSize: 12, color: "rgba(255,200,0,.6)", letterSpacing: ".2em" }}>DAY STREAK</div>
                        </div>
                    </CyberCard>
                    <CyberCard style={{ padding: 20, flex: 3 }} color="#ffcc00">
                        <div className="ORB gY" style={{ fontSize: 14, letterSpacing: ".12em", marginBottom: 8 }}>STREAK CALENDAR</div>
                        <div style={{ display: "flex", gap: 6 }}>
                            {Array.from({ length: 14 }).map((_, i) => {
                                const active = i >= 14 - user.streak;
                                return <div key={i} style={{ flex: 1, height: 28, background: active ? "rgba(255,180,0,.3)" : "rgba(255,255,255,.05)", border: `1px solid ${active ? "rgba(255,180,0,.5)" : "rgba(255,255,255,.08)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{active ? "🔥" : ""}</div>;
                            })}
                        </div>
                    </CyberCard>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <CyberCard style={{ padding: 24 }} color="#ffcc00">
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                            <div className="ORB" style={{ fontSize: 17, color: "#e0e8f0" }}>{q.title}</div>
                            <span className="badge-e">{q.diff}</span>
                            <span className="MONO gY" style={{ marginLeft: "auto", fontSize: 11 }}>+{q.xp + 20} XP</span>
                        </div>
                        <div className="MONO" style={{ fontSize: 13, color: "rgba(180,200,220,.8)", lineHeight: 1.8, whiteSpace: "pre-line", marginBottom: 16 }}>{q.desc}</div>
                        {q.examples.map((ex, i) => (
                            <div key={i} style={{ background: "rgba(0,15,30,.6)", border: "1px solid rgba(255,200,0,.15)", padding: 12, marginBottom: 8 }}>
                                <div className="MONO" style={{ fontSize: 11, color: "rgba(255,200,0,.5)" }}>Example {i + 1}</div>
                                <div className="MONO" style={{ fontSize: 12, color: "rgba(180,200,220,.7)" }}>Input: <span style={{ color: "#ffcc00" }}>{ex.i}</span></div>
                                <div className="MONO" style={{ fontSize: 12, color: "rgba(180,200,220,.7)" }}>Output: <span style={{ color: "#00ff41" }}>{ex.o}</span></div>
                            </div>
                        ))}
                        <Btn variant="ghost" size="sm" onClick={() => setHintShown((s) => !s)} style={{ marginTop: 8 }}>💡 Hint</Btn>
                        {hintShown && q.hints.map((h, i) => <div key={i} className="MONO bgP" style={{ border: "1px solid rgba(191,0,255,.3)", padding: 10, marginTop: 6, fontSize: 12, color: "#e0c0ff" }}>{h}</div>)}
                    </CyberCard>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <CyberCard style={{ padding: 0, overflow: "hidden" }}>
                            <div style={{ padding: "10px 16px", background: "rgba(255,200,0,.05)", borderBottom: "1px solid rgba(255,200,0,.2)", display: "flex", gap: 8 }}>
                                <div style={{ display: "flex", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff0033" }} /><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffcc00" }} /><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00ff41" }} /></div>
                                <span className="MONO" style={{ fontSize: 11, color: "rgba(255,200,0,.5)", letterSpacing: ".15em" }}>DAILY_{new Date().toISOString().slice(0, 10)}.js</span>
                            </div>
                            <CodeEditor value={code} onChange={setCode} height={260} />
                        </CyberCard>
                        <Btn variant={done ? "ghost" : "g"} onClick={run} disabled={running || done} style={{ justifyContent: "center" }}>
                            {done ? "✓ QUEST COMPLETED" : running ? "⏳ RUNNING..." : "▶ SUBMIT SOLUTION"}
                        </Btn>
                        {results && (
                            <CyberCard style={{ padding: 14 }} color={results.every((r) => r.passed) ? "#00ff41" : "#ff0033"}>
                                {results.map((r, i) => (
                                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                                        <span className="MONO" style={{ fontSize: 12, color: "rgba(180,200,220,.6)" }}>{r.label}</span>
                                        <span className={`MONO ${r.passed ? "gG" : "gR"}`} style={{ fontSize: 12 }}>{r.passed ? "✓ PASS" : r.error ? `✗ ${r.error.slice(0, 30)}` : `✗ Got ${r.output}`}</span>
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
