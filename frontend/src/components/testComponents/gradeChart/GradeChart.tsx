import { PieChart, Pie, ResponsiveContainer } from "recharts";
import styles from "./GradeChart.module.css";

interface GradeChartProps {
  correctAnswers: number;
  totalQuestions: number;
}

function GradeChart({ correctAnswers, totalQuestions }: GradeChartProps) {
  const data = [
    { name: "Correct", value: correctAnswers, fill: "var(--success)" },
    {
      name: "Incorrect",
      value: totalQuestions - correctAnswers,
      fill: "var(--error)",
    },
  ];

  return (
    <div className={styles.gradeChartContainer}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={80}
            stroke="none"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GradeChart;
