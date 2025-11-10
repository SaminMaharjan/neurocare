import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Activity, TrendingUp, Calendar, Heart, Settings } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: children } = await supabase
    .from("children")
    .select("*")
    .eq("parent_id", user.id)
    .order("created_at", { ascending: false })

  const { data: recentLogs, count: logsCount } = await supabase
    .from("behavior_logs")
    .select("*, children(first_name)", { count: "exact" })
    .eq("parent_id", user.id)
    .order("log_date", { ascending: false })
    .limit(5)

  const { data: recentActivities, count: activitiesCount } = await supabase
    .from("activities")
    .select("*, children(first_name)", { count: "exact" })
    .eq("parent_id", user.id)
    .order("activity_date", { ascending: false })
    .limit(5)

  const { data: recommendations, count: recommendationsCount } = await supabase
    .from("ai_recommendations")
    .select("*", { count: "exact" })
    .eq("parent_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.full_name}</h1>
            <p className="text-gray-600 mt-2">Manage your children&apos;s care and track their progress</p>
          </div>
          <Link href="/settings">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-blue-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Children</CardTitle>
              <Heart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{children?.length || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Profiles created</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Behavior Logs</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{logsCount || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Total entries</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Activities</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{activitiesCount || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Completed activities</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">AI Recommendations</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{recommendationsCount || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Pending suggestions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Children</CardTitle>
                  <CardDescription>Manage child profiles and view details</CardDescription>
                </div>
                <Link href="/dashboard/children/new">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Child
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {children && children.length > 0 ? (
                <div className="space-y-3">
                  {children.map((child) => (
                    <Link key={child.id} href={`/dashboard/children/${child.id}`} className="block">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                        <div>
                          <h3 className="font-semibold text-gray-900">{child.first_name}</h3>
                          <p className="text-sm text-gray-600">{child.diagnosis || "No diagnosis recorded"}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No children added yet. Start by adding your first child.</p>
                  <Link href="/dashboard/children/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Child
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Log data and track progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/dashboard/logs/new">
                  <Button className="w-full bg-green-600 hover:bg-green-700 justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    Log Behavior Today
                  </Button>
                </Link>
                <Link href="/dashboard/activities/new">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Record Activity
                  </Button>
                </Link>
                <Link href="/dashboard/progress">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Progress
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {recentLogs && recentLogs.length > 0 && (
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Behavior Logs</CardTitle>
                  <CardDescription>Latest recorded behaviors</CardDescription>
                </div>
                <Link href="/dashboard/logs">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLogs.map((log: any) => (
                  <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">{log.children?.first_name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(log.log_date).toLocaleDateString()} - Mood: {log.mood}
                      </p>
                    </div>
                    <Link href={`/dashboard/logs/${log.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
