import { SUPPORTED_LANGUAGES } from "../utils/languageSupport.js";

export default function LanguagePicker({ value, onChange }) {
    return (
        <select value={value} onChange={(event) => onChange(event.target.value)} style={{ width: 150 }}>
            {SUPPORTED_LANGUAGES.map((language) => (
                <option key={language.id} value={language.id}>
                    {language.label}
                </option>
            ))}
        </select>
    );
}
