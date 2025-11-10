import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, CheckCircle2, Clock, XCircle } from "lucide-react"
import Link from "next/link"
import GenerateRecommendationsButton from "@/components/generate-recommendations-button"

export default async function RecommendationsPage({ params }: { params: Promise<{ id: string }> }) {
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

  const { data: recommendations } = await supabase
    .from("ai_recommendations")
    .select("*")
    .eq("child_id", id)
    .order("created_at", { ascending: false })

  const pendingRecs = recommendations?.filter((r) => r.status === "pending") || []
  const completedRecs = recommendations?.filter((r) => r.status === "completed") || []
  const skippedRecs = recommendations?.filter((r) => r.status === "skipped") || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="mb-6">
          <Link href={`/dashboard/children/${id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Recommendations for {child.first_name}</h1>
          <p className="text-gray-600 mt-2">Personalized strategies based on behavior patterns and activity data</p>
        </div>

        <Card className="bg-white border-gray-200 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Generate New Insights
                </CardTitle>
                <CardDescription>Analyze recent data to get updated recommendations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <GenerateRecommendationsButton childId={id} variant="default" />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{pendingRecs.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{completedRecs.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-gray-600" />
                Skipped
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{skippedRecs.length}</div>
            </CardContent>
          </Card>
        </div>

        {pendingRecs.length > 0 && (
          <Card className="bg-white border-gray-200 mb-8">
            <CardHeader>
              <CardTitle>Pending Recommendations</CardTitle>
              <CardDescription>Review and implement these personalized strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRecs.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-6 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                          <Badge
                            variant={
                              rec.priority === "high"
                                ? "destructive"
                                : rec.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {rec.priority} priority
                          </Badge>
                          <Badge variant="outline">{rec.recommendation_type}</Badge>
                        </div>
                        <p className="text-gray-700 mb-3 leading-relaxed">{rec.description}</p>
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                          <p className="text-sm font-medium text-blue-900 mb-1">Why this recommendation:</p>
                          <p className="text-sm text-blue-800 leading-relaxed">{rec.rationale}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Mark Complete
                      </Button>
                      <Button size="sm" variant="outline">
                        Skip
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {completedRecs.length > 0 && (
          <Card className="bg-white border-gray-200 mb-8">
            <CardHeader>
              <CardTitle>Completed Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedRecs.map((rec) => (
                  <div key={rec.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{rec.description.substring(0, 150)}...</p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {recommendations && recommendations.length === 0 && (
          <Card className="bg-white border-gray-200">
            <CardContent className="py-12">
              <div className="text-center">
                <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No recommendations yet</h3>
                <p className="text-gray-600 mb-6">
                  Generate AI insights to get personalized strategies for {child.first_name}
                </p>
                <GenerateRecommendationsButton childId={id} variant="default" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
