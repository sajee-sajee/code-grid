export default function CyberCard({ children, className = "", style = {}, color = "#00d4ff" }) {
    return (
        <div
            className={`bg-card clip-all ${className}`}
            style={{
                border: `1px solid ${color}33`,
                boxShadow: `0 0 12px ${color}18, inset 0 0 12px ${color}06`,
                ...style,
            }}
        >
            {children}
        </div>
    );
}
