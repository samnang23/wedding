import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import type { WishData } from '@/types/wedding'

// Helper to serialize MongoDB documents
const serializeWish = (wish: any): WishData => ({
  _id: wish._id?.toString(),
  name: wish.name,
  message: wish.message,
  guests: wish.guests,
  guestName: wish.guestName,
  guestShortId: wish.guestShortId,
  isHidden: wish.isHidden || false,
  createdAt: wish.createdAt,
})

// Public endpoint to fetch wishes (no authentication required)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '3') // Default to 3 for initial load
    const skip = parseInt(searchParams.get('skip') || '0')

    const db = await getDb()
    // Public API only shows non-hidden wishes
    const wishes = await db
      .collection<WishData>('wishes')
      .find({ isHidden: { $ne: true } }) // Only show non-hidden wishes
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray()

    const total = await db.collection<WishData>('wishes').countDocuments({ isHidden: { $ne: true } })

    return NextResponse.json({
      success: true,
      data: wishes.map(serializeWish),
      total,
      limit,
      skip,
    })
  } catch (error: any) {
    console.error('Error fetching wishes:', error)
    const errorMessage = error?.message || 'Failed to fetch wishes'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

