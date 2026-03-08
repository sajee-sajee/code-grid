export default function Btn({ children, variant = "c", size = "", onClick, disabled, style = {} }) {
    return (
        <button
            className={`btn btn-${variant}${size ? ` btn-${size}` : ""}`}
            onClick={onClick}
            disabled={disabled}
            style={{ opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer", ...style }}
        >
            {children}
        </button>
    );
}
