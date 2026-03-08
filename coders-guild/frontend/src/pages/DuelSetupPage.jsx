import { useState } from "react";
import CyberCard from "../components/CyberCard";
import Btn from "../components/Btn";
import { DISTRICTS } from "../constants/districts";

export default function DuelSetupPage({ onNav, onStartDuel }) {
    const [topic, setTopic] = useState("Arrays");
    const [diff, setDiff] = useState("Easy");
    const topics = DISTRICTS.map((d) => d.topic);

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 500 }}>
                <CyberCard style={{ padding: 36 }} color="#ff0033">
                    <div className="ORB gR" style={{ fontSize: 22, fontWeight: 700, letterSpacing: ".15em", marginBottom: 4, textAlign: "center" }}>⚔️ DUEL ARENA</div>
                    <div className="MONO" style={{ fontSize: 12, color: "rgba(255,0,51,.4)", textAlign: "center", marginBottom: 32, letterSpacing: ".2em" }}>CONFIGURE YOUR BATTLE PARAMETERS</div>
                    <div style={{ marginBottom: 20 }}>
                        <div className="MONO" style={{ fontSize: 11, color: "rgba(255,0,51,.5)", marginBottom: 8, letterSpacing: ".15em" }}>DSA TOPIC</div>
                        <select value={topic} onChange={(e) => setTopic(e.target.value)} style={{ width: "100%" }}>
                            {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div style={{ marginBottom: 32 }}>
                        <div className="MONO" style={{ fontSize: 11, color: "rgba(255,0,51,.5)", marginBottom: 8, letterSpacing: ".15em" }}>DIFFICULTY</div>
                        <div style={{ display: "flex", gap: 8 }}>
                            {["Easy", "Medium", "Hard"].map((d) => (
                                <div key={d} onClick={() => setDiff(d)} style={{ flex: 1, padding: "10px 0", textAlign: "center", cursor: "pointer", background: diff === d ? (d === "Easy" ? "rgba(0,255,65,.15)" : d === "Medium" ? "rgba(255,200,0,.15)" : "rgba(255,0,51,.15)") : "rgba(0,8,18,.8)", border: diff === d ? `1px solid ${d === "Easy" ? "#00ff41" : d === "Medium" ? "#ffcc00" : "#ff0033"}` : "1px solid rgba(255,255,255,.1)", fontFamily: "Orbitron,monospace", fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: diff === d ? (d === "Easy" ? "#00ff41" : d === "Medium" ? "#ffcc00" : "#ff0033") : "rgba(160,180,200,.5)", transition: "all .2s" }}>
                                    {d.toUpperCase()}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <Btn variant="ghost" onClick={() => onNav("dashboard")} style={{ flex: 1, justifyContent: "center" }}>← BACK</Btn>
                        <Btn variant="r" onClick={() => onStartDuel({ topic, diff })} style={{ flex: 2, justifyContent: "center" }}>⚔️ ENTER ARENA</Btn>
                    </div>
                </CyberCard>
            </div>
        </div>
    );
}
