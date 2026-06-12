import CyberCard from "../components/CyberCard";
import Btn from "../components/Btn";
import { useUser } from "../contexts/UserContext";
import { recordDuelEnd } from "../services/api";
import { useEffect } from "react";

export default function DuelResult({ result, onNav }) {
    const { user, patchUser } = useUser();
    const won = result.won;

    useEffect(() => {
        // Persist duel result to backend
        recordDuelEnd({ won: result.won, playerScore: result.playerScore, cpuScore: result.cpuScore }).catch(() => { });
        if (result.won) {
            patchUser({ duelWins: (user.duelWins || 0) + 1, duelGames: (user.duelGames || 0) + 1, xp: user.xp + 50 });
        } else {
            patchUser({ duelGames: (user.duelGames || 0) + 1 });
        }
    }, []);

    const accentColor = won ? "var(--color-green)" : "var(--color-red)";

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            
            {/* Ambient glows */}
            <div style={{ position: "absolute", width: 500, height: 500, background: `radial-gradient(circle, ${accentColor}08 0%, transparent 70%)`, zIndex: 1, pointerEvents: "none" }} />
            
            <div style={{ position: "relative", zIndex: 1, maxWidth: 540, width: "100%", textAlign: "center", animation: "fadeIn 0.5s ease" }}>
                <CyberCard style={{ padding: 48 }} color={accentColor}>
                    
                    {/* Status Trophy */}
                    <div className="aLevelUp" style={{ fontSize: 80, marginBottom: 24, filter: `drop-shadow(0 0 15px ${accentColor})` }}>
                        {won ? "🏆" : "💀"}
                    </div>
                    
                    <h2 className={`ORB ${won ? "gG" : "gR"}`} style={{ fontSize: 30, fontWeight: 900, letterSpacing: "0.15em", marginBottom: 8, textShadow: `0 0 12px ${won ? "var(--color-green-glow)" : "var(--color-red-glow)"}` }}>
                        {won ? "VICTORY ACHIEVED" : "SYSTEM FAILURE"}
                    </h2>
                    
                    <div className="MONO" style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 36, letterSpacing: "0.2em" }}>
                        {won ? "YOU OUTCODED THE NEXUS-7 SECURE GATEWAY" : "NEXUS-7 BLOCKADE SEIZED YOUR DATA PACKETS"}
                    </div>
                    
                    {/* Score comparison grid columns */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 36 }}>
                        <div style={{ 
                            padding: 20, 
                            background: "rgba(0, 255, 157, 0.04)", 
                            border: "1px solid rgba(0, 255, 157, 0.15)", 
                            borderRadius: 4,
                            boxShadow: won ? "0 0 10px rgba(0, 255, 157, 0.05)" : "none"
                        }}>
                            <div className="ORB gG" style={{ fontSize: 32, fontWeight: 900 }}>{result.playerScore}</div>
                            <div className="MONO" style={{ fontSize: 10, color: "var(--color-text-secondary)", letterSpacing: "0.15em", marginTop: 4 }}>
                                {user.username.toUpperCase()}
                            </div>
                        </div>
                        <div style={{ 
                            padding: 20, 
                            background: "rgba(255, 45, 85, 0.04)", 
                            border: "1px solid rgba(255, 45, 85, 0.15)", 
                            borderRadius: 4,
                            boxShadow: !won ? "0 0 10px rgba(255, 45, 85, 0.05)" : "none"
                        }}>
                            <div className="ORB gR" style={{ fontSize: 32, fontWeight: 900 }}>{result.cpuScore}</div>
                            <div className="MONO" style={{ fontSize: 10, color: "var(--color-text-secondary)", letterSpacing: "0.15em", marginTop: 4 }}>
                                NEXUS-7
                            </div>
                        </div>
                    </div>
                    
                    {won && (
                        <div className="MONO gY" style={{ fontSize: 12, marginBottom: 32, background: "rgba(250, 204, 21, 0.06)", border: "1px solid rgba(250, 204, 21, 0.15)", padding: "10px 14px", borderRadius: 4, display: "inline-block" }}>
                            ★ +50 XP COMBAT BONUS · NET STATED RECORDED
                        </div>
                    )}
                    {!won && (
                        <div className="MONO gR" style={{ fontSize: 12, marginBottom: 32, background: "rgba(255, 45, 85, 0.06)", border: "1px solid rgba(255, 45, 85, 0.15)", padding: "10px 14px", borderRadius: 4, display: "inline-block" }}>
                            ☠ RECALIBRATING SUB-VECTORS FOR RETRIAL
                        </div>
                    )}
                    
                    <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                        <Btn variant="r" onClick={() => onNav("duel-setup")} style={{ borderRadius: 4 }}>⚔️ REMATCH</Btn>
                        <Btn variant="ghost" onClick={() => onNav("dashboard")} style={{ borderRadius: 4 }}>DASHBOARD</Btn>
                    </div>
                </CyberCard>
            </div>
        </div>
    );
}
