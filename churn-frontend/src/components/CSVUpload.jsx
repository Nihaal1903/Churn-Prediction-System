import { useState } from "react";
import { api } from "../api";

export default function CSVUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadCSV = async () => {
    if (!file) return alert("Please select a CSV file");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await api.post("/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch {
      alert("CSV upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="csv-upload">
      <h2>📁 Batch Prediction (CSV Upload)</h2>

      {/* File Picker */}
      <div className="csv-input">
        <label className="csv-file-label">
          Select CSV File
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        <span className="csv-filename">
          {file ? file.name : "No file selected"}
        </span>
      </div>

      {/* Upload Button */}
      <button
        className={loading ? "loading" : ""}
        onClick={uploadCSV}
        disabled={loading}
      >
        {loading ? "Processing..." : "Upload & Predict"}
      </button>

      {/* Result Summary */}
      {result && (
        <div className="csv-result">
          <div className="kpi-card">
            <p>Rows Processed</p>
            <h4>{result.rows_processed}</h4>
          </div>

          <div className="kpi-card">
            <p>Avg Churn</p>
            <h4>{result.avg_churn_probability}</h4>
          </div>

          <div className="kpi-card">
            <p>High Risk</p>
            <h4>{result.high_risk}</h4>
          </div>

          <div className="kpi-card">
            <p>Low Risk</p>
            <h4>{result.low_risk}</h4>
          </div>
        </div>
      )}
    </div>
  );
}
