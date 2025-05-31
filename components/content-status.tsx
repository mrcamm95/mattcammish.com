"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, Eye } from "lucide-react"

interface ContentStatusProps {
  isContentful: boolean
  postsCount: number
  isPreview: boolean
}

export function ContentStatus({ isContentful, postsCount, isPreview }: ContentStatusProps) {
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    // Show status for a few seconds when component mounts
    setShowStatus(true)
    const timer = setTimeout(() => setShowStatus(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!showStatus) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
          isContentful
            ? isPreview
              ? "bg-amber-50 border border-amber-200 text-amber-800"
              : "bg-green-50 border border-green-200 text-green-800"
            : "bg-yellow-50 border border-yellow-200 text-yellow-800"
        }`}
      >
        {isContentful ? (
          isPreview ? (
            <Eye className="w-4 h-4" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )
        ) : (
          <AlertCircle className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {isContentful
            ? isPreview
              ? `👁️ Preview: ${postsCount} posts loaded`
              : `✅ Contentful: ${postsCount} posts loaded`
            : `⚠️ Fallback: ${postsCount} demo posts`}
        </span>
      </div>
    </div>
  )
}
