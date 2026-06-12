import Btn from "../components/Btn";
import { DISTRICTS } from "../constants/districts";
import { getQuestionCountForLevel, getSolvedCountForLevel } from "../utils/progressUtils";
import CyberCard from "../components/CyberCard";

export default function SoloPage({ user, onNav, onSelectLevel }) {
    return (
        <div style={{ minHeight: "100vh", padding: "32px 24px", maxWidth: 1200, margin: "0 auto", position: "relative" }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            
            <div style={{ position: "relative", zIndex: 1 }}>
                
                {/* Header Section */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <Btn variant="ghost" size="sm" onClick={() => onNav("dashboard")}>← BACK</Btn>
                        <div>
                            <h2 className="ORB gG" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.15em", textShadow: "0 0 12px var(--color-green-glow)" }}>
                                CYBER CAMPAIGN
                            </h2>
                            <div className="MONO" style={{ fontSize: 11, color: "var(--color-text-muted)", letterSpacing: "0.15em", marginTop: 4 }}>
                                MAP DIRECTORY · SELECT TARGET DISTRICT OPERATIONAL SUBGRID
                            </div>
                        </div>
                    </div>
                    
                    <div className="MONO" style={{ 
                        background: "rgba(0, 255, 157, 0.08)", 
                        border: "1px solid var(--border-green)", 
                        padding: "8px 16px", 
                        fontSize: 12, 
                        fontWeight: 600,
                        color: "var(--color-green)",
                        boxShadow: "0 0 10px rgba(0, 255, 157, 0.1)"
                    }}>
                        SECURED: {user.unlockedLevel - 1} / 11 DISTRICTS
                    </div>
                </div>

                {/* District Selection Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
                    {DISTRICTS.map((d) => {
                        const unlocked = d.id <= user.unlockedLevel;
                        const done = getSolvedCountForLevel(user, d.id);
                        const total = getQuestionCountForLevel(d.id);
                        const completed = total > 0 && done >= total;
                        
                        return (
                            <div 
                                key={d.id}
                                className={`district-card ${unlocked ? "" : "locked"}`}
                                onClick={() => { if (unlocked) onSelectLevel(d.id); }}
                                style={{ 
                                    padding: 24, 
                                    background: unlocked ? "rgba(14, 18, 38, 0.75)" : "rgba(8, 9, 20, 0.4)", 
                                    border: `1px solid ${completed ? "var(--color-green)" : unlocked ? `${d.color}40` : "rgba(255,255,255,0.04)"}`, 
                                    boxShadow: completed ? "0 0 20px rgba(0, 255, 157, 0.2)" : unlocked ? `0 0 15px ${d.color}10` : "none", 
                                    clipPath: "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)", 
                                    position: "relative",
                                    backdropFilter: unlocked ? "blur(12px)" : "none",
                                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                                }}
                                onMouseEnter={(e) => {
                                    if (unlocked) {
                                        e.currentTarget.style.transform = "translateY(-6px)";
                                        e.currentTarget.style.borderColor = completed ? "var(--color-green)" : d.color;
                                        e.currentTarget.style.boxShadow = completed ? "0 10px 25px rgba(0,255,157,0.3)" : `0 10px 25px ${d.color}25`;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (unlocked) {
                                        e.currentTarget.style.transform = "none";
                                        e.currentTarget.style.borderColor = completed ? "var(--color-green)" : `${d.color}40`;
                                        e.currentTarget.style.boxShadow = completed ? "0 0 20px rgba(0, 255, 157, 0.2)" : `0 0 15px ${d.color}10`;
                                    }
                                }}
                            >
                                {/* Icons overlay */}
                                {completed && (
                                    <div style={{ 
                                        position: "absolute", 
                                        top: 16, 
                                        right: 16, 
                                        background: "rgba(0, 255, 157, 0.12)", 
                                        border: "1px solid var(--color-green)", 
                                        fontSize: 10,
                                        padding: "2px 6px",
                                        borderRadius: 4,
                                        fontFamily: "var(--font-mono)",
                                        color: "var(--color-green)",
                                        fontWeight: 700
                                    }}>
                                        SECURED
                                    </div>
                                )}
                                {!unlocked && (
                                    <div style={{ 
                                        position: "absolute", 
                                        top: 16, 
                                        right: 16, 
                                        fontSize: 14,
                                        opacity: 0.5
                                    }}>
                                        🔒
                                    </div>
                                )}

                                <div style={{ fontSize: 40, height: 44, marginBottom: 16, display: "flex", alignItems: "center", filter: unlocked ? `drop-shadow(0 0 10px ${d.color})` : "none" }}>
                                    {d.logo ? (
                                        <img src={d.logo} alt={d.name} style={{ width: 44, height: 44, objectFit: "contain", filter: unlocked ? `drop-shadow(0 0 6px ${d.color}aa)` : "grayscale(100%)" }} />
                                    ) : d.icon}
                                </div>
                                
                                <div className="ORB" style={{ fontSize: 10, color: unlocked ? d.color : "var(--color-text-muted)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 }}>
                                    DISTRICT NODE 0{d.id}
                                </div>
                                
                                <h3 className="ORB" style={{ fontSize: 16, color: unlocked ? "var(--color-text-primary)" : "var(--color-text-muted)", marginBottom: 4 }}>{d.name}</h3>
                                
                                <div className="MONO" style={{ fontSize: 11, color: unlocked ? "var(--color-cyan)" : "var(--color-text-muted)", marginBottom: 16, opacity: 0.7 }}>{d.topic}</div>
                                
                                <div style={{ height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 2, overflow: "hidden", marginBottom: 6 }}>
                                    <div style={{ width: `${total ? (done / total) * 100 : 0}%`, height: "100%", background: d.color, boxShadow: `0 0 6px ${d.color}`, transition: "width .6s cubic-bezier(0.16, 1, 0.3, 1)" }} />
                                </div>
                                
                                <div className="MONO" style={{ fontSize: 10, color: "var(--color-text-muted)", display: "flex", justifyContent: "space-between" }}>
                                    <span>PROGRESS:</span>
                                    <span style={{ color: unlocked ? "var(--color-text-secondary)" : "var(--color-text-muted)" }}>{done} / {total} SUB_MISSIONS</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
