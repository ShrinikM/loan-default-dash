import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RiskGaugeProps {
  pdScore?: number | string;
}

function getColor(pdScore: number): string {
  if (pdScore < 0.4) return '#16a34a';
  if (pdScore <= 0.65) return '#d97706';
  return '#dc2626';
}

export default function RiskGauge({ pdScore }: RiskGaugeProps) {
  const value = Math.min(1, Math.max(0, Number(pdScore) ?? 0));
  const pct = (value * 100).toFixed(1);
  const color = getColor(value);
  const filled = Math.round(value * 100);
  const data = [
    { name: 'PD', value: filled },
    { name: 'Remaining', value: Math.max(0, 100 - filled) },
  ];

  return (
    <div className="border border-slate-200 bg-white p-6">
      <div className="relative flex flex-col items-center">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              paddingAngle={0}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={index === 0 ? color : '#f1f5f9'}
                  stroke="none"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div
          className="absolute left-1/2 top-1/2 flex flex-col items-center"
          style={{
            transform: 'translate(-50%, -50%)',
            marginTop: -4,
          }}
        >
          <span
            className="text-2xl font-bold"
            style={{ color }}
          >
            {pct}%
          </span>
          <span className="text-xs text-slate-400">PD Score</span>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-slate-500">
        Probability of Default
      </p>
    </div>
  );
}
