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

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            <div style={{ position: "relative", zIndex: 1, maxWidth: 500, width: "100%", textAlign: "center" }}>
                <CyberCard style={{ padding: 48 }} color={won ? "#00ff41" : "#ff0033"}>
                    <div className="aLevelUp" style={{ fontSize: 72, marginBottom: 16 }}>{won ? "🏆" : "💀"}</div>
                    <div className={`ORB ${won ? "gG" : "gR"}`} style={{ fontSize: 32, fontWeight: 700, letterSpacing: ".15em", marginBottom: 8 }}>
                        {won ? "VICTORY" : "DEFEATED"}
                    </div>
                    <div className="MONO" style={{ fontSize: 13, color: "rgba(160,180,200,.6)", marginBottom: 32, letterSpacing: ".15em" }}>
                        {won ? "YOU OUTCODE THE MACHINE" : "NEXUS-7 WINS THIS ROUND"}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
                        <div style={{ padding: 16, background: "rgba(0,255,65,.08)", border: "1px solid rgba(0,255,65,.3)" }}>
                            <div className="ORB gG" style={{ fontSize: 28, fontWeight: 700 }}>{result.playerScore}</div>
                            <div className="MONO" style={{ fontSize: 11, color: "rgba(0,255,65,.5)", letterSpacing: ".15em" }}>{user.username}</div>
                        </div>
                        <div style={{ padding: 16, background: "rgba(255,0,51,.08)", border: "1px solid rgba(255,0,51,.3)" }}>
                            <div className="ORB gR" style={{ fontSize: 28, fontWeight: 700 }}>{result.cpuScore}</div>
                            <div className="MONO" style={{ fontSize: 11, color: "rgba(255,0,51,.5)", letterSpacing: ".15em" }}>NEXUS-7</div>
                        </div>
                    </div>
                    {won && <div className="MONO gY" style={{ fontSize: 12, marginBottom: 24 }}>+50 XP DUEL BONUS · +1 WIN RECORDED</div>}
                    <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                        <Btn variant="r" onClick={() => onNav("duel-setup")}>⚔️ REMATCH</Btn>
                        <Btn variant="ghost" onClick={() => onNav("dashboard")}>DASHBOARD</Btn>
                    </div>
                </CyberCard>
            </div>
        </div>
    );
}
