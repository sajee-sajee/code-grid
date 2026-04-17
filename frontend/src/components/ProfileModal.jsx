import { useState } from "react";
import CyberCard from "./CyberCard";
import Btn from "./Btn";
import { useUser } from "../contexts/useUser";

import AvatarView from "./AvatarView";
import { HEADS, BODIES, FEET } from "../constants/avatars";

function PickRow({ label, items, sel, onSel }) {
    let transform = "scale(1)";
    let origin = "center center";
    if (label === "HEAD_UNIT") { transform = "scale(2.2)"; origin = "top center"; }
    else if (label === "BODY_CHASSIS") { transform = "scale(1.8)"; origin = "center center"; }
    else if (label === "LOCOMOTION_BASE") { transform = "scale(2.2)"; origin = "bottom center"; }

    return (
        <div style={{ marginBottom: 20 }}>
            <div className="MONO" style={{ fontSize: 11, color: "rgba(var(--cyan-rgb),.5)", marginBottom: 8, letterSpacing: ".15em" }}>{label}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", maxHeight: 96, overflowY: "auto" }}>
                {items.map((item, i) => (
                    <div key={i} onClick={() => onSel(i)} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: sel === i ? "1px solid var(--cyan)" : "1px solid rgba(var(--white-rgb),.1)", boxShadow: sel === i ? "0 0 10px rgba(var(--cyan-rgb),.4)" : "none", background: sel === i ? "rgba(var(--cyan-rgb),.1)" : "rgba(var(--bg-card-rgb),.9)", transition: "all .2s", overflow: "hidden", borderRadius: 4 }}>
                        <img src={item} alt={`${label} ${i}`} style={{ width: "100%", height: "100%", objectFit: "contain", transformOrigin: origin, transform: transform }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ProfileModal({ user, onClose }) {
    const { saveProfile } = useUser();
    
    const [username, setUsername] = useState(user?.username || "");
    const [head, setHead] = useState(() => Math.max(0, HEADS.indexOf(user?.avatar?.head)));
    const [body, setBody] = useState(() => Math.max(0, BODIES.indexOf(user?.avatar?.body)));
    const [foot, setFoot] = useState(() => Math.max(0, FEET.indexOf(user?.avatar?.foot)));
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (username.trim().length < 3) { setErr("Username must be at least 3 characters."); return; }
        setLoading(true);
        try {
            const avatar = { head: HEADS[head], body: BODIES[body], foot: FEET[foot] };
            await saveProfile({ username: username.trim(), avatar });
            onClose();
        } catch {
            setErr("Failed to update profile. Try again.");
            setLoading(false);
        }
    };

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(0,4,8,0.85)", backdropFilter: "blur(5px)" }}>
            <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 640, animation: "fadeUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
                <CyberCard style={{ padding: "28px 32px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                        <div className="ORB gC" style={{ fontSize: 24, fontWeight: 700, letterSpacing: ".15em" }}>EDIT PROFILE</div>
                        <Btn variant="ghost" size="sm" onClick={onClose} style={{ padding: "4px 10px", fontSize: 14 }}>✕</Btn>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) 1fr", gap: 32 }}>
                        <div>
                            <div className="MONO" style={{ fontSize: 11, color: "rgba(var(--cyan-rgb),.5)", marginBottom: 8, letterSpacing: ".15em" }}>CODENAME</div>
                            <input className="cyber-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter codename..." />
                            {err && <div className="MONO gR" style={{ fontSize: 11, marginTop: 8 }}>⚠ {err}</div>}
                            
                            <div style={{ marginTop: 24 }}>
                                <PickRow label="HEAD_UNIT" items={HEADS} sel={head} onSel={setHead} />
                                <PickRow label="BODY_CHASSIS" items={BODIES} sel={body} onSel={setBody} />
                                <PickRow label="LOCOMOTION_BASE" items={FEET} sel={foot} onSel={setFoot} />
                            </div>
                        </div>
                        
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                                <AvatarView avatar={{ head: HEADS[head], body: BODIES[body], foot: FEET[foot] }} size={200} />
                            </div>
                            <div className="ORB gC" style={{ fontSize: 18, fontWeight: 700, letterSpacing: ".1em", textAlign: "center", marginBottom: 12, wordBreak: "break-all" }}>{username || "RECRUIT_???"}</div>
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, paddingTop: 24, borderTop: "1px solid rgba(var(--cyan-rgb),0.2)" }}>
                        <Btn variant="ghost" onClick={onClose} disabled={loading}>CANCEL</Btn>
                        <Btn variant="c" onClick={submit} disabled={loading}>
                            {loading ? "⏳ UPDATING..." : "✓ SAVE CHANGES"}
                        </Btn>
                    </div>
                </CyberCard>
            </div>
        </div>
    );
}
