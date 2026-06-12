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
        <div style={{ marginBottom: 24 }}>
            <div className="MONO" style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 10, letterSpacing: "0.15em", fontWeight: 600 }}>{label}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {items.map((item, i) => {
                    const active = sel === i;
                    return (
                        <div 
                            key={i} 
                            onClick={() => onSel(i)} 
                            style={{ 
                                width: 50, 
                                height: 50, 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                cursor: "pointer", 
                                border: active ? "1px solid var(--color-green)" : "1px solid rgba(255,255,255,0.08)", 
                                borderRadius: 4,
                                boxShadow: active ? "0 0 12px rgba(0, 255, 157, 0.3)" : "none", 
                                background: active ? "rgba(0, 255, 157, 0.1)" : "rgba(10, 13, 28, 0.6)", 
                                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                                transform: active ? "scale(1.05)" : "none",
                                overflow: "hidden"
                            }}
                            onMouseEnter={(e) => {
                                if(!active) e.currentTarget.style.borderColor = "var(--color-cyan)";
                            }}
                            onMouseLeave={(e) => {
                                if(!active) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                            }}
                        >
                            <img src={item} alt={`${label} ${i}`} style={{ width: "100%", height: "100%", objectFit: "contain", transformOrigin: origin, transform: transform }} />
                        </div>
                    );
                })}
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
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
            
            {/* Ambient glows */}
            <div style={{ position: "absolute", width: 500, height: 500, background: "radial-gradient(circle, rgba(0, 255, 157, 0.04) 0%, transparent 70%)", zIndex: 1, pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 880 }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <h2 className="ORB gG" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "0.2em", marginBottom: 8, textShadow: "0 0 15px var(--color-green-glow)" }}>
                        IDENTITY SETUP
                    </h2>
                    <div className="MONO" style={{ fontSize: 12, color: "var(--color-text-muted)", letterSpacing: "0.25em" }}>
                        CONFIGURE & DEPLOY OPERATIVE PROFILE MODULE
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
                    
                    {/* Setup Config Fields */}
                    <CyberCard style={{ padding: 32 }} color="var(--color-cyan)">
                        <div style={{ marginBottom: 24 }}>
                            <label className="MONO" style={{ display: "block", fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 8, letterSpacing: "0.15em", fontWeight: 600 }}>
                                OPERATIVE CODENAME
                            </label>
                            <input 
                                value={username} 
                                onChange={(e) => { setUsername(e.target.value); setErr(""); }} 
                                placeholder="Enter your hacker codename..." 
                                maxLength={16}
                            />
                            {err && (
                                <div className="MONO gR" style={{ fontSize: 11, marginTop: 8, background: "rgba(255, 45, 85, 0.05)", border: "1px solid rgba(255, 45, 85, 0.2)", padding: "8px 12px", borderRadius: 4 }}>
                                    ⚠ {err}
                                </div>
                            )}
                        </div>
                        
                        <PickRow label="HEAD_UNIT" items={HEADS} sel={head} onSel={setHead} />
                        <PickRow label="BODY_CHASSIS" items={BODIES} sel={body} onSel={setBody} />
                        <PickRow label="LOCOMOTION_BASE" items={FEET} sel={foot} onSel={setFoot} />
                    </CyberCard>

                    {/* Preview Mainframe Display */}
                    <CyberCard style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }} color="var(--color-green)">
                        <div className="MONO" style={{ fontSize: 10, color: "var(--color-text-muted)", letterSpacing: "0.2em", marginBottom: 32 }}>
                            LIVE PROFILE SYNC READOUT
                        </div>
                        
                        <div className="aFloat" style={{ position: "relative", marginBottom: 32 }}>
                            {/* Outer spinning ring decoration */}
                            <div style={{ position: "absolute", inset: -18, border: "1px dashed var(--color-green)", borderRadius: "50%", opacity: 0.35, animation: "spin 18s linear infinite" }} />
                            
                            <div style={{ 
                                width: 170, 
                                height: 170, 
                                borderRadius: "50%", 
                                background: "rgba(14, 18, 38, 0.9)", 
                                border: "2px solid var(--color-green)", 
                                boxShadow: "0 0 35px var(--color-green-glow), inset 0 0 20px rgba(0, 255, 157, 0.2)", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                backdropFilter: "blur(8px)",
                                overflow: "hidden"
                            }}>
                                <AvatarView avatar={{ head: HEADS[head], body: BODIES[body], foot: FEET[foot] }} size={130} />
                            </div>
                        </div>

                        <div className="ORB gG" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.15em", marginBottom: 12 }}>
                            {username || "RECRUIT_???"}
                        </div>
                        
                        <div style={{ height: 40 }} />

                        <Btn 
                            variant="g" 
                            size="lg" 
                            onClick={submit} 
                            disabled={loading}
                            style={{ width: "100%", justifyContent: "center" }}
                        >
                            {loading ? "⏳ SYNCING CONFIG..." : "⚡ DEPLOY CONSOLE PROFILE"}
                        </Btn>
                    </CyberCard>
                </div>
            </div>
        </div>
    );
}
