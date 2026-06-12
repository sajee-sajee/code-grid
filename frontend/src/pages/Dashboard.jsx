import CyberCard from "../components/CyberCard";
import XBar from "../components/XBar";
import { xpToLevel, levelXp } from "../utils/xpUtils";
import { hasCompletedDailyToday } from "../utils/dailyUtils";
import { getQuestionCountForLevel, getSolvedCountForLevel } from "../utils/progressUtils";
import { DISTRICTS } from "../constants/districts";
import { ACHIEVEMENTS } from "../constants/achievements";
import { useUser } from "../contexts/useUser";
import Btn from "../components/Btn";
import ProfileModal from "../components/ProfileModal";
import AvatarView from "../components/AvatarView";
import { useState } from "react";

export default function Dashboard({ user, onNav }) {
    const { logout } = useUser();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const lvl = xpToLevel(user.xp);
    const doneToday = hasCompletedDailyToday(user);

    return (
        <div style={{ minHeight: "100vh", padding: "32px 24px", maxWidth: 1200, margin: "0 auto", position: "relative" }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            
            <div style={{ position: "relative", zIndex: 1 }}>
                
                {/* Tactical HUD Header */}
                <CyberCard style={{ padding: "24px 32px", marginBottom: 32 }} color="var(--color-cyan)">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 20, flex: 1, minWidth: 280 }}>
                            <div 
                                onClick={() => setShowProfileModal(true)}
                                title="Edit Profile"
                                style={{ 
                                    cursor: "pointer", 
                                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)", 
                                    display: "flex",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    border: "2px solid var(--color-cyan)",
                                    boxShadow: "0 0 20px rgba(0, 229, 255, 0.4)"
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                            >
                                <AvatarView avatar={user.avatar} size={72} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <h3 className="ORB gC" style={{ fontSize: 20, fontWeight: 700 }}>{user.username}</h3>
                                </div>
                                <div className="MONO" style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 8, letterSpacing: "0.15em" }}>
                                    OPERATIVE LVL {lvl} · SECURITY CLEARANCE LEVEL_0{lvl}
                                </div>
                                <XBar val={levelXp(user.xp)} max={300} color="var(--color-cyan)" />
                            </div>
                        </div>
                        
                        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                            {[
                                { v: user.solved.length, l: "SOLVED", c: "var(--color-green)" }, 
                                { v: `${user.streak}🔥`, l: "STREAK", c: "var(--color-yellow)" }, 
                                { v: user.duelWins || 0, l: "WINS", c: "var(--color-purple)" }
                            ].map((s, i) => (
                                <div key={i} style={{ textAlign: "center", minWidth: 70, borderLeft: i > 0 ? "1px dashed rgba(255,255,255,0.1)" : "none", paddingLeft: i > 0 ? 20 : 0 }}>
                                    <div className="ORB" style={{ fontSize: 26, fontWeight: 800, color: s.c, textShadow: `0 0 10px ${s.c}55` }}>{s.v}</div>
                                    <div className="MONO" style={{ fontSize: 9, color: "var(--color-text-muted)", letterSpacing: "0.2em", marginTop: 4 }}>{s.l}</div>
                                </div>
                            ))}
                            <div style={{ borderLeft: "1px dashed rgba(255,255,255,0.1)", paddingLeft: 20 }}>
                                <Btn variant="ghost" size="sm" onClick={() => { logout(); onNav("landing"); }} style={{ borderColor: "rgba(255, 45, 85, 0.4)", color: "var(--color-red)" }}>LOGOUT</Btn>
                            </div>
                        </div>
                    </div>
                </CyberCard>

                {/* Operations Mode Selector Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, marginBottom: 32 }}>
                    {[
                        { label: "CYBER CAMPAIGN", sub: "Solo Story Mode Operations", icon: "🗺️", color: "var(--color-green)", onClick: () => onNav("solo"), desc: `District ${user.unlockedLevel}/11 · ${user.solved.length} missions completed`, glow: "rgba(0, 255, 157, 0.15)" },
                        { label: "DAILY QUEST", sub: "Maintain System Sync Streak", icon: "📅", color: "var(--color-yellow)", onClick: () => onNav("daily"), desc: `Streak: ${user.streak} days 🔥 · ${doneToday ? "✓ Complete Today" : "⚡ Ready for Breach"}`, glow: "rgba(250, 204, 21, 0.15)" },
                        { label: "DUEL ARENA", sub: "Real-time PVP vs NEXUS-7 AI", icon: "⚔️", color: "var(--color-red)", onClick: () => onNav("duel-setup"), desc: `${user.duelWins || 0} wins · ${user.duelGames || 0} combat duels logged`, glow: "rgba(255, 45, 85, 0.15)" },
                    ].map((c) => (
                        <div 
                            key={c.label} 
                            onClick={c.onClick} 
                            style={{ 
                                padding: 32, 
                                background: "rgba(14, 18, 38, 0.7)", 
                                border: `1px solid ${c.color}25`, 
                                boxShadow: `0 0 20px ${c.glow}, inset 0 0 15px rgba(255,255,255,0.01)`, 
                                cursor: "pointer", 
                                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", 
                                clipPath: "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
                                backdropFilter: "blur(12px)"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-6px)";
                                e.currentTarget.style.borderColor = c.color;
                                e.currentTarget.style.boxShadow = `0 10px 30px ${c.color}35, inset 0 0 20px ${c.color}10`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "none";
                                e.currentTarget.style.borderColor = `${c.color}25`;
                                e.currentTarget.style.boxShadow = `0 0 20px ${c.glow}, inset 0 0 15px rgba(255,255,255,0.01)`;
                            }}
                        >
                            <div style={{ fontSize: 48, marginBottom: 16, filter: `drop-shadow(0 0 10px ${c.color}66)` }}>{c.icon}</div>
                            <div className="ORB" style={{ fontSize: 16, fontWeight: 700, color: c.color, letterSpacing: "0.15em", marginBottom: 6 }}>{c.label}</div>
                            <div className="MONO" style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 12 }}>{c.sub}</div>
                            <div className="MONO" style={{ fontSize: 11, color: c.color, opacity: 0.85, fontWeight: 600 }}>{c.desc}</div>
                        </div>
                    ))}
                </div>

                {/* District Progress + Achievements Columns */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 24 }}>
                    
                    {/* District Progress List */}
                    <CyberCard style={{ padding: 28 }} color="var(--color-cyan)">
                        <div className="ORB gC" style={{ fontSize: 13, letterSpacing: "0.2em", marginBottom: 24, fontWeight: 700 }}>
                            TACTICAL DISTRICT STATUS MAP
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(135px, 1fr))", gap: 12 }}>
                            {DISTRICTS.map((d) => {
                                const done = getSolvedCountForLevel(user, d.id);
                                const total = getQuestionCountForLevel(d.id);
                                const unlocked = d.id <= user.unlockedLevel;
                                return (
                                    <div 
                                        key={d.id} 
                                        style={{ 
                                            padding: 14, 
                                            background: "rgba(10, 13, 28, 0.5)", 
                                            border: `1px solid ${unlocked ? d.color + "30" : "rgba(255,255,255,0.04)"}`, 
                                            borderRadius: 4,
                                            opacity: unlocked ? 1 : 0.3, 
                                            transition: "all 0.25s"
                                        }}
                                    >
                                        <div style={{ fontSize: 26, height: 28, marginBottom: 6, display: "flex", alignItems: "center", filter: unlocked ? `drop-shadow(0 0 6px ${d.color}66)` : "none" }}>
                                            {d.logo ? (
                                                <img src={d.logo} alt={d.name} style={{ height: "100%", width: "auto", objectFit: "contain", filter: unlocked ? `drop-shadow(0 0 6px ${d.color}aa)` : "grayscale(100%)" }} />
                                            ) : d.icon}
                                        </div>
                                        <div className="ORB" style={{ fontSize: 9, color: unlocked ? d.color : "var(--color-text-muted)", letterSpacing: "0.08em", fontWeight: 700, textTransform: "uppercase" }}>{d.name}</div>
                                        <div className="MONO" style={{ fontSize: 10, color: "var(--color-text-secondary)", marginTop: 4 }}>{done} / {total} CLEARED</div>
                                        <div style={{ height: 4, background: "rgba(255, 255, 255, 0.05)", marginTop: 8, borderRadius: 2, overflow: "hidden" }}>
                                            <div style={{ width: `${total ? (done / total) * 100 : 0}%`, height: "100%", background: d.color, boxShadow: `0 0 6px ${d.color}`, transition: "width 0.6s ease" }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CyberCard>
                    
                    {/* Achievements List */}
                    <CyberCard style={{ padding: 28 }} color="var(--color-purple)">
                        <div className="ORB gP" style={{ fontSize: 13, letterSpacing: "0.2em", marginBottom: 24, fontWeight: 700 }}>
                            OPERATIVE SERVICE AWARDS
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {ACHIEVEMENTS.map((a) => {
                                const earned = a.check(user);
                                return (
                                    <div 
                                        key={a.id} 
                                        style={{ 
                                            display: "flex", 
                                            alignItems: "center", 
                                            gap: 16, 
                                            background: earned ? "rgba(191, 85, 236, 0.04)" : "rgba(10, 13, 28, 0.4)",
                                            border: `1px solid ${earned ? "rgba(191, 85, 236, 0.2)" : "rgba(255,255,255,0.03)"}`,
                                            padding: "12px 16px",
                                            borderRadius: 4,
                                            opacity: earned ? 1 : 0.45 
                                        }}
                                    >
                                        <span style={{ fontSize: 24, filter: earned ? "drop-shadow(0 0 6px var(--color-purple))" : "none" }}>{a.icon}</span>
                                        <div>
                                            <div className="ORB" style={{ fontSize: 11, color: earned ? "var(--color-green)" : "var(--color-text-secondary)", letterSpacing: "0.08em", fontWeight: 700 }}>
                                                {a.name.toUpperCase()}
                                            </div>
                                            <div className="MONO" style={{ fontSize: 10, color: "var(--color-text-muted)", marginTop: 2 }}>{a.desc}</div>
                                        </div>
                                        {earned && (
                                            <span 
                                                className="MONO gG" 
                                                style={{ 
                                                    marginLeft: "auto", 
                                                    fontSize: 12, 
                                                    fontWeight: 700,
                                                    background: "rgba(0, 255, 157, 0.1)",
                                                    padding: "2px 6px",
                                                    borderRadius: 4
                                                }}
                                            >
                                                SECURED
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CyberCard>
                </div>
            </div>
            
            {showProfileModal && (
                <ProfileModal 
                    user={user} 
                    onClose={() => setShowProfileModal(false)}
                />
            )}
        </div>
    );
}
