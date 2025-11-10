"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewActivityPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [children, setChildren] = useState<any[]>([])
  const [formData, setFormData] = useState({
    child_id: "",
    activity_date: new Date().toISOString().split("T")[0],
    activity_type: "",
    activity_name: "",
    duration_minutes: "",
    difficulty_level: 3,
    child_engagement: 3,
    completion_status: "",
    notes: "",
  })

  useEffect(() => {
    const fetchChildren = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase.from("children").select("*").eq("parent_id", user.id).order("first_name")

      if (data) setChildren(data)
    }

    fetchChildren()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error: insertError } = await supabase.from("activities").insert({
        parent_id: user.id,
        child_id: formData.child_id,
        activity_date: formData.activity_date,
        activity_type: formData.activity_type,
        activity_name: formData.activity_name,
        duration_minutes: formData.duration_minutes ? Number.parseInt(formData.duration_minutes) : null,
        difficulty_level: formData.difficulty_level,
        child_engagement: formData.child_engagement,
        completion_status: formData.completion_status,
        notes: formData.notes || null,
      })

      if (insertError) throw insertError

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record activity")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Record Activity</CardTitle>
            <CardDescription>Track therapy sessions, exercises, and learning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="child_id">
                  Select Child <span className="text-red-500">*</span>
                </Label>
                <select
                  id="child_id"
                  required
                  value={formData.child_id}
                  onChange={(e) => setFormData({ ...formData, child_id: e.target.value })}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Choose a child...</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.first_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity_date">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="activity_date"
                  type="date"
                  required
                  value={formData.activity_date}
                  onChange={(e) => setFormData({ ...formData, activity_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity_type">
                  Activity Type <span className="text-red-500">*</span>
                </Label>
                <select
                  id="activity_type"
                  required
                  value={formData.activity_type}
                  onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Select type...</option>
                  <option value="therapy">Therapy Session</option>
                  <option value="exercise">Physical Exercise</option>
                  <option value="learning">Learning Activity</option>
                  <option value="routine">Daily Routine</option>
                  <option value="sensory">Sensory Activity</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity_name">
                  Activity Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="activity_name"
                  required
                  value={formData.activity_name}
                  onChange={(e) => setFormData({ ...formData, activity_name: e.target.value })}
                  placeholder="e.g., Speech therapy, Playing with blocks"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                  placeholder="e.g., 30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty_level">Difficulty Level (1-5)</Label>
                  <Input
                    id="difficulty_level"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.difficulty_level}
                    onChange={(e) => setFormData({ ...formData, difficulty_level: Number.parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-gray-500">1=Very Easy, 5=Very Hard</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="child_engagement">Child Engagement (1-5)</Label>
                  <Input
                    id="child_engagement"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.child_engagement}
                    onChange={(e) => setFormData({ ...formData, child_engagement: Number.parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-gray-500">1=Not Engaged, 5=Highly Engaged</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="completion_status">
                  Completion Status <span className="text-red-500">*</span>
                </Label>
                <select
                  id="completion_status"
                  required
                  value={formData.completion_status}
                  onChange={(e) => setFormData({ ...formData, completion_status: e.target.value })}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Select status...</option>
                  <option value="completed">Completed</option>
                  <option value="partial">Partially Completed</option>
                  <option value="skipped">Skipped</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="How did it go? Any observations?"
                  rows={4}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Activity"}
                </Button>
                <Link href="/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full bg-transparent" disabled={isLoading}>
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
