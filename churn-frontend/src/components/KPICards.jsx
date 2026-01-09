export default function KPICards({ result, data }) {
  return (
    <div className="kpi-grid">
      <KPI title="Churn Probability" value={`${(result.churn_probability * 100).toFixed(1)}%`} />
      <KPI title="Risk Level" value={result.risk_level} />
      <KPI title="Monthly Charges" value={`$${data.MonthlyCharges}`} />
      <KPI title="Tenure" value={`${data.tenure} mo`} />
    </div>
  );
}

const KPI = ({ title, value }) => (
  <div className="kpi-card">
    <p>{title}</p>
    <h4>{value}</h4>
  </div>
);
