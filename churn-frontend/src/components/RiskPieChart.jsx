import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "../api";

const COLORS = ["#14b8a6", "#ef4444"]; // Low, High

export default function RiskPieChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/risk-distribution")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Pie chart error", err));
  }, []);

  if (data.length === 0) {
    return <p style={{ textAlign: "center" }}>No risk data yet</p>;
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="legend">
        <span className="low">● Low Risk</span>
        <span className="high">● High Risk</span>
      </div>
    </>
  );
}
