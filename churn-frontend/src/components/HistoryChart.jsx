import { useEffect, useState } from "react";
import { api } from "../api";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function HistoryChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/history").then(res => setData(res.data));
  }, []);

  return (
    <div className="card">
      <h2>Prediction History</h2>

      <div style={{ overflowX: "auto" }}>
        <LineChart width={500} height={260} data={data}>
          <XAxis dataKey="id" />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <Line dataKey="churn_probability" stroke="#2563eb" />
        </LineChart>
      </div>
    </div>
  );
}
