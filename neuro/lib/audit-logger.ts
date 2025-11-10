import { createClient } from "@/lib/supabase/server"

export async function logAudit(
  action: "view" | "create" | "update" | "delete",
  tableName: string,
  recordId?: string,
  request?: Request,
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const ipAddress = request?.headers.get("x-forwarded-for") || request?.headers.get("x-real-ip") || "unknown"
    const userAgent = request?.headers.get("user-agent") || "unknown"

    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action,
      table_name: tableName,
      record_id: recordId,
      ip_address: ipAddress,
      user_agent: userAgent,
    })
  } catch (error) {
    console.error("[v0] Audit logging failed:", error)
  }
}
