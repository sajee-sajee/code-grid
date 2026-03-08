import Btn from "../components/Btn";
import { DISTRICTS } from "../constants/districts";

export default function SoloPage({ user, onNav, onSelectLevel }) {
    return (
        <div style={{ minHeight: "100vh", padding: 24, maxWidth: 1100, margin: "0 auto" }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                    <Btn variant="ghost" size="sm" onClick={() => onNav("dashboard")}>← BACK</Btn>
                    <div className="ORB gG" style={{ fontSize: 22, fontWeight: 700, letterSpacing: ".12em" }}>CYBER CAMPAIGN</div>
                </div>
                <div className="MONO" style={{ fontSize: 12, color: "rgba(0,212,255,.4)", marginBottom: 32, letterSpacing: ".15em" }}>
                    SELECT DISTRICT · {user.unlockedLevel - 1} OF 11 CLEARED
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 }}>
                    {DISTRICTS.map((d) => {
                        const unlocked = d.id <= user.unlockedLevel;
                        const done = user.solved.filter((s) => s.levelId === d.id).length;
                        const completed = done >= 3;
                        return (
                            <div key={d.id}
                                className={`district-card ${unlocked ? "" : "locked"}`}
                                onClick={() => { if (unlocked) onSelectLevel(d.id); }}
                                style={{ padding: 20, background: "rgba(0,8,18,.95)", border: `1px solid ${completed ? "#00ff41" : unlocked ? d.color + "55" : "rgba(255,255,255,.06)"}`, boxShadow: completed ? "0 0 16px rgba(0,255,65,.3)" : unlocked ? `0 0 10px ${d.color}20` : "none", clipPath: "polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)", position: "relative" }}>
                                {!unlocked && <div style={{ position: "absolute", top: 8, right: 8, fontSize: 14 }}>🔒</div>}
                                {completed && <div style={{ position: "absolute", top: 8, right: 8, fontSize: 14 }}>✅</div>}
                                <div style={{ fontSize: 36, marginBottom: 10 }}>{d.icon}</div>
                                <div className="ORB" style={{ fontSize: 11, color: unlocked ? d.color : "rgba(160,180,200,.3)", fontWeight: 700, letterSpacing: ".08em", marginBottom: 4 }}>LVL {d.id}</div>
                                <div className="ORB" style={{ fontSize: 13, color: unlocked ? "#e0e8f0" : "rgba(160,180,200,.3)", marginBottom: 4 }}>{d.name}</div>
                                <div className="MONO" style={{ fontSize: 11, color: "rgba(160,180,200,.4)", marginBottom: 10 }}>{d.topic}</div>
                                <div style={{ height: 4, background: "rgba(255,255,255,.06)" }}>
                                    <div style={{ width: `${(done / 3) * 100}%`, height: "100%", background: d.color, transition: "width .6s" }} />
                                </div>
                                <div className="MONO" style={{ fontSize: 10, color: "rgba(160,180,200,.4)", marginTop: 4 }}>{done}/3 missions</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
