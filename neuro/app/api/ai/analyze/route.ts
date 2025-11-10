import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 60

const recommendationSchema = z.object({
  recommendations: z.array(
    z.object({
      type: z.enum(["daily_plan", "exercise", "strategy", "intervention"]),
      title: z.string().describe("Clear, actionable title for the recommendation"),
      description: z.string().describe("Detailed explanation of the recommendation"),
      rationale: z.string().describe("Why this is recommended based on the data patterns"),
      priority: z.enum(["high", "medium", "low"]),
    }),
  ),
  insights: z.object({
    behaviorPatterns: z.array(z.string()).describe("Key behavior patterns identified"),
    triggerAnalysis: z.string().describe("Analysis of common triggers"),
    progressSummary: z.string().describe("Summary of progress and positive trends"),
    areasOfConcern: z.array(z.string()).describe("Areas that need attention"),
  }),
})

export async function POST(req: Request) {
  try {
    const { childId } = await req.json()

    if (!childId) {
      return Response.json({ error: "Child ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch child data
    const { data: child } = await supabase
      .from("children")
      .select("*")
      .eq("id", childId)
      .eq("parent_id", user.id)
      .single()

    if (!child) {
      return Response.json({ error: "Child not found" }, { status: 404 })
    }

    // Fetch recent behavior logs (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: behaviorLogs } = await supabase
      .from("behavior_logs")
      .select("*")
      .eq("child_id", childId)
      .gte("log_date", thirtyDaysAgo.toISOString().split("T")[0])
      .order("log_date", { ascending: false })

    // Fetch recent activities (last 30 days)
    const { data: activities } = await supabase
      .from("activities")
      .select("*")
      .eq("child_id", childId)
      .gte("activity_date", thirtyDaysAgo.toISOString().split("T")[0])
      .order("activity_date", { ascending: false })

    // Create context for AI analysis
    const analysisContext = `
You are an expert pediatric therapist specializing in neurodevelopmental disorders. Analyze the following data for ${child.first_name} and provide personalized recommendations.

Child Information:
- Name: ${child.first_name}
- Age: ${calculateAge(child.date_of_birth)} years old
- Diagnosis: ${child.diagnosis || "Not specified"}
- Additional Notes: ${child.notes || "None"}

Recent Behavior Logs (${behaviorLogs?.length || 0} entries):
${
  behaviorLogs
    ?.map(
      (log) => `
Date: ${log.log_date}
Mood: ${log.mood}
Energy Level: ${log.energy_level}/5
Sleep Quality: ${log.sleep_quality}/5
Sleep Hours: ${log.sleep_hours || "N/A"}
Behaviors Observed: ${log.behaviors_observed?.join(", ") || "None"}
Triggers: ${log.triggers || "None"}
Successes: ${log.successes || "None"}
Challenges: ${log.challenges || "None"}
`,
    )
    .join("\n") || "No behavior logs available"
}

Recent Activities (${activities?.length || 0} entries):
${
  activities
    ?.map(
      (activity) => `
Date: ${activity.activity_date}
Type: ${activity.activity_type}
Name: ${activity.activity_name}
Duration: ${activity.duration_minutes || "N/A"} minutes
Difficulty: ${activity.difficulty_level}/5
Engagement: ${activity.child_engagement}/5
Status: ${activity.completion_status}
Notes: ${activity.notes || "None"}
`,
    )
    .join("\n") || "No activities available"
}

Based on this data:
1. Identify behavior patterns and trends
2. Analyze triggers and their impact
3. Recognize what activities work best
4. Provide 4-6 specific, actionable recommendations
5. Prioritize recommendations based on urgency and impact
6. Consider the child's age, diagnosis, and individual needs

Focus on practical, evidence-based strategies that parents can implement at home.
`

    // Generate AI recommendations
    const { object } = await generateObject({
      model: "openai/gpt-5",
      schema: recommendationSchema,
      prompt: analysisContext,
      maxOutputTokens: 3000,
    })

    // Save recommendations to database
    const recommendationsToInsert = object.recommendations.map((rec) => ({
      child_id: childId,
      parent_id: user.id,
      recommendation_date: new Date().toISOString().split("T")[0],
      recommendation_type: rec.type,
      title: rec.title,
      description: rec.description,
      rationale: rec.rationale,
      priority: rec.priority,
      status: "pending",
    }))

    const { error: insertError } = await supabase.from("ai_recommendations").insert(recommendationsToInsert)

    if (insertError) {
      console.error("[v0] Error saving recommendations:", insertError)
    }

    return Response.json({
      success: true,
      recommendations: object.recommendations,
      insights: object.insights,
    })
  } catch (error) {
    console.error("[v0] AI Analysis error:", error)
    return Response.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}
