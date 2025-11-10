import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Activity, Sparkles, TrendingUp } from "lucide-react"
import Link from "next/link"
import GenerateRecommendationsButton from "@/components/generate-recommendations-button"

export default async function ChildDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: child } = await supabase.from("children").select("*").eq("id", id).eq("parent_id", user.id).single()

  if (!child) {
    redirect("/dashboard")
  }

  // Fetch recent data
  const { data: recentLogs } = await supabase
    .from("behavior_logs")
    .select("*")
    .eq("child_id", id)
    .order("log_date", { ascending: false })
    .limit(10)

  const { data: recentActivities } = await supabase
    .from("activities")
    .select("*")
    .eq("child_id", id)
    .order("activity_date", { ascending: false })
    .limit(10)

  const { data: recommendations } = await supabase
    .from("ai_recommendations")
    .select("*")
    .eq("child_id", id)
    .order("created_at", { ascending: false })
    .limit(10)

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

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
          <h1 className="text-3xl font-bold text-gray-900">{child.first_name}&apos;s Profile</h1>
          <p className="text-gray-600 mt-2">
            Age {calculateAge(child.date_of_birth)} • {child.diagnosis || "No diagnosis recorded"}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium text-gray-900">{new Date(child.date_of_birth).toLocaleDateString()}</p>
              </div>
              {child.diagnosis && (
                <div>
                  <p className="text-sm text-gray-600">Diagnosis</p>
                  <p className="font-medium text-gray-900">{child.diagnosis}</p>
                </div>
              )}
              {child.diagnosis_date && (
                <div>
                  <p className="text-sm text-gray-600">Diagnosis Date</p>
                  <p className="font-medium text-gray-900">{new Date(child.diagnosis_date).toLocaleDateString()}</p>
                </div>
              )}
              {child.notes && (
                <div>
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="text-sm text-gray-900">{child.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Behavior Logs</span>
                <Badge variant="secondary">{recentLogs?.length || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Activities</span>
                <Badge variant="secondary">{recentActivities?.length || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Recommendations</span>
                <Badge variant="secondary">{recommendations?.length || 0}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Analysis
              </CardTitle>
              <CardDescription className="text-purple-100">Generate personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <GenerateRecommendationsButton childId={id} />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AI Recommendations</CardTitle>
                <Link href={`/dashboard/children/${id}/recommendations`}>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              <CardDescription>Personalized suggestions based on tracked data</CardDescription>
            </CardHeader>
            <CardContent>
              {recommendations && recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.slice(0, 5).map((rec) => (
                    <div key={rec.id} className="p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                        <Badge
                          variant={
                            rec.priority === "high"
                              ? "destructive"
                              : rec.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.description.substring(0, 100)}...</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {rec.recommendation_type}
                        </Badge>
                        <span className="text-xs text-gray-500">{new Date(rec.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No recommendations yet. Generate AI insights to get started.</p>
                  <GenerateRecommendationsButton childId={id} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Behavior Logs</CardTitle>
                <Link href="/dashboard/logs/new">
                  <Button variant="outline" size="sm">
                    Add Log
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentLogs && recentLogs.length > 0 ? (
                <div className="space-y-3">
                  {recentLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(log.log_date).toLocaleDateString()}
                        </span>
                        <Badge variant="secondary">{log.mood}</Badge>
                      </div>
                      <div className="flex gap-2 text-xs text-gray-600">
                        <span>Energy: {log.energy_level}/5</span>
                        <span>Sleep: {log.sleep_quality}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No behavior logs yet. Start tracking to get AI insights.</p>
                  <Link href="/dashboard/logs/new">
                    <Button className="bg-green-600 hover:bg-green-700">Add First Log</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activities</CardTitle>
              <Link href="/dashboard/activities/new">
                <Button variant="outline" size="sm">
                  Add Activity
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentActivities && recentActivities.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {recentActivities.slice(0, 6).map((activity) => (
                  <div key={activity.id} className="p-4 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{activity.activity_name}</h3>
                        <p className="text-sm text-gray-600">{new Date(activity.activity_date).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="outline">{activity.activity_type}</Badge>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-600">
                      <span>Engagement: {activity.child_engagement}/5</span>
                      <span>Difficulty: {activity.difficulty_level}/5</span>
                    </div>
                    <Badge variant="secondary" className="mt-2">
                      {activity.completion_status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No activities recorded yet.</p>
                <Link href="/dashboard/activities/new">
                  <Button className="bg-orange-600 hover:bg-orange-700">Add First Activity</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
