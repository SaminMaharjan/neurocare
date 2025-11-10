"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface BehaviorLog {
  log_date: string
  energy_level: number
  sleep_quality: number
}

interface BehaviorTrendsChartProps {
  data: BehaviorLog[]
}

export default function BehaviorTrendsChart({ data }: BehaviorTrendsChartProps) {
  const chartData = data.map((log) => ({
    date: new Date(log.log_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    energy: log.energy_level,
    sleep: log.sleep_quality,
  }))

  if (chartData.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} domain={[0, 5]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="energy"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Energy Level"
          dot={{ fill: "#3b82f6", r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="sleep"
          stroke="#22c55e"
          strokeWidth={2}
          name="Sleep Quality"
          dot={{ fill: "#22c55e", r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
