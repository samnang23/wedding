"use client"

import { useState, useEffect } from "react"
import { Trees, MessageSquare, Check, Send, User, Users, ChevronDown, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { WishData } from "@/types/wedding"

interface WishesSectionProps {
  wishName: string
  setWishName: (name: string) => void
  wishMessage: string
  setWishMessage: (message: string) => void
  wishGuests: string
  setWishGuests: (guests: string) => void
  isWishSubmitted: boolean
  handleWishSubmit: (e: React.FormEvent) => void
  isNameAutoFilled?: boolean // Whether name is auto-filled from invitation
  guestShortId?: string // Guest shortId to identify own wishes
}

export const WishesSection = ({
  wishName,
  setWishName,
  wishMessage,
  setWishMessage,
  wishGuests,
  setWishGuests,
  isWishSubmitted,
  handleWishSubmit,
  isNameAutoFilled = false,
  guestShortId
}: WishesSectionProps) => {
  const [wishes, setWishes] = useState<WishData[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [totalWishes, setTotalWishes] = useState(0)
  const [deletingWishId, setDeletingWishId] = useState<string | null>(null)

  // Fetch wishes from API
  useEffect(() => {
    const fetchWishes = async () => {
      try {
        setLoading(true)
        const limit = showAll ? 50 : 3 // Show 3 initially, 50 when "See More" is clicked
        const response = await fetch(`/api/wishes/public?limit=${limit}`)
        const data = await response.json()
        
        if (data.success) {
          setWishes(data.data)
          setTotalWishes(data.total || 0)
        }
      } catch (error) {
        console.error("Error fetching wishes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWishes()
  }, [showAll, isWishSubmitted]) // Refetch when wish is submitted

  // Format date
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return ""
    const d = typeof date === "string" ? new Date(date) : date
    return new Intl.DateTimeFormat("km-KH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d)
  }

  const displayedWishes = showAll ? wishes : wishes.slice(0, 3)
  const hasMoreWishes = totalWishes > 3 && !showAll

  // Handle guest deleting their own wish
  const handleDeleteOwnWish = async (wishId: string) => {
    if (!guestShortId) return

    if (!confirm("តើអ្នកពិតជាចង់លុបពាក្យជូនពរនេះមែនទេ?\nAre you sure you want to delete this wish?")) {
      return
    }

    setDeletingWishId(wishId)
    try {
      const response = await fetch(`/api/wishes/${wishId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestShortId }),
      })

      const data = await response.json()
      if (data.success) {
        // Remove wish from local state
        setWishes(wishes.filter(w => w._id !== wishId))
        setTotalWishes(totalWishes - 1)
      } else {
        alert(data.error || "Failed to delete wish")
      }
    } catch (error) {
      console.error("Error deleting wish:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setDeletingWishId(null)
    }
  }
  return (
    <section id="wishes" className="py-12 sm:py-16 relative w-full">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-center mb-8 sm:mb-12">
          <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
          <Trees className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-sway" />
          <h2 className="font-moul text-xl sm:text-2xl md:text-3xl text-center text-[#2c5e1a] forest-text-shadow">ពាក្យជូនពរ</h2>
          <Trees className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-sway" />
          <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Wish Form */}
          <div
            data-aos="fade-right"
            data-aos-duration="1200"
          >
            <Card className="p-4 sm:p-6 border-[#87b577]/30 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:shadow-xl">
              <h3 className="font-moul text-lg sm:text-xl mb-4 sm:mb-6 text-[#1a4810] flex items-center drop-shadow-sm hover:text-[#87b577] transition-colors">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-[#87b577] animate-bounce" />
                ផ្ញើពាក្យជូនពរ
              </h3>

              {isWishSubmitted ? (
                <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#e8f5e5] rounded-full flex items-center justify-center mb-3 sm:mb-4 animate-scaleIn hover:bg-[#87b577]/20 transition-colors">
                    <Check className="h-6 w-6 sm:h-8 sm:w-8 text-[#2c5e1a] animate-bounce" />
                  </div>
                  <h4 className="font-moul text-base sm:text-lg text-[#2c5e1a] mb-2 hover:text-[#87b577] transition-colors">អរគុណសម្រាប់ពាក្យជូនពរ!</h4>
                  <p className="font-moulpali text-sm sm:text-base text-center">ពាក្យជូនពររបស់អ្នកត្រូវបានផ្ញើទៅកាន់យើងខ្ញុំហើយ។</p>
                </div>
              ) : (
                <form onSubmit={handleWishSubmit} className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-moul hover:text-[#87b577] transition-colors">
                      ឈ្មោះ
                    </Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#87b577] group-hover:scale-110 transition-transform" />
                      <Input
                        id="name"
                        value={wishName}
                        onChange={(e) => setWishName(e.target.value)}
                        className="pl-10 bg-white/80 border-[#87b577]/30 focus:border-[#87b577] hover:border-[#87b577]/60 transition-colors"
                        placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
                        required
                        readOnly={isNameAutoFilled}
                        disabled={isNameAutoFilled}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="font-moul hover:text-[#87b577] transition-colors">
                      ពាក្យជូនពរ
                    </Label>
                    <Textarea
                      id="message"
                      value={wishMessage}
                      onChange={(e) => setWishMessage(e.target.value)}
                      className="bg-white/80 border-[#87b577]/30 focus:border-[#87b577] hover:border-[#87b577]/60 transition-colors min-h-[120px]"
                      placeholder="សរសេរពាក្យជូនពររបស់អ្នក..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guests" className="font-moul hover:text-[#87b577] transition-colors">
                      ចំនួនភ្ញៀវ
                    </Label>
                    <div className="relative group">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#87b577] group-hover:scale-110 transition-transform" />
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        value={wishGuests}
                        onChange={(e) => setWishGuests(e.target.value)}
                        className="pl-10 bg-white/80 border-[#87b577]/30 focus:border-[#87b577] hover:border-[#87b577]/60 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full forest-button mt-4 hover:scale-105 transform transition-all duration-300 hover:shadow-lg group text-sm sm:text-base lg:text-lg py-2 sm:py-3 lg:py-4"
                  >
                    <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                    <span className="font-moulpali">ផ្ញើពាក្យជូនពរ</span>
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* Wishes List */}
          <div
            data-aos="fade-left"
            data-aos-duration="1200"
          >
            <h3 className="font-moul text-xl mb-4 text-[#2c5e1a]">ពាក្យជូនពរពីភ្ញៀវ</h3>
            {loading ? (
              <div className="text-center py-8 text-[#2c3e1a]/50">
                <div className="inline-block w-6 h-6 border-2 border-[#2c5e1a] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-sm">កំពុងផ្ទុក...</p>
              </div>
            ) : wishes.length === 0 ? (
              <div className="text-center py-8 text-[#2c3e1a]/50">
                <p className="text-sm">មិនទាន់មានពាក្យជូនពរនៅឡើយ។</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedWishes.map((wish, index) => {
                  const isOwnWish = guestShortId && wish.guestShortId === guestShortId
                  return (
                    <Card
                      key={wish._id}
                      className="p-4 border-[#87b577]/30 bg-white/70 backdrop-blur-sm transition-all duration-500 hover:shadow-lg hover:scale-105 hover:border-[#87b577] relative"
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      {isOwnWish && (
                        <button
                          onClick={() => wish._id && handleDeleteOwnWish(wish._id)}
                          disabled={deletingWishId === wish._id}
                          className="absolute top-2 right-2 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                          title="Delete your wish"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      <p className="font-moulpali mb-2 hover:text-[#2c5e1a] transition-colors pr-8">{wish.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="font-moul text-sm text-[#2c5e1a] hover:text-[#87b577] transition-colors">{wish.name}</p>
                          <div className="flex items-center ml-3 text-[#87b577]/70 hover:text-[#87b577] transition-colors">
                            <Users className="h-3 w-3 mr-1" />
                            <span className="text-xs">{wish.guests}</span>
                          </div>
                        </div>
                        <p className="text-xs text-[#2c3e1a]/50 hover:text-[#2c3e1a] transition-colors">
                          {formatDate(wish.createdAt)}
                        </p>
                      </div>
                    </Card>
                  )
                })}
                
                {/* See More Button */}
                {hasMoreWishes && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowAll(true)}
                      className="border-[#87b577]/30 text-[#2c5e1a] hover:bg-[#87b577]/10 hover:border-[#87b577]"
                    >
                      <ChevronDown className="h-4 w-4 mr-2" />
                      <span className="font-moulpali">មើលទាំងអស់ ({totalWishes})</span>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

