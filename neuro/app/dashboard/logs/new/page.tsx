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
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, X } from "lucide-react"
import Link from "next/link"

export default function NewBehaviorLogPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [children, setChildren] = useState<any[]>([])
  const [behaviorInput, setBehaviorInput] = useState("")
  const [formData, setFormData] = useState({
    child_id: "",
    log_date: new Date().toISOString().split("T")[0],
    mood: "",
    energy_level: 3,
    sleep_quality: 3,
    sleep_hours: "",
    behaviors_observed: [] as string[],
    triggers: "",
    successes: "",
    challenges: "",
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

  const handleAddBehavior = () => {
    if (behaviorInput.trim()) {
      setFormData({
        ...formData,
        behaviors_observed: [...formData.behaviors_observed, behaviorInput.trim()],
      })
      setBehaviorInput("")
    }
  }

  const handleRemoveBehavior = (index: number) => {
    setFormData({
      ...formData,
      behaviors_observed: formData.behaviors_observed.filter((_, i) => i !== index),
    })
  }

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

      const { error: insertError } = await supabase.from("behavior_logs").insert({
        parent_id: user.id,
        child_id: formData.child_id,
        log_date: formData.log_date,
        mood: formData.mood,
        energy_level: formData.energy_level,
        sleep_quality: formData.sleep_quality,
        sleep_hours: formData.sleep_hours ? Number.parseFloat(formData.sleep_hours) : null,
        behaviors_observed: formData.behaviors_observed,
        triggers: formData.triggers || null,
        successes: formData.successes || null,
        challenges: formData.challenges || null,
        notes: formData.notes || null,
      })

      if (insertError) throw insertError

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create log")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 max-w-3xl">
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
            <CardTitle>Log Daily Behavior</CardTitle>
            <CardDescription>Record your child&apos;s behaviors, mood, and daily observations</CardDescription>
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
                <Label htmlFor="log_date">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="log_date"
                  type="date"
                  required
                  value={formData.log_date}
                  onChange={(e) => setFormData({ ...formData, log_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood">Mood</Label>
                <select
                  id="mood"
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Select mood...</option>
                  <option value="happy">Happy</option>
                  <option value="calm">Calm</option>
                  <option value="neutral">Neutral</option>
                  <option value="frustrated">Frustrated</option>
                  <option value="anxious">Anxious</option>
                  <option value="overwhelmed">Overwhelmed</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="energy_level">Energy Level (1-5)</Label>
                  <Input
                    id="energy_level"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.energy_level}
                    onChange={(e) => setFormData({ ...formData, energy_level: Number.parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sleep_quality">Sleep Quality (1-5)</Label>
                  <Input
                    id="sleep_quality"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.sleep_quality}
                    onChange={(e) => setFormData({ ...formData, sleep_quality: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sleep_hours">Hours of Sleep</Label>
                <Input
                  id="sleep_hours"
                  type="number"
                  step="0.5"
                  placeholder="e.g., 8.5"
                  value={formData.sleep_hours}
                  onChange={(e) => setFormData({ ...formData, sleep_hours: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Behaviors Observed</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add behavior tag..."
                    value={behaviorInput}
                    onChange={(e) => setBehaviorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddBehavior()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddBehavior}>
                    Add
                  </Button>
                </div>
                {formData.behaviors_observed.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.behaviors_observed.map((behavior, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {behavior}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveBehavior(index)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="successes">Successes & Positive Moments</Label>
                <Textarea
                  id="successes"
                  value={formData.successes}
                  onChange={(e) => setFormData({ ...formData, successes: e.target.value })}
                  placeholder="What went well today?"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenges">Challenges & Difficult Moments</Label>
                <Textarea
                  id="challenges"
                  value={formData.challenges}
                  onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                  placeholder="What was challenging today?"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="triggers">Triggers</Label>
                <Textarea
                  id="triggers"
                  value={formData.triggers}
                  onChange={(e) => setFormData({ ...formData, triggers: e.target.value })}
                  placeholder="What seemed to trigger behaviors?"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any other observations..."
                  rows={3}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Behavior Log"}
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
