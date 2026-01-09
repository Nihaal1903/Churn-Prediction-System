export default function ResultCard({ result, data }) {
  const reasons = [];
  if (data.Contract === "Month-to-month") reasons.push("short-term contract");
  if (data.tenure < 12) reasons.push("low tenure");
  if (data.MonthlyCharges > 80) reasons.push("high monthly charges");

  return (
    <div className="result-box">
      <div className="probability">
        {(result.churn_probability * 100).toFixed(1)}%
      </div>

      <span className={`risk-badge ${result.risk_level.toLowerCase()}`}>
        {result.risk_level} Risk
      </span>

      <p className="explain">
        Likely due to {reasons.join(", ") || "stable customer behavior"}.
      </p>
    </div>
  );
}
