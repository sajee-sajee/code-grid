import { useState } from "react";
import MatrixRain from "../components/MatrixRain";
import CyberCard from "../components/CyberCard";
import Btn from "../components/Btn";
import { useUser } from "../contexts/useUser";

export default function AuthPage({ mode, onNav, onSuccess }) {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [err, setErr] = useState("");
    const [shake, setShake] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login, register } = useUser();

    const submit = async () => {
        if (!email || !pass) { 
            setErr("FIELDS CANNOT BE EMPTY"); 
            setShake(true); 
            setTimeout(() => setShake(false), 400); 
            return; 
        }
        if (!email.toLowerCase().endsWith("@gmail.com")) { 
            setErr("MUST USE A @GMAIL.COM ADDRESS"); 
            setShake(true); 
            setTimeout(() => setShake(false), 400); 
            return; 
        }
        if (pass.length < 4) { 
            setErr("PASSWORD TOO SHORT"); 
            setShake(true); 
            setTimeout(() => setShake(false), 400); 
            return; 
        }
        setLoading(true);
        setErr("");
        try {
            const user = mode === "signup" ? await register(email, pass) : await login(email, pass);
            onSuccess(user, mode === "signup");
        } catch (e) {
            const msg = e.response?.data?.message || "CONNECTION FAILED";
            setErr(msg.toUpperCase());
            setShake(true);
            setTimeout(() => setShake(false), 400);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: 16 }}>
            <MatrixRain />
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 1 }} />
            {/* Ambient glows */}
            <div style={{ position: "absolute", width: 400, height: 400, background: "radial-gradient(circle, rgba(0, 229, 255, 0.05) 0%, transparent 70%)", zIndex: 1, top: "25%", left: "20%", pointerEvents: "none" }} />
            
            <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 460, animation: "fadeIn 0.5s ease" }}>
                <CyberCard style={{ padding: "48px 40px" }} color="var(--color-cyan)">
                    <h2 className="ORB gC" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.15em", marginBottom: 8, textAlign: "center", textShadow: "0 0 15px var(--color-cyan-glow)" }}>
                        {mode === "login" ? "TERMINAL ACCESS" : "RECRUIT ENLISTMENT"}
                    </h2>
                    <div className="MONO" style={{ fontSize: 11, color: "var(--color-text-muted)", textAlign: "center", marginBottom: 36, letterSpacing: "0.2em" }}>
                        {mode === "login" ? "AUTHENTICATE DECRYPT PROTOCOLS" : "ESTABLISH NEW OPERATIVE UPLINK"}
                    </div>
                    
                    <div className={shake ? "aShake" : ""} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div>
                            <label className="MONO" style={{ display: "block", fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 8, letterSpacing: "0.12em", fontWeight: 600 }}>
                                UPLINK_IDENTIFIER (EMAIL)
                            </label>
                            <input 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="name@network.net" 
                                onKeyDown={(e) => e.key === "Enter" && submit()} 
                                style={{ transition: "all 0.25s" }}
                            />
                        </div>
                        <div>
                            <label className="MONO" style={{ display: "block", fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 8, letterSpacing: "0.12em", fontWeight: 600 }}>
                                ACCESS_DECRYPT_KEY (PASSWORD)
                            </label>
                            <input 
                                type="password" 
                                value={pass} 
                                onChange={(e) => setPass(e.target.value)} 
                                placeholder="••••••••" 
                                onKeyDown={(e) => e.key === "Enter" && submit()} 
                                style={{ transition: "all 0.25s" }}
                            />
                        </div>
                        
                        {err && (
                            <div className="MONO gR" style={{ fontSize: 11, letterSpacing: "0.1em", background: "rgba(255, 45, 85, 0.08)", border: "1px solid rgba(255, 45, 85, 0.25)", padding: "10px 14px", borderRadius: 4, display: "flex", alignItems: "center", gap: 8 }}>
                                <span>⚠</span> {err}
                            </div>
                        )}
                        
                        <Btn 
                            variant="c" 
                            onClick={submit} 
                            disabled={loading} 
                            style={{ marginTop: 12, width: "100%", justifyContent: "center" }}
                        >
                            {loading ? "⏳ INITIATING UPLINK..." : mode === "login" ? "🔓 AUTHENTICATE" : "⚡ REGISTER CONSOLE"}
                        </Btn>
                    </div>
                    <div style={{ marginTop: 32, textAlign: "center", borderTop: "1px dashed rgba(0, 229, 255, 0.15)", paddingTop: 20 }}>
                        <span className="MONO" style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                            {mode === "login" ? "NEW RECRUIT? " : "ALREADY ASSIGNED? "}
                        </span>
                        <span 
                            className="MONO gC" 
                            style={{ fontSize: 12, cursor: "pointer", textDecoration: "none", fontWeight: 600, borderBottom: "1px solid var(--color-cyan)", paddingBottom: 1 }} 
                            onClick={() => { setErr(""); onNav(mode === "login" ? "signup" : "login"); }}
                        >
                            {mode === "login" ? "ENLIST HERE" : "CONNECT TERMINAL"}
                        </span>
                    </div>
                </CyberCard>
            </div>
        </div>
    );
}
