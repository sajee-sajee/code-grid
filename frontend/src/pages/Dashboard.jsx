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
        <div style={{ minHeight: "100vh", padding: 24, maxWidth: 1100, margin: "0 auto" }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            <div style={{ position: "relative", zIndex: 1 }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div 
                            onClick={() => setShowProfileModal(true)}
                            title="Edit Profile"
                            style={{ cursor: "pointer", transition: "all 0.2s", transform: "scale(1)", display: "flex" }}
                            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                        >
                            <AvatarView avatar={user.avatar} size={70} />
                        </div>
                        <div>
                            <div className="ORB gC" style={{ fontSize: 20, fontWeight: 700 }}>{user.username}</div>
                            <div className="MONO" style={{ fontSize: 12, color: "rgba(var(--cyan-rgb),.5)" }}>OPERATIVE LVL {lvl} · {user.xp} XP</div>
                            <XBar val={levelXp(user.xp)} max={300} color="var(--cyan)" />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                        <div style={{ display: "flex", gap: 12 }}>
                            {[{ v: user.solved.length, l: "SOLVED", c: "var(--green)" }, { v: `${user.streak}🔥`, l: "STREAK", c: "#ff6600" }, { v: user.duelWins || 0, l: "WINS", c: "var(--purple)" }].map((s, i) => (
                                <div key={i} style={{ textAlign: "center", padding: "0 12px" }}>
                                    <div className="ORB" style={{ fontSize: 24, fontWeight: 700, color: s.c, textShadow: `0 0 8px ${s.c}` }}>{s.v}</div>
                                    <div className="MONO" style={{ fontSize: 10, color: "rgba(var(--text-muted-rgb),.4)", letterSpacing: ".15em" }}>{s.l}</div>
                                </div>
                            ))}
                        </div>
                        <Btn variant="ghost" size="sm" onClick={() => { logout(); onNav("landing"); }} style={{ padding: "6px 12px", border: "1px solid rgba(var(--red-rgb),.5)", color: "var(--red)", clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)" }}>LOGOUT</Btn>
                    </div>
                </div>

                {/* Main cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, marginBottom: 28 }}>
                    {[
                        { label: "CYBER CAMPAIGN", sub: "Solo story mode", icon: "🗺️", color: "var(--green)", onClick: () => onNav("solo"), desc: `District ${user.unlockedLevel}/11 · ${user.solved.length} missions complete` },
                        { label: "DAILY QUEST", sub: "Maintain your streak", icon: "📅", color: "var(--yellow)", onClick: () => onNav("daily"), desc: `Streak: ${user.streak} days 🔥 · ${doneToday ? "✅ Done Today" : "⚡ Ready"}` },
                        { label: "DUEL ARENA", sub: "Real-time coding battles", icon: "⚔️", color: "var(--red)", onClick: () => onNav("duel-setup"), desc: `${user.duelWins || 0} wins · ${user.duelGames || 0} games played` },
                    ].map((c) => (
                        <div key={c.label} onClick={c.onClick} style={{ padding: 24, background: "rgba(var(--bg-card-rgb),.95)", border: `1px solid ${c.color}33`, boxShadow: `0 0 12px ${c.color}18`, cursor: "pointer", transition: "all .25s", clipPath: "polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>{c.icon}</div>
                            <div className="ORB" style={{ fontSize: 15, fontWeight: 700, color: c.color, letterSpacing: ".1em", marginBottom: 4 }}>{c.label}</div>
                            <div className="MONO" style={{ fontSize: 12, color: "rgba(var(--text-muted-rgb),.5)", marginBottom: 8 }}>{c.sub}</div>
                            <div className="MONO" style={{ fontSize: 11, color: c.color, opacity: 0.7 }}>{c.desc}</div>
                        </div>
                    ))}
                </div>

                {/* District progress + Achievements */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
                    <CyberCard style={{ padding: 24 }}>
                        <div className="ORB gC" style={{ fontSize: 13, letterSpacing: ".15em", marginBottom: 16 }}>DISTRICT PROGRESS</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 10 }}>
                            {DISTRICTS.map((d) => {
                                const done = getSolvedCountForLevel(user, d.id);
                                const total = getQuestionCountForLevel(d.id);
                                const unlocked = d.id <= user.unlockedLevel;
                                return (
                                    <div key={d.id} style={{ padding: 10, background: "rgba(var(--bg-panel-rgb),.6)", border: `1px solid ${unlocked ? d.color + "44" : "rgba(var(--white-rgb),.06)"}`, opacity: unlocked ? 1 : 0.35 }}>
                                        <div style={{ fontSize: 22, height: 28, marginBottom: 4, display: "flex", alignItems: "center" }}>
                                            {d.logo ? <img src={d.logo} alt={d.name} style={{ height: "100%", width: "auto", objectFit: "contain", filter: unlocked ? `drop-shadow(0 0 6px ${d.color}aa)` : "grayscale(100%)" }} /> : d.icon}
                                        </div>
                                        <div className="ORB" style={{ fontSize: 9, color: unlocked ? d.color : "rgba(var(--text-muted-rgb),.4)", letterSpacing: ".08em" }}>{d.name}</div>
                                        <div className="MONO" style={{ fontSize: 10, color: "rgba(var(--text-muted-rgb),.5)", marginTop: 2 }}>{done}/{total}</div>
                                        <div style={{ height: 3, background: "rgba(var(--white-rgb),.08)", marginTop: 6 }}>
                                            <div style={{ width: `${total ? (done / total) * 100 : 0}%`, height: "100%", background: d.color, transition: "width .5s" }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CyberCard>
                    <CyberCard style={{ padding: 24 }}>
                        <div className="ORB gC" style={{ fontSize: 13, letterSpacing: ".15em", marginBottom: 16 }}>ACHIEVEMENTS</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {ACHIEVEMENTS.map((a) => {
                                const earned = a.check(user);
                                return (
                                    <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, opacity: earned ? 1 : 0.3 }}>
                                        <span style={{ fontSize: 20 }}>{a.icon}</span>
                                        <div>
                                            <div className="ORB" style={{ fontSize: 10, color: earned ? "var(--green)" : "rgba(var(--text-muted-rgb),.5)", letterSpacing: ".08em" }}>{a.name}</div>
                                            <div className="MONO" style={{ fontSize: 10, color: "rgba(var(--text-muted-rgb),.4)" }}>{a.desc}</div>
                                        </div>
                                        {earned && <span className="MONO gG" style={{ marginLeft: "auto", fontSize: 11 }}>✓</span>}
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
