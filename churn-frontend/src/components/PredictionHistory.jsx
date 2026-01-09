import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "../api";

export default function PredictionHistory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/history")
      .then(res => {
        const formatted = res.data.map((d, i) => ({
          run: i + 1,
          prob: d.probability
        }));
        setData(formatted);
      });
  }, []);

  if (data.length === 0) return <p>No history yet</p>;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <XAxis dataKey="run" />
        <YAxis domain={[0, 1]} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="prob"
          stroke="#14b8a6"
          strokeWidth={3}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
