export default function Toggle({ label, value, onChange }) {
  return (
    <div className="toggle">
      <span>{label}</span>
      <button
        type="button"
        className={value ? "on" : ""}
        onClick={() => onChange(!value)}
      />
    </div>
  );
}
