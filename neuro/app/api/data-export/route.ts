import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch all user data for HIPAA data portability requirement
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    const { data: children } = await supabase.from("children").select("*").eq("parent_id", user.id)

    const { data: behaviorLogs } = await supabase.from("behavior_logs").select("*").eq("parent_id", user.id)

    const { data: activities } = await supabase.from("activities").select("*").eq("parent_id", user.id)

    const { data: recommendations } = await supabase.from("ai_recommendations").select("*").eq("parent_id", user.id)

    const { data: progressMetrics } = await supabase.from("progress_metrics").select("*").eq("parent_id", user.id)

    const exportData = {
      exportDate: new Date().toISOString(),
      profile,
      children,
      behaviorLogs,
      activities,
      recommendations,
      progressMetrics,
      metadata: {
        format: "JSON",
        version: "1.0",
        compliance: "HIPAA Data Portability",
      },
    }

    const fileName = `samd-care-export-${new Date().toISOString().split("T")[0]}.json`

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error("[v0] Data export error:", error)
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}
