import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Pagi", value: 45 },
  { name: "Siang", value: 25 },
  { name: "Sore", value: 20 },
  { name: "Malam", value: 10 }
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function FokusTimePage() {
  return (
    <PieChart width={300} height={250}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={80}
        dataKey="value"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}
