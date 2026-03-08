export default function XBar({ val, max, color = "#00ff41", label = "" }) {
    const pct = Math.min(100, (val / max) * 100);
    return (
        <div>
            {label && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11, fontFamily: "Orbitron,monospace", color: "rgba(200,200,200,.6)" }}>
                    <span>{label}</span>
                    <span style={{ color }}>{val}/{max}</span>
                </div>
            )}
            <div style={{ height: 6, background: "rgba(255,255,255,.08)", position: "relative" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${color},${color}88)`, boxShadow: `0 0 8px ${color}`, transition: "width .5s ease" }} />
            </div>
        </div>
    );
}
