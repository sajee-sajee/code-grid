import { useState } from "react";
import CyberCard from "./CyberCard";
import Btn from "./Btn";
import { useUser } from "../contexts/useUser";

const FACES = ["🤖", "👾", "🦾", "💀", "🧠", "🦊", "🐉", "🌀", "⚡", "🔮"];
const OUTFITS = ["🥋", "🦺", "🧥", "👔", "🎭", "🛡️", "🔧"];
const ACCS = ["⚡", "🔋", "🎮", "📡", "💎", "🌐", "🔩", "⚙️"];

function PickRow({ label, items, sel, onSel }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <div className="MONO" style={{ fontSize: 11, color: "rgba(0,212,255,.5)", marginBottom: 8, letterSpacing: ".15em" }}>{label}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", maxHeight: 96, overflowY: "auto" }}>
                {items.map((item, i) => (
                    <div key={i} onClick={() => onSel(i)} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, cursor: "pointer", border: sel === i ? "1px solid #00d4ff" : "1px solid rgba(255,255,255,.1)", boxShadow: sel === i ? "0 0 10px rgba(0,212,255,.4)" : "none", background: sel === i ? "rgba(0,212,255,.1)" : "rgba(0,8,18,.9)", transition: "all .2s" }}>
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ProfileModal({ user, onClose }) {
    const { saveProfile } = useUser();
    
    const [username, setUsername] = useState(user?.username || "");
    const [face, setFace] = useState(() => Math.max(0, FACES.indexOf(user?.avatar?.face)));
    const [outfit, setOutfit] = useState(() => Math.max(0, OUTFITS.indexOf(user?.avatar?.outfit)));
    const [acc, setAcc] = useState(() => Math.max(0, ACCS.indexOf(user?.avatar?.acc)));
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (username.trim().length < 3) { setErr("Username must be at least 3 characters."); return; }
        setLoading(true);
        try {
            const avatar = { face: FACES[face], outfit: OUTFITS[outfit], acc: ACCS[acc] };
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
                            <div className="MONO" style={{ fontSize: 11, color: "rgba(0,212,255,.5)", marginBottom: 8, letterSpacing: ".15em" }}>CODENAME</div>
                            <input className="cyber-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter codename..." />
                            {err && <div className="MONO gR" style={{ fontSize: 11, marginTop: 8 }}>⚠ {err}</div>}
                            
                            <div style={{ marginTop: 24 }}>
                                <PickRow label="AVATAR_FACE" items={FACES} sel={face} onSel={setFace} />
                                <PickRow label="OUTFIT_MODULE" items={OUTFITS} sel={outfit} onSel={setOutfit} />
                                <PickRow label="ACCESSORY_CHIP" items={ACCS} sel={acc} onSel={setAcc} />
                            </div>
                        </div>
                        
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 12 }}>
                            <div className="aPulseC" style={{ width: 150, height: 150, borderRadius: "50%", background: "rgba(0,15,30,.9)", border: "2px solid #00d4ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, marginBottom: 24 }}>
                                {FACES[face]}
                            </div>
                            <div className="ORB gC" style={{ fontSize: 18, fontWeight: 700, letterSpacing: ".1em", textAlign: "center", marginBottom: 12, wordBreak: "break-all" }}>{username || "RECRUIT_???"}</div>
                            <div style={{ display: "flex", gap: 12 }}><span style={{ fontSize: 24 }}>{OUTFITS[outfit]}</span><span style={{ fontSize: 24 }}>{ACCS[acc]}</span></div>
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, paddingTop: 24, borderTop: "1px solid rgba(0,212,255,0.2)" }}>
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
