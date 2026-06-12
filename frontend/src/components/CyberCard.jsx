export default function CyberCard({ children, className = "", style = {}, color = "var(--color-cyan)" }) {
    // Standardize hex/variable color formats for glassmorphic neon borders
    const formattedColor = color.startsWith("#") ? color : color;
    
    return (
        <div
            className={`bg-card clip-all ${className}`}
            style={{
                border: `1px solid ${formattedColor}40`,
                boxShadow: `0 0 20px ${formattedColor}15, inset 0 0 15px ${formattedColor}05`,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                background: "rgba(10, 13, 28, 0.7)",
                ...style,
            }}
        >
            {children}
        </div>
    );
}
