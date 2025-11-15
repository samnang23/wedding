"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import WeddingContent from "@/app/WeddingContent"

export default function InvitationPage() {
  const params = useParams()
  const router = useRouter()
  const [guestName, setGuestName] = useState<string | null>(null)
  const [guestShortId, setGuestShortId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGuest = async () => {
      try {
        const id = params.id as string
        if (!id) {
          setError("Invalid invitation ID")
          setLoading(false)
          return
        }

        const response = await fetch(`/api/invitation/${id}`)
        const data = await response.json()

        if (data.success && data.data) {
          setGuestName(data.data.name)
          setGuestShortId(data.data.shortId)
        } else {
          setError(data.error || "Invitation not found")
        }
      } catch (err: any) {
        setError("Failed to load invitation")
        console.error("Error fetching invitation:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchGuest()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f8faf6]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2c5e1a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2c5e1a] font-moulpali">កំពុងផ្ទុក...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f8faf6]">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-[#2c5e1a] mb-4">Invitation Not Found</h1>
          <p className="text-[#2c3e1a] mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-[#2c5e1a] text-white rounded-lg hover:bg-[#4a7c2e] transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  // Pass guest name and shortId to WeddingContent
  return (
    <WeddingContent 
      guestNameFromInvitation={guestName || undefined}
      guestShortIdFromInvitation={guestShortId || undefined}
    />
  )
}

