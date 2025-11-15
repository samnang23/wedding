"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  RefreshCw,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Share2,
  MessageCircle,
  Send,
} from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination"
import type { Guest, WishData } from "@/types/wedding"
import { encode } from "punycode"

export default function AdminPage() {
  const router = useRouter()
  const [guests, setGuests] = useState<Guest[]>([])
  const [wishes, setWishes] = useState<WishData[]>([])
  const [loading, setLoading] = useState(true)
  const [wishesLoading, setWishesLoading] = useState(true)
  const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [guestName, setGuestName] = useState("")
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedGuestForShare, setSelectedGuestForShare] = useState<Guest | null>(null)
  const [copiedTemplate, setCopiedTemplate] = useState(false)
  const [invitationTemplate, setInvitationTemplate] = useState<string>("")
  const [isEditingTemplate, setIsEditingTemplate] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalGuests, setTotalGuests] = useState(0)
  const [pageSize] = useState(10) // Items per page
  
  // Bulk selection for wishes
  const [selectedWishes, setSelectedWishes] = useState<Set<string>>(new Set())

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session")
        const data = await response.json()
        if (data.authenticated) {
          setAuthenticated(true)
          setUsername(data.username)
        } else {
          setAuthenticated(false)
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setAuthenticated(false)
        router.push("/admin/login")
      }
    }
    checkAuth()
  }, [router])

  // Fetch guests with pagination
  const fetchGuests = async (page: number = currentPage) => {
    setLoading(true)
    try {
      const skip = (page - 1) * pageSize
      const response = await fetch(`/api/guests?limit=${pageSize}&skip=${skip}`)
      const data = await response.json()
      if (data.success) {
        setGuests(data.data)
        setTotalGuests(data.total || 0)
        setCurrentPage(page)
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

  // Delete wish
  const handleDeleteWish = async (id: string) => {
    try {
      const response = await fetch(`/api/wishes/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Wish deleted successfully")
        fetchWishes()
      } else {
        toast.error(data.error || "Failed to delete wish")
      }
    } catch (error) {
      console.error("Error deleting wish:", error)
      toast.error("Failed to delete wish")
    }
  }

  // Toggle wish visibility (hide/show)
  const handleToggleWishVisibility = async (id: string, currentHidden: boolean) => {
    try {
      const response = await fetch(`/api/wishes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !currentHidden }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(currentHidden ? "Wish is now visible" : "Wish is now hidden")
        fetchWishes()
      } else {
        toast.error(data.error || "Failed to update wish")
      }
    } catch (error) {
      console.error("Error updating wish:", error)
      toast.error("Failed to update wish")
    }
  }

  // Bulk actions
  const handleSelectAllWishes = () => {
    if (selectedWishes.size === wishes.length) {
      setSelectedWishes(new Set())
    } else {
      setSelectedWishes(new Set(wishes.map(w => w._id!).filter(Boolean)))
    }
  }

  const handleToggleWishSelection = (id: string) => {
    const newSelected = new Set(selectedWishes)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedWishes(newSelected)
  }

  const handleBulkDelete = async () => {
    if (selectedWishes.size === 0) return

    try {
      const response = await fetch("/api/wishes/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedWishes) }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(`${selectedWishes.size} wish(es) deleted successfully`)
        setSelectedWishes(new Set())
        fetchWishes()
      } else {
        toast.error(data.error || "Failed to delete wishes")
      }
    } catch (error) {
      console.error("Error deleting wishes:", error)
      toast.error("Failed to delete wishes")
    }
  }

  const handleBulkToggleVisibility = async (hide: boolean) => {
    if (selectedWishes.size === 0) return

    try {
      const response = await fetch("/api/wishes/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedWishes), isHidden: hide }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(`${selectedWishes.size} wish(es) ${hide ? 'hidden' : 'shown'} successfully`)
        setSelectedWishes(new Set())
        fetchWishes()
      } else {
        toast.error(data.error || "Failed to update wishes")
      }
    } catch (error) {
      console.error("Error updating wishes:", error)
      toast.error("Failed to update wishes")
    }
  }

  useEffect(() => {
    if (authenticated) {
      fetchGuests(1)
      fetchWishes()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated])

  // Logout
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" })
      const data = await response.json()
      if (data.success) {
        toast.success("Logged out successfully")
        router.push("/admin/login")
        router.refresh()
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout")
    }
  }

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
          fetchGuests(currentPage)
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
          // Go to first page to see the new guest
          fetchGuests(1)
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
        // If current page becomes empty, go to previous page
        const remainingOnPage = guests.length - 1
        if (remainingOnPage === 0 && currentPage > 1) {
          fetchGuests(currentPage - 1)
        } else {
          fetchGuests(currentPage)
        }
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

  // Load template from database
  const fetchTemplate = async () => {
    try {
      const response = await fetch('/api/template')
      const data = await response.json()
      if (data.success && data.data) {
        setInvitationTemplate(data.data.template)
      }
    } catch (error) {
      console.error('Error fetching template:', error)
      toast.error('Failed to load template')
    }
  }

  useEffect(() => {
    if (authenticated) {
      fetchTemplate()
    }
  }, [authenticated])

  // Generate invitation template text
  const generateInvitationTemplate = (guest: Guest): string => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (typeof window !== 'undefined' ? window.location.origin : 'https://your-wedding-site.com')
    const invitationUrl = guest.invitationUrl || `${baseUrl}/invitation/${guest.shortId}`
    
    if (!invitationTemplate) {
      return 'Template not loaded. Please refresh the page.'
    }
    
    return invitationTemplate
      .replace(/\{\{GUEST_NAME\}\}/g, guest.name)
      .replace(/\{\{INVITATION_URL\}\}/g, invitationUrl)
  }

  // Open share dialog
  const handleShareInvitation = (guest: Guest) => {
    setSelectedGuestForShare(guest)
    setShareDialogOpen(true)
    setCopiedTemplate(false)
    setIsEditingTemplate(false)
  }

  // Save template to database
  const handleSaveTemplate = async () => {
    try {
      const response = await fetch('/api/template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ template: invitationTemplate }),
      })

      const data = await response.json()
      if (data.success) {
        setIsEditingTemplate(false)
        toast.success("Template saved successfully!")
      } else {
        toast.error(data.error || "Failed to save template")
      }
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error("Failed to save template")
    }
  }

  // Reset template to default
  const handleResetTemplate = async () => {
    try {
      // Fetch default template from API (which will return the default if none exists)
      const getResponse = await fetch('/api/template')
      const getData = await getResponse.json()
      
      if (getData.success && getData.data) {
        // Delete the current template to reset to default
        const deleteResponse = await fetch('/api/template', {
          method: 'DELETE',
        })
        
        const deleteData = await deleteResponse.json()
        if (deleteData.success) {
          // Reload template (will get default from API)
          await fetchTemplate()
          toast.success("Template reset to default")
        } else {
          toast.error(deleteData.error || "Failed to reset template")
        }
      } else {
        toast.error("Failed to load default template")
      }
    } catch (error) {
      console.error('Error resetting template:', error)
      toast.error("Failed to reset template")
    }
  }

  // Copy invitation template
  const handleCopyTemplate = async () => {
    if (!selectedGuestForShare) return
    
    try {
      const template = generateInvitationTemplate(selectedGuestForShare)
      await navigator.clipboard.writeText(template)
      setCopiedTemplate(true)
      toast.success("Invitation template copied to clipboard!")
      setTimeout(() => setCopiedTemplate(false), 2000)
    } catch (error) {
      console.error("Error copying template:", error)
      toast.error("Failed to copy template")
    }
  }

  // share to telegram
  const shareToTelegram = () => {
    if (!selectedGuestForShare) return
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const encodedText = encodeURIComponent(generateInvitationTemplate(selectedGuestForShare));
  
    const tgUrl = `https://t.me/share/url?url=${baseUrl}&url=${encodedText}`;
  
    window.open(tgUrl, "_blank");
  };

  // Share to Facebook Messenger
  const handleShareMessenger = () => {
    if (!selectedGuestForShare) return
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (typeof window !== 'undefined' ? window.location.origin : 'https://your-wedding-site.com')
    const invitationUrl = selectedGuestForShare.invitationUrl || `${baseUrl}/invitation/${selectedGuestForShare.shortId}`
    
    // Get the full invitation template text
    const shareText = generateInvitationTemplate(selectedGuestForShare)
    
    // Messenger share - include both URL and text
    // Note: Messenger might not support text parameter, so we'll use URL and let user add text manually
    // Or we can try using the Facebook share dialog with quote parameter
    const messengerUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(invitationUrl)}&quote=${encodeURIComponent(shareText)}&redirect_uri=${encodeURIComponent(window.location.origin)}`
    window.open(messengerUrl, "_blank", "noopener,noreferrer")
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

  // Show loading while checking auth
  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8faf6] to-[#e8f5e3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2c5e1a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2c5e1a]">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faf6] to-[#e8f5e3] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2c5e1a] mb-2">Wedding Admin</h1>
            <p className="text-[#2c3e1a]/70">
              Manage guests and view wishes
              {username && <span className="ml-2 text-sm">• Logged in as {username}</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
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
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="guests" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="guests" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Guests ({totalGuests})
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
                    onClick={() => fetchGuests(currentPage)}
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
                                  title="Copy URL"
                                >
                                  {copiedUrl === guest.invitationUrl ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleShareInvitation(guest)}
                                  className="h-8 w-8 p-0"
                                  title="Share invitation template"
                                >
                                  <Share2 className="w-4 h-4 text-[#87b577]" />
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
                
                {/* Pagination */}
                {!loading && totalGuests > 0 && (
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-[#2c3e1a]/70">
                      Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalGuests)} of {totalGuests} guests
                    </div>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => currentPage > 1 && fetchGuests(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="gap-1"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span>Previous</span>
                          </Button>
                        </PaginationItem>
                        
                        {/* Page numbers */}
                        {Array.from({ length: Math.ceil(totalGuests / pageSize) }, (_, i) => i + 1)
                          .filter((page) => {
                            // Show first page, last page, current page, and pages around current
                            return (
                              page === 1 ||
                              page === Math.ceil(totalGuests / pageSize) ||
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            )
                          })
                          .map((page, index, array) => {
                            // Add ellipsis if there's a gap
                            const showEllipsisBefore = index > 0 && page - array[index - 1] > 1
                            
                            return (
                              <React.Fragment key={page}>
                                {showEllipsisBefore && (
                                  <PaginationItem>
                                    <PaginationEllipsis />
                                  </PaginationItem>
                                )}
                                <PaginationItem>
                                  <Button
                                    variant={currentPage === page ? "outline" : "ghost"}
                                    size="sm"
                                    onClick={() => fetchGuests(page)}
                                    className="min-w-[2.5rem]"
                                  >
                                    {page}
                                  </Button>
                                </PaginationItem>
                              </React.Fragment>
                            )
                          })}
                        
                        <PaginationItem>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => currentPage < Math.ceil(totalGuests / pageSize) && fetchGuests(currentPage + 1)}
                            disabled={currentPage >= Math.ceil(totalGuests / pageSize)}
                            className="gap-1"
                          >
                            <span>Next</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
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
                    {/* Bulk Actions Bar */}
                    <div className="flex items-center justify-between p-3 bg-[#87b577]/10 rounded-lg border border-[#87b577]/20">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedWishes.size === wishes.length && wishes.length > 0}
                          onChange={handleSelectAllWishes}
                          className="w-4 h-4 text-[#2c5e1a] border-[#87b577] rounded focus:ring-[#87b577]"
                        />
                        <span className="text-sm text-[#2c3e1a]/70">
                          {selectedWishes.size > 0 ? `${selectedWishes.size} selected` : "Select all"}
                        </span>
                      </div>
                      {selectedWishes.size > 0 && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkToggleVisibility(true)}
                            className="text-[#2c5e1a] hover:text-[#87b577]"
                          >
                            <EyeOff className="w-4 h-4 mr-2" />
                            Hide Selected
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkToggleVisibility(false)}
                            className="text-[#2c5e1a] hover:text-[#87b577]"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Show Selected
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Selected
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete {selectedWishes.size} wish(es). This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleBulkDelete}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>

                    {/* Wishes List */}
                    {wishes.map((wish) => (
                      <Card 
                        key={wish._id} 
                        className={`border-[#87b577]/30 ${wish.isHidden ? 'opacity-60 bg-gray-50' : ''} ${selectedWishes.has(wish._id!) ? 'ring-2 ring-[#87b577]' : ''}`}
                      >
                        <CardContent className="pt-6">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={selectedWishes.has(wish._id!)}
                                  onChange={() => wish._id && handleToggleWishSelection(wish._id)}
                                  className="w-4 h-4 mt-1 text-[#2c5e1a] border-[#87b577] rounded focus:ring-[#87b577] flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-semibold text-[#2c5e1a]">{wish.name}</p>
                                    {wish.isHidden && (
                                      <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                                        Hidden
                                      </span>
                                    )}
                                  </div>
                                  {wish.guestName && wish.guestName !== wish.name && (
                                    <p className="text-sm text-[#2c3e1a]/70 mt-1">
                                      From: {wish.guestName}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-4 flex-shrink-0">
                                <div className="flex items-center gap-1 text-sm text-[#2c3e1a]/70">
                                  <Users className="w-4 h-4" />
                                  {wish.guests}
                                </div>
                                <div className="text-sm text-[#2c3e1a]/70">{formatDate(wish.createdAt)}</div>
                                <div className="flex items-center gap-2 ml-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleToggleWishVisibility(wish._id!, wish.isHidden || false)}
                                    className="text-[#2c5e1a] hover:text-[#87b577]"
                                  >
                                    {wish.isHidden ? (
                                      <>
                                        <Eye className="w-4 h-4 mr-2" />
                                        Show
                                      </>
                                    ) : (
                                      <>
                                        <EyeOff className="w-4 h-4 mr-2" />
                                        Hide
                                      </>
                                    )}
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will permanently delete this wish. This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => wish._id && handleDeleteWish(wish._id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
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

      {/* Share Invitation Template Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Share Invitation Template</DialogTitle>
            <DialogDescription>
              {isEditingTemplate 
                ? "Edit the invitation template. Use {{GUEST_NAME}} and {{INVITATION_URL}} as placeholders."
                : `Copy the invitation message template to share with ${selectedGuestForShare?.name}`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!isEditingTemplate ? (
              <>
                <div className="space-y-2">
                  <Label>Invitation Template (Preview)</Label>
                  <Textarea
                    readOnly
                    value={selectedGuestForShare ? generateInvitationTemplate(selectedGuestForShare) : ""}
                    className="min-h-[200px] font-mono text-sm bg-gray-50 whitespace-pre-wrap"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-[#87b577]/10 rounded-lg border border-[#87b577]/20">
                  <div className="text-sm text-[#2c3e1a]/70">
                    <p className="font-semibold">Guest: {selectedGuestForShare?.name}</p>
                    <p className="text-xs mt-1 break-all">Link: {selectedGuestForShare?.invitationUrl}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={shareToTelegram}
                      className="text-[#0088cc] hover:bg-[#0088cc]/10 border-[#0088cc]/30"
                      title="Share via Telegram"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Telegram
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShareMessenger}
                      className="text-[#0084ff] hover:bg-[#0084ff]/10 border-[#0084ff]/30"
                      title="Share via Facebook Messenger"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Messenger
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingTemplate(true)}
                      className="text-[#2c5e1a] hover:bg-[#87b577]/10"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Template
                    </Button>
                    <Button
                      onClick={handleCopyTemplate}
                      className="bg-[#2c5e1a] hover:bg-[#4a7c2e] text-white"
                    >
                      {copiedTemplate ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Template
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Edit Template</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetTemplate}
                      className="text-xs text-[#2c3e1a]/70 hover:text-[#2c5e1a]"
                    >
                      Reset to Default
                    </Button>
                  </div>
                  <Textarea
                    value={invitationTemplate}
                    onChange={(e) => setInvitationTemplate(e.target.value)}
                    className="min-h-[250px] font-mono text-sm whitespace-pre-wrap"
                    placeholder="Use {{GUEST_NAME}} for guest name and {{INVITATION_URL}} for invitation link"
                  />
                  <p className="text-xs text-[#2c3e1a]/60">
                    Placeholders: <code className="bg-gray-100 px-1 rounded">{"{{GUEST_NAME}}"}</code> will be replaced with guest name, <code className="bg-gray-100 px-1 rounded">{"{{INVITATION_URL}}"}</code> will be replaced with invitation link
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <Textarea
                    readOnly
                    value={selectedGuestForShare ? generateInvitationTemplate(selectedGuestForShare) : ""}
                    className="min-h-[150px] font-mono text-sm bg-gray-50 whitespace-pre-wrap"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            {isEditingTemplate ? (
              <>
                <Button
                  variant="outline"
                  onClick={async () => {
                    setIsEditingTemplate(false)
                    // Reload template from database
                    await fetchTemplate()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveTemplate}
                  className="bg-[#2c5e1a] hover:bg-[#4a7c2e] text-white"
                >
                  Save Template
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShareDialogOpen(false)}
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
