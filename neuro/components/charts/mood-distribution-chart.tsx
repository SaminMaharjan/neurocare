"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface BehaviorLog {
  mood: string
}

interface MoodDistributionChartProps {
  data: BehaviorLog[]
}

const MOOD_COLORS: Record<string, string> = {
  happy: "#22c55e",
  calm: "#3b82f6",
  neutral: "#94a3b8",
  frustrated: "#f59e0b",
  anxious: "#ef4444",
  overwhelmed: "#dc2626",
}

export default function MoodDistributionChart({ data }: MoodDistributionChartProps) {
  // Count mood occurrences
  const moodCounts = data.reduce(
    (acc, log) => {
      if (log.mood) {
        acc[log.mood] = (acc[log.mood] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(moodCounts).map(([mood, count]) => ({
    name: mood.charAt(0).toUpperCase() + mood.slice(1),
    value: count,
    color: MOOD_COLORS[mood] || "#94a3b8",
  }))

  if (chartData.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-500">No mood data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
