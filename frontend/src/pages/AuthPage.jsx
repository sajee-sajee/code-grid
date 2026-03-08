import { useState } from "react";
import MatrixRain from "../components/MatrixRain";
import CyberCard from "../components/CyberCard";
import Btn from "../components/Btn";
import { useUser } from "../contexts/UserContext";

export default function AuthPage({ mode, onNav, onSuccess }) {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [err, setErr] = useState("");
    const [shake, setShake] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login, register } = useUser();

    const submit = async () => {
        if (!email || !pass) { setErr("FIELDS CANNOT BE EMPTY"); setShake(true); setTimeout(() => setShake(false), 400); return; }
        if (pass.length < 4) { setErr("PASSWORD TOO SHORT"); setShake(true); setTimeout(() => setShake(false), 400); return; }
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
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <MatrixRain />
            <div className="bg-grid" style={{ position: "fixed", inset: 0, zIndex: 1 }} />
            <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 440, padding: 24 }}>
                <CyberCard style={{ padding: 40 }} color="#00d4ff">
                    <div className="ORB gC" style={{ fontSize: 22, fontWeight: 700, letterSpacing: ".15em", marginBottom: 4, textAlign: "center" }}>
                        {mode === "login" ? "TERMINAL ACCESS" : "RECRUIT REGISTRATION"}
                    </div>
                    <div className="MONO" style={{ fontSize: 12, color: "rgba(0,212,255,.4)", textAlign: "center", marginBottom: 32, letterSpacing: ".2em" }}>
                        {mode === "login" ? "AUTHENTICATE TO PROCEED" : "JOIN THE CODERS GUILD"}
                    </div>
                    <div className={shake ? "aShake" : ""} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <div className="MONO" style={{ fontSize: 11, color: "rgba(0,212,255,.5)", marginBottom: 6, letterSpacing: ".15em" }}>EMAIL_ADDRESS</div>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="coder@guild.net" onKeyDown={(e) => e.key === "Enter" && submit()} />
                        </div>
                        <div>
                            <div className="MONO" style={{ fontSize: 11, color: "rgba(0,212,255,.5)", marginBottom: 6, letterSpacing: ".15em" }}>ACCESS_CODE</div>
                            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && submit()} />
                        </div>
                        {err && <div className="MONO gR" style={{ fontSize: 12, letterSpacing: ".1em" }}>⚠ {err}</div>}
                        <Btn variant="g" onClick={submit} disabled={loading} style={{ marginTop: 8, width: "100%", justifyContent: "center" }}>
                            {loading ? "⏳ CONNECTING..." : mode === "login" ? "🔓 AUTHENTICATE" : "⚡ ENLIST"}
                        </Btn>
                    </div>
                    <div style={{ marginTop: 24, textAlign: "center" }}>
                        <span className="MONO" style={{ fontSize: 12, color: "rgba(160,180,200,.5)" }}>{mode === "login" ? "NEW RECRUIT? " : "ALREADY ENLISTED? "}</span>
                        <span className="MONO gC" style={{ fontSize: 12, cursor: "pointer", textDecoration: "underline" }} onClick={() => onNav(mode === "login" ? "signup" : "login")}>
                            {mode === "login" ? "REGISTER" : "LOGIN"}
                        </span>
                    </div>
                </CyberCard>
            </div>
        </div>
    );
}
