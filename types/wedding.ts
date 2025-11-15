import type { ElementType } from "react"

export interface WeddingEvent {
  id: string
  title: string
  titleEn: string
  description: string
  date: string
  time: string
  icon: ElementType | string
}

export interface Photo {
  id: number
  src: string
  alt: string
}

export interface Wish {
  id: number
  name: string
  message: string
  date: string
  guests: number
}

export interface Guest {
  _id?: string
  shortId: string // Short ID for invitation URL (e.g., "ELJD29")
  name: string
  invitationUrl?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface WishData {
  _id?: string
  name: string
  message: string
  guests: number
  guestName?: string // The name from the invitation URL
  guestShortId?: string // The shortId of the guest who submitted (for validation)
  isHidden?: boolean // Whether the wish is hidden from public view
  createdAt: Date
}

declare global {
  interface Window {
    confetti: (options: { particleCount: number; spread: number; origin: { y: number } }) => void
  }
}

