import { useState } from "react";
import CyberCard from "../components/CyberCard";
import Btn from "../components/Btn";
import { useUser } from "../contexts/useUser";
import AvatarView from "../components/AvatarView";

import { HEADS, BODIES, FEET } from "../constants/avatars";

function PickRow({ label, items, sel, onSel }) {
    let transform = "scale(1)";
    let origin = "center center";
    if (label === "HEAD_UNIT") { transform = "scale(2.2)"; origin = "top center"; }
    else if (label === "BODY_CHASSIS") { transform = "scale(1.8)"; origin = "center center"; }
    else if (label === "LOCOMOTION_BASE") { transform = "scale(2.2)"; origin = "bottom center"; }

    return (
        <div style={{ marginBottom: 20 }}>
            <div className="MONO" style={{ fontSize: 11, color: "rgba(0,212,255,.5)", marginBottom: 8, letterSpacing: ".15em" }}>{label}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {items.map((item, i) => (
                    <div key={i} onClick={() => onSel(i)} style={{ width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: sel === i ? "1px solid #00ff41" : "1px solid rgba(255,255,255,.1)", boxShadow: sel === i ? "0 0 10px rgba(0,255,65,.4)" : "none", background: sel === i ? "rgba(0,255,65,.1)" : "rgba(0,8,18,.9)", transition: "all .2s", overflow: "hidden", borderRadius: 4 }}>
                        <img src={item} alt={`${label} ${i}`} style={{ width: "100%", height: "100%", objectFit: "contain", transformOrigin: origin, transform: transform }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ProfileSetupPage({ onComplete }) {
    const [username, setUsername] = useState("");
    const [head, setHead] = useState(0);
    const [body, setBody] = useState(0);
    const [foot, setFoot] = useState(0);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const { saveProfile } = useUser();

    const submit = async () => {
        const u = username.trim();
        if (u.length < 3) { setErr("Username must be at least 3 characters"); return; }
        if (!/^[a-zA-Z0-9]+$/.test(u)) { setErr("Username can only contain letters and numbers"); return; }
        if (!/[a-zA-Z]/.test(u)) { setErr("Username must contain at least one letter"); return; }
        
        setLoading(true);
        try {
            const avatar = { head: HEADS[head], body: BODIES[body], foot: FEET[foot] };
            await saveProfile({ username: username.trim(), avatar });
            onComplete({ username: username.trim(), avatar });
        } catch {
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
                            <PickRow label="HEAD_UNIT" items={HEADS} sel={head} onSel={setHead} />
                            <PickRow label="BODY_CHASSIS" items={BODIES} sel={body} onSel={setBody} />
                            <PickRow label="LOCOMOTION_BASE" items={FEET} sel={foot} onSel={setFoot} />
                        </div>
                    </CyberCard>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
                        <div>
                            <AvatarView avatar={{ head: HEADS[head], body: BODIES[body], foot: FEET[foot] }} size={200} />
                        </div>
                        <div className="ORB gC" style={{ fontSize: 18, fontWeight: 700, letterSpacing: ".1em" }}>{username || "RECRUIT_???"}</div>
                        <Btn variant="g" size="lg" onClick={submit} disabled={loading}>
                            {loading ? "⏳ DEPLOYING..." : "⚡ DEPLOY IDENTITY"}
                        </Btn>
                    </div>
                </div>
            </div>
        </div>
    );
}
