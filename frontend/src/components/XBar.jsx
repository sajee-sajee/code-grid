export default function XBar({ val, max, color = "var(--color-cyan)", label = "" }) {
    const pct = Math.min(100, (val / max) * 100);
    
    return (
        <div style={{ width: "100%", marginTop: 8 }}>
            {label && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11, fontFamily: "var(--font-title)", color: "var(--color-text-secondary)", fontWeight: 500 }}>
                    <span>{label}</span>
                    <span style={{ color, textShadow: `0 0 8px ${color}55` }}>{val} / {max} XP</span>
                </div>
            )}
            <div style={{ 
                height: 8, 
                background: "rgba(255, 255, 255, 0.05)", 
                position: "relative",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: 1,
                clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))"
            }}>
                <div 
                    style={{ 
                        width: `${pct}%`, 
                        height: "100%", 
                        background: `linear-gradient(90deg, ${color}99, ${color})`, 
                        boxShadow: `0 0 10px ${color}88`, 
                        transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                        clipPath: "polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px))"
                    }} 
                />
            </div>
        </div>
    );
}
