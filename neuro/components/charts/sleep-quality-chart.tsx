"use client"

import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface BehaviorLog {
  log_date: string
  sleep_quality: number
  sleep_hours: number | null
}

interface SleepQualityChartProps {
  data: BehaviorLog[]
}

export default function SleepQualityChart({ data }: SleepQualityChartProps) {
  const chartData = data
    .filter((log) => log.sleep_hours)
    .map((log) => ({
      date: new Date(log.log_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      quality: log.sleep_quality,
      hours: log.sleep_hours,
    }))

  if (chartData.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-500">No sleep data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
          </linearGradient>
        </defs>
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
        <Area
          type="monotone"
          dataKey="quality"
          stroke="#22c55e"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorQuality)"
          name="Sleep Quality"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
