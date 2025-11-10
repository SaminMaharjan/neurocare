"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Activity {
  activity_type: string
  child_engagement: number
}

interface ActivityEngagementChartProps {
  data: Activity[]
}

export default function ActivityEngagementChart({ data }: ActivityEngagementChartProps) {
  // Aggregate data by activity type
  const aggregated = data.reduce(
    (acc, activity) => {
      const type = activity.activity_type
      if (!acc[type]) {
        acc[type] = { total: 0, count: 0 }
      }
      acc[type].total += activity.child_engagement
      acc[type].count += 1
      return acc
    },
    {} as Record<string, { total: number; count: number }>,
  )

  const chartData = Object.entries(aggregated).map(([type, stats]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    engagement: Number.parseFloat((stats.total / stats.count).toFixed(1)),
  }))

  if (chartData.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="type" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} domain={[0, 5]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="engagement" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Avg Engagement" />
      </BarChart>
    </ResponsiveContainer>
  )
}
