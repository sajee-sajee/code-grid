import { useState } from "react";
import CyberCard from "../components/CyberCard";
import Btn from "../components/Btn";
import { DISTRICTS } from "../constants/districts";
import { getAvailableDifficulties } from "../utils/questionSets";

export default function DuelSetupPage({ onNav, onStartDuel }) {
    const [topic, setTopic] = useState("Arrays");
    const [diff, setDiff] = useState("Easy");
    const topics = DISTRICTS.map((d) => d.topic);
    const selectedDistrict = DISTRICTS.find((d) => d.topic === topic) || DISTRICTS[0];
    const availableDiffs = getAvailableDifficulties(selectedDistrict?.id);
    const selectedDiff = availableDiffs.includes(diff) ? diff : availableDiffs[0] || "Easy";

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 500 }}>
                <CyberCard style={{ padding: 36 }} color="var(--red)">
                    <div className="ORB gR" style={{ fontSize: 22, fontWeight: 700, letterSpacing: ".15em", marginBottom: 4, textAlign: "center" }}>⚔️ DUEL ARENA</div>
                    <div className="MONO" style={{ fontSize: 12, color: "rgba(var(--red-rgb),.4)", textAlign: "center", marginBottom: 32, letterSpacing: ".2em" }}>CONFIGURE YOUR BATTLE PARAMETERS</div>
                    <div style={{ marginBottom: 20 }}>
                        <div className="MONO" style={{ fontSize: 11, color: "rgba(var(--red-rgb),.5)", marginBottom: 8, letterSpacing: ".15em" }}>DSA TOPIC</div>
                        <select value={topic} onChange={(e) => setTopic(e.target.value)} style={{ width: "100%" }}>
                            {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div style={{ marginBottom: 32 }}>
                        <div className="MONO" style={{ fontSize: 11, color: "rgba(var(--red-rgb),.5)", marginBottom: 8, letterSpacing: ".15em" }}>DIFFICULTY</div>
                        <div style={{ display: "flex", gap: 8 }}>
                            {["Easy", "Medium", "Hard"].map((d) => (
                                <div
                                    key={d}
                                    onClick={() => { if (availableDiffs.includes(d)) setDiff(d); }}
                                    style={{
                                        flex: 1,
                                        padding: "10px 0",
                                        textAlign: "center",
                                        cursor: availableDiffs.includes(d) ? "pointer" : "not-allowed",
                                        background: selectedDiff === d ? (d === "Easy" ? "rgba(var(--green-rgb),.15)" : d === "Medium" ? "rgba(var(--yellow-rgb),.15)" : "rgba(var(--red-rgb),.15)") : "rgba(var(--bg-card-rgb),.8)",
                                        border: selectedDiff === d ? `1px solid ${d === "Easy" ? "var(--green)" : d === "Medium" ? "var(--yellow)" : "var(--red)"}` : "1px solid rgba(var(--white-rgb),.1)",
                                        fontFamily: "Orbitron,monospace",
                                        fontSize: 11,
                                        fontWeight: 700,
                                        letterSpacing: ".08em",
                                        color: selectedDiff === d ? (d === "Easy" ? "var(--green)" : d === "Medium" ? "var(--yellow)" : "var(--red)") : availableDiffs.includes(d) ? "rgba(var(--text-muted-rgb),.5)" : "rgba(var(--text-muted-rgb),.2)",
                                        transition: "all .2s",
                                        opacity: availableDiffs.includes(d) ? 1 : 0.45,
                                    }}
                                >
                                    {d.toUpperCase()}
                                </div>
                            ))}
                        </div>
                        <div className="MONO" style={{ fontSize: 10, color: "rgba(var(--red-rgb),.35)", marginTop: 10, letterSpacing: ".12em" }}>
                            QUESTION SET: {availableDiffs.join(" · ")}
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <Btn variant="ghost" onClick={() => onNav("dashboard")} style={{ flex: 1, justifyContent: "center" }}>← BACK</Btn>
                        <Btn variant="r" onClick={() => onStartDuel({ topic, diff: selectedDiff, levelId: selectedDistrict?.id || 1 })} style={{ flex: 2, justifyContent: "center" }}>⚔️ ENTER ARENA</Btn>
                    </div>
                </CyberCard>
            </div>
        </div>
    );
}
