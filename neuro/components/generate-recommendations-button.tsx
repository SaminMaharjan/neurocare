"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface GenerateRecommendationsButtonProps {
  childId: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
}

export default function GenerateRecommendationsButton({
  childId,
  variant = "default",
}: GenerateRecommendationsButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate recommendations")
      }

      const data = await response.json()

      if (data.success) {
        router.refresh()
      } else {
        throw new Error(data.error || "Failed to generate recommendations")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div>
      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        variant={variant}
        className={variant === "default" ? "w-full bg-white text-purple-600 hover:bg-purple-50" : "w-full"}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Insights
          </>
        )}
      </Button>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  )
}
