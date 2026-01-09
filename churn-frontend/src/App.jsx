import { useState } from "react";
import ChurnForm from "./components/ChurnForm";
import Dashboard from "./components/Dashboard";
import KPICards from "./components/KPICards";
import CSVUpload from "./components/CSVUpload";

export default function App() {
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState(null);
  const [batchStats, setBatchStats] = useState(null);

  const handlePrediction = (prediction, data) => {
    setResult(prediction);
    setFormData(data);
  };

  return (
    <div className="dashboard">
      {/* ================= MAIN GRID ================= */}
      <div className="content-grid">
        {/* LEFT: SINGLE CUSTOMER FORM */}
        <ChurnForm onResult={handlePrediction} />

        {/* RIGHT: CHARTS */}
        <Dashboard />
      </div>

      {/* ================= SINGLE PREDICTION KPI ================= */}
      {result && (
        <div className="kpi-section">
          <KPICards result={result} data={formData} />
        </div>
      )}

      {/* ================= CSV UPLOAD ================= */}
      <CSVUpload onBatchResult={setBatchStats} />

      {/* ================= BATCH KPIs ================= */}
      {batchStats && (
        <div className="kpi-grid">
          <div className="kpi-card">
            <p>Rows Processed</p>
            <h4>{batchStats.rows_processed}</h4>
          </div>

          <div className="kpi-card">
            <p>Avg Churn Probability</p>
            <h4>{batchStats.avg_churn_probability}</h4>
          </div>

          <div className="kpi-card">
            <p>High Risk</p>
            <h4>{batchStats.high_risk}</h4>
          </div>

          <div className="kpi-card">
            <p>Low Risk</p>
            <h4>{batchStats.low_risk}</h4>
          </div>
        </div>
      )}
    </div>
  );
}
