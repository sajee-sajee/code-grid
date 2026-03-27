import CyberCard from "../components/CyberCard";
import Btn from "../components/Btn";
import { useUser } from "../contexts/useUser";
import { getDuelOutcome } from "../utils/duelOutcome";

export default function DuelResult({ result, onNav }) {
    const { user } = useUser();
    const { won, isTie } = getDuelOutcome(result);
    const accentColor = isTie ? "#ffcc00" : won ? "#00ff41" : "#ff0033";
    const icon = isTie ? "⚖️" : won ? "🏆" : "💀";
    const headline = isTie ? "DRAW" : won ? "VICTORY" : "DEFEATED";
    const subhead = isTie ? "SCORES LOCKED. NO WINNER THIS ROUND" : won ? "YOU OUTCODE THE MACHINE" : "NEXUS-7 WINS THIS ROUND";

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            <div style={{ position: "relative", zIndex: 1, maxWidth: 500, width: "100%", textAlign: "center" }}>
                <CyberCard style={{ padding: 48 }} color={accentColor}>
                    <div className="aLevelUp" style={{ fontSize: 72, marginBottom: 16 }}>{icon}</div>
                    <div className={`ORB ${isTie ? "gY" : won ? "gG" : "gR"}`} style={{ fontSize: 32, fontWeight: 700, letterSpacing: ".15em", marginBottom: 8 }}>
                        {headline}
                    </div>
                    <div className="MONO" style={{ fontSize: 13, color: "rgba(160,180,200,.6)", marginBottom: 32, letterSpacing: ".15em" }}>
                        {subhead}
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
                    {isTie && <div className="MONO gY" style={{ fontSize: 12, marginBottom: 24 }}>NO XP BONUS AWARDED · REMATCH TO BREAK THE DEADLOCK</div>}
                    <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                        <Btn variant="r" onClick={() => onNav("duel-setup")}>⚔️ REMATCH</Btn>
                        <Btn variant="ghost" onClick={() => onNav("dashboard")}>DASHBOARD</Btn>
                    </div>
                </CyberCard>
            </div>
        </div>
    );
}
