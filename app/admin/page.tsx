"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Check,
  Users,
  Heart,
  ExternalLink,
  RefreshCw,
} from "lucide-react"
import type { Guest, WishData } from "@/types/wedding"

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [wishes, setWishes] = useState<WishData[]>([])
  const [loading, setLoading] = useState(true)
  const [wishesLoading, setWishesLoading] = useState(true)
  const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [guestName, setGuestName] = useState("")
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  // Fetch guests
  const fetchGuests = async () => {
    try {
      const response = await fetch("/api/guests")
      const data = await response.json()
      if (data.success) {
        setGuests(data.data)
      } else {
        toast.error("Failed to fetch guests")
      }
    } catch (error) {
      console.error("Error fetching guests:", error)
      toast.error("Failed to fetch guests")
    } finally {
      setLoading(false)
    }
  }

  // Fetch wishes
  const fetchWishes = async () => {
    try {
      const response = await fetch("/api/wishes")
      const data = await response.json()
      if (data.success) {
        setWishes(data.data)
      } else {
        toast.error("Failed to fetch wishes")
      }
    } catch (error) {
      console.error("Error fetching wishes:", error)
      toast.error("Failed to fetch wishes")
    } finally {
      setWishesLoading(false)
    }
  }

  useEffect(() => {
    fetchGuests()
    fetchWishes()
  }, [])

  // Create or update guest
  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!guestName.trim()) {
      toast.error("Please enter a guest name")
      return
    }

    try {
      if (isEditMode && editingGuest?._id) {
        // Update guest
        const response = await fetch(`/api/guests/${editingGuest._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: guestName.trim() }),
        })

        const data = await response.json()
        if (data.success) {
          toast.success("Guest updated successfully")
          fetchGuests()
          resetForm()
        } else {
          toast.error(data.error || "Failed to update guest")
        }
      } else {
        // Create guest
        const response = await fetch("/api/guests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: guestName.trim() }),
        })

        const data = await response.json()
        if (data.success) {
          toast.success("Guest created successfully")
          fetchGuests()
          resetForm()
        } else {
          toast.error(data.error || "Failed to create guest")
        }
      }
    } catch (error) {
      console.error("Error saving guest:", error)
      toast.error("Failed to save guest")
    }
  }

  // Delete guest
  const handleDeleteGuest = async (id: string) => {
    try {
      const response = await fetch(`/api/guests/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Guest deleted successfully")
        fetchGuests()
      } else {
        toast.error(data.error || "Failed to delete guest")
      }
    } catch (error) {
      console.error("Error deleting guest:", error)
      toast.error("Failed to delete guest")
    }
  }

  // Copy invitation URL
  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      toast.success("Invitation URL copied to clipboard!")
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (error) {
      console.error("Error copying URL:", error)
      toast.error("Failed to copy URL")
    }
  }

  // Reset form
  const resetForm = () => {
    setGuestName("")
    setIsEditMode(false)
    setEditingGuest(null)
    setIsGuestDialogOpen(false)
  }

  // Open edit dialog
  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest)
    setGuestName(guest.name)
    setIsEditMode(true)
    setIsGuestDialogOpen(true)
  }

  // Format date
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A"
    const d = typeof date === "string" ? new Date(date) : date
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faf6] to-[#e8f5e3] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2c5e1a] mb-2">Wedding Admin</h1>
            <p className="text-[#2c3e1a]/70">Manage guests and view wishes</p>
          </div>
          <Dialog open={isGuestDialogOpen} onOpenChange={setIsGuestDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm()
                  setIsGuestDialogOpen(true)
                }}
                className="bg-[#2c5e1a] hover:bg-[#4a7c2e] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Guest
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditMode ? "Edit Guest" : "Add New Guest"}</DialogTitle>
                <DialogDescription>
                  {isEditMode
                    ? "Update the guest information below."
                    : "Enter the name of the distinguished guest to generate an invitation URL."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleGuestSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Guest Name</Label>
                    <Input
                      id="name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Enter guest name"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm()
                      setIsGuestDialogOpen(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#2c5e1a] hover:bg-[#4a7c2e]">
                    {isEditMode ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="guests" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="guests" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Guests ({guests.length})
            </TabsTrigger>
            <TabsTrigger value="wishes" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Wishes ({wishes.length})
            </TabsTrigger>
          </TabsList>

          {/* Guests Tab */}
          <TabsContent value="guests" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Distinguished Guests</CardTitle>
                    <CardDescription>
                      Manage your guest list and generate invitation URLs
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchGuests}
                    disabled={loading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-[#2c3e1a]/50">
                    Loading guests...
                  </div>
                ) : guests.length === 0 ? (
                  <div className="text-center py-8 text-[#2c3e1a]/50">
                    No guests yet. Add your first guest to get started!
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Invitation URL</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {guests.map((guest) => (
                          <TableRow key={guest._id}>
                            <TableCell className="font-medium">{guest.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <a
                                  href={guest.invitationUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#2c5e1a] hover:underline text-sm truncate max-w-xs"
                                >
                                  {guest.invitationUrl}
                                </a>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopyUrl(guest.invitationUrl || "")}
                                  className="h-8 w-8 p-0"
                                >
                                  {copiedUrl === guest.invitationUrl ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-[#2c3e1a]/70">
                              {formatDate(guest.createdAt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditGuest(guest)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-red-600">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the guest and their invitation
                                        URL. This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => guest._id && handleDeleteGuest(guest._id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishes Tab */}
          <TabsContent value="wishes" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Guest Wishes</CardTitle>
                    <CardDescription>
                      View all wishes submitted by your guests
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchWishes}
                    disabled={wishesLoading}
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${wishesLoading ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {wishesLoading ? (
                  <div className="text-center py-8 text-[#2c3e1a]/50">Loading wishes...</div>
                ) : wishes.length === 0 ? (
                  <div className="text-center py-8 text-[#2c3e1a]/50">
                    No wishes yet. Wishes will appear here once guests submit them.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {wishes.map((wish) => (
                      <Card key={wish._id} className="border-[#87b577]/30">
                        <CardContent className="pt-6">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-[#2c5e1a]">{wish.name}</p>
                                {wish.guestName && (
                                  <p className="text-sm text-[#2c3e1a]/70 mt-1">
                                    From: {wish.guestName}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-[#2c3e1a]/70">
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {wish.guests}
                                </div>
                                <div>{formatDate(wish.createdAt)}</div>
                              </div>
                            </div>
                            <p className="text-[#2c3e1a] mt-2">{wish.message}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

