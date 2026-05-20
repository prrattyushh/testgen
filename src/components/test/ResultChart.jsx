// src/components/test/ResultChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ResultChart({ topicBreakdown }) {
  const data = Object.entries(topicBreakdown || {}).map(([topic, stats]) => ({
    topic,
    correct: stats.correct,
    total: stats.total,
    pct: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
  }));

  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
        <XAxis dataKey="topic" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
        <Tooltip
          formatter={(value) => [`${value}%`, 'Score']}
          contentStyle={{ borderRadius: 4, fontSize: 13 }}
        />
        <Bar dataKey="pct" radius={[2, 2, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.pct >= 60 ? '#10b981' : '#ef4444'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
