import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Activity, Calendar } from "lucide-react"
import Link from "next/link"
import BehaviorTrendsChart from "@/components/charts/behavior-trends-chart"
import ActivityEngagementChart from "@/components/charts/activity-engagement-chart"
import SleepQualityChart from "@/components/charts/sleep-quality-chart"
import MoodDistributionChart from "@/components/charts/mood-distribution-chart"

export default async function ProgressPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: children } = await supabase
    .from("children")
    .select("*")
    .eq("parent_id", user.id)
    .order("created_at", { ascending: false })

  if (!children || children.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto p-6 max-w-5xl">
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <Card className="bg-white border-gray-200">
            <CardContent className="py-12 text-center">
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No children added yet</h3>
              <p className="text-gray-600 mb-6">Add a child profile to start tracking progress</p>
              <Link href="/dashboard/children/new">
                <Button className="bg-blue-600 hover:bg-blue-700">Add Child Profile</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const selectedChildId = children[0].id

  // Fetch behavior logs for the last 60 days
  const sixtyDaysAgo = new Date()
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

  const { data: behaviorLogs } = await supabase
    .from("behavior_logs")
    .select("*")
    .eq("child_id", selectedChildId)
    .gte("log_date", sixtyDaysAgo.toISOString().split("T")[0])
    .order("log_date", { ascending: true })

  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .eq("child_id", selectedChildId)
    .gte("activity_date", sixtyDaysAgo.toISOString().split("T")[0])
    .order("activity_date", { ascending: true })

  // Calculate summary statistics
  const avgEnergyLevel = behaviorLogs?.length
    ? (behaviorLogs.reduce((sum, log) => sum + (log.energy_level || 0), 0) / behaviorLogs.length).toFixed(1)
    : "N/A"

  const avgSleepQuality = behaviorLogs?.length
    ? (behaviorLogs.reduce((sum, log) => sum + (log.sleep_quality || 0), 0) / behaviorLogs.length).toFixed(1)
    : "N/A"

  const avgEngagement = activities?.length
    ? (activities.reduce((sum, act) => sum + (act.child_engagement || 0), 0) / activities.length).toFixed(1)
    : "N/A"

  const completionRate = activities?.length
    ? ((activities.filter((a) => a.completion_status === "completed").length / activities.length) * 100).toFixed(0)
    : "0"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Progress & Insights</h1>
          <p className="text-gray-600 mt-2">Tracking development for {children[0].first_name}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-white border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Energy Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {avgEnergyLevel}
                <span className="text-lg text-gray-500">/5</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Last 60 days</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Sleep Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {avgSleepQuality}
                <span className="text-lg text-gray-500">/5</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Last 60 days</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {avgEngagement}
                <span className="text-lg text-gray-500">/5</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">In activities</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {completionRate}
                <span className="text-lg text-gray-500">%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Activities completed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Energy & Sleep Trends
              </CardTitle>
              <CardDescription>Daily energy levels and sleep quality over time</CardDescription>
            </CardHeader>
            <CardContent>
              <BehaviorTrendsChart data={behaviorLogs || []} />
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                Activity Engagement
              </CardTitle>
              <CardDescription>Child engagement levels across different activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityEngagementChart data={activities || []} />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Sleep Quality Distribution
              </CardTitle>
              <CardDescription>Sleep quality patterns over the last 60 days</CardDescription>
            </CardHeader>
            <CardContent>
              <SleepQualityChart data={behaviorLogs || []} />
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Mood Distribution</CardTitle>
              <CardDescription>Most common moods recorded</CardDescription>
            </CardHeader>
            <CardContent>
              <MoodDistributionChart data={behaviorLogs || []} />
            </CardContent>
          </Card>
        </div>

        {behaviorLogs && behaviorLogs.length === 0 && (
          <Card className="bg-white border-gray-200">
            <CardContent className="py-12 text-center">
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No data to visualize yet</h3>
              <p className="text-gray-600 mb-6">Start logging behaviors and activities to see progress charts</p>
              <div className="flex gap-3 justify-center">
                <Link href="/dashboard/logs/new">
                  <Button className="bg-green-600 hover:bg-green-700">Add Behavior Log</Button>
                </Link>
                <Link href="/dashboard/activities/new">
                  <Button className="bg-orange-600 hover:bg-orange-700">Record Activity</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
