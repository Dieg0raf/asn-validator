interface ASNInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ASNInput({ value, onChange }: ASNInputProps) {
  return (
    <div className="input-section">
      <label htmlFor="asn-input" className="input-label">
        ASN Data (JSON):
      </label>
      <textarea
        id="asn-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your ASN JSON data here..."
        className="asn-textarea"
        rows={15}
      />
    </div>
  );
}
