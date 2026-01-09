import PredictionHistory from "./PredictionHistory";
import RiskPieChart from "./RiskPieChart";

export default function Dashboard() {
  return (
    <div className="charts-panel">
      <div className="graph-card">
        <h3>Prediction History</h3>
        <PredictionHistory />
      </div>

      <div className="pie-card">
        <h3>Risk Distribution</h3>
        <RiskPieChart />
      </div>
    </div>
  );
}
