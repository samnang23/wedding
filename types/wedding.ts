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

declare global {
  interface Window {
    confetti: (options: { particleCount: number; spread: number; origin: { y: number } }) => void
  }
}

