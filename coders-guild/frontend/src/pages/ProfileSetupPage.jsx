import { useState } from "react";
import CyberCard from "../components/CyberCard";
import Btn from "../components/Btn";
import { useUser } from "../contexts/UserContext";

const FACES = ["🤖", "👾", "🦾", "💀", "🧠", "🦊", "🐉", "🌀", "⚡", "🔮"];
const OUTFITS = ["🥋", "🦺", "🧥", "👔", "🎭", "🛡️", "🔧"];
const ACCS = ["⚡", "🔋", "🎮", "📡", "💎", "🌐", "🔩", "⚙️"];

function PickRow({ label, items, sel, onSel }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <div className="MONO" style={{ fontSize: 11, color: "rgba(0,212,255,.5)", marginBottom: 8, letterSpacing: ".15em" }}>{label}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {items.map((item, i) => (
                    <div key={i} onClick={() => onSel(i)} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, cursor: "pointer", border: sel === i ? "1px solid #00ff41" : "1px solid rgba(255,255,255,.1)", boxShadow: sel === i ? "0 0 10px rgba(0,255,65,.4)" : "none", background: sel === i ? "rgba(0,255,65,.1)" : "rgba(0,8,18,.9)", transition: "all .2s" }}>
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ProfileSetupPage({ onComplete }) {
    const [username, setUsername] = useState("");
    const [face, setFace] = useState(0);
    const [outfit, setOutfit] = useState(0);
    const [acc, setAcc] = useState(0);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const { saveProfile } = useUser();

    const submit = async () => {
        if (username.trim().length < 3) { setErr("Username must be at least 3 characters"); return; }
        setLoading(true);
        try {
            const avatar = { face: FACES[face], outfit: OUTFITS[outfit], acc: ACCS[acc] };
            await saveProfile({ username: username.trim(), avatar });
            onComplete({ username: username.trim(), avatar });
        } catch (e) {
            setErr("Failed to save profile. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 600 }}>
                <div className="ORB gG" style={{ fontSize: 24, fontWeight: 700, letterSpacing: ".15em", marginBottom: 4, textAlign: "center" }}>IDENTITY SETUP</div>
                <div className="MONO" style={{ fontSize: 12, color: "rgba(0,212,255,.4)", textAlign: "center", marginBottom: 32, letterSpacing: ".2em" }}>CONFIGURE YOUR OPERATIVE PROFILE</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    <CyberCard style={{ padding: 24 }}>
                        <div className="MONO" style={{ fontSize: 11, color: "rgba(0,212,255,.5)", marginBottom: 8, letterSpacing: ".15em" }}>CODENAME</div>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your codename..." />
                        {err && <div className="MONO gR" style={{ fontSize: 11, marginTop: 8 }}>⚠ {err}</div>}
                        <div style={{ marginTop: 16 }}>
                            <PickRow label="AVATAR_FACE" items={FACES} sel={face} onSel={setFace} />
                            <PickRow label="OUTFIT_MODULE" items={OUTFITS} sel={outfit} onSel={setOutfit} />
                            <PickRow label="ACCESSORY_CHIP" items={ACCS} sel={acc} onSel={setAcc} />
                        </div>
                    </CyberCard>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
                        <div className="aFloat">
                            <div style={{ width: 160, height: 160, borderRadius: "50%", background: "rgba(0,15,30,.9)", border: "3px solid #00d4ff", boxShadow: "0 0 30px rgba(0,212,255,.5), 0 0 60px rgba(0,212,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72 }}>
                                {FACES[face]}
                            </div>
                        </div>
                        <div className="ORB gC" style={{ fontSize: 18, fontWeight: 700, letterSpacing: ".1em" }}>{username || "RECRUIT_???"}</div>
                        <div style={{ display: "flex", gap: 8 }}><span style={{ fontSize: 24 }}>{OUTFITS[outfit]}</span><span style={{ fontSize: 24 }}>{ACCS[acc]}</span></div>
                        <Btn variant="g" size="lg" onClick={submit} disabled={loading}>
                            {loading ? "⏳ DEPLOYING..." : "⚡ DEPLOY IDENTITY"}
                        </Btn>
                    </div>
                </div>
            </div>
        </div>
    );
}
