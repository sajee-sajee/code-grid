import { useState } from "react";
import CyberCard from "../components/CyberCard";
import Btn from "../components/Btn";
import { useUser } from "../contexts/UserContext";

const FACES = ["🤖", "👾", "🦾", "💀", "🧠", "🦊", "🐉", "🌀", "⚡", "🔮"];
const OUTFITS = ["🥋", "🦺", "🧥", "👔", "🎭", "🛡️", "🔧"];
const ACCS = ["⚡", "🔋", "🎮", "📡", "💎", "🌐", "🔩", "⚙️"];

function PickRow({ label, items, sel, onSel }) {
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
                                width: 46, 
                                height: 46, 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                fontSize: 24, 
                                cursor: "pointer", 
                                border: active ? "1px solid var(--color-green)" : "1px solid rgba(255,255,255,0.08)", 
                                borderRadius: 4,
                                boxShadow: active ? "0 0 12px rgba(0, 255, 157, 0.3)" : "none", 
                                background: active ? "rgba(0, 255, 157, 0.1)" : "rgba(10, 13, 28, 0.6)", 
                                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                                transform: active ? "scale(1.05)" : "none"
                            }}
                            onMouseEnter={(e) => {
                                if(!active) e.currentTarget.style.borderColor = "var(--color-cyan)";
                            }}
                            onMouseLeave={(e) => {
                                if(!active) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                            }}
                        >
                            {item}
                        </div>
                    );
                })}
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
        if (username.trim().length < 3) { 
            setErr("Username must be at least 3 characters"); 
            return; 
        }
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
                        
                        <PickRow label="AVATAR CORE MODULE (FACE)" items={FACES} sel={face} onSel={setFace} />
                        <PickRow label="TACTICAL SUIT MODULE (OUTFIT)" items={OUTFITS} sel={outfit} onSel={setOutfit} />
                        <PickRow label="HARDWARE AUX CHIP (ACCESSORY)" items={ACCS} sel={acc} onSel={setAcc} />
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
                                fontSize: 80,
                                backdropFilter: "blur(8px)"
                            }}>
                                {FACES[face]}
                            </div>
                        </div>

                        <div className="ORB gG" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.15em", marginBottom: 12 }}>
                            {username || "RECRUIT_???"}
                        </div>
                        
                        <div style={{ display: "flex", gap: 16, background: "rgba(255,255,255,0.03)", padding: "10px 24px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 40 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 10, color: "var(--color-text-muted)" }}>SUIT:</span>
                                <span style={{ fontSize: 20 }}>{OUTFITS[outfit]}</span>
                            </div>
                            <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 10, color: "var(--color-text-muted)" }}>AUX:</span>
                                <span style={{ fontSize: 20 }}>{ACCS[acc]}</span>
                            </div>
                        </div>

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
