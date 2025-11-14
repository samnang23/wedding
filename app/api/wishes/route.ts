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
  createdAt: wish.createdAt,
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    const db = await getDb()
    const wishes = await db
      .collection<WishData>('wishes')
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray()

    const total = await db.collection<WishData>('wishes').countDocuments()

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
      { success: false, error: errorMessage, details: process.env.NODE_ENV === 'development' ? error?.stack : undefined },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, message, guests, guestName } = body

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    const guestsCount = parseInt(guests) || 1

    const wish: WishData = {
      name: name.trim(),
      message: message.trim(),
      guests: guestsCount,
      guestName: guestName || undefined,
      createdAt: new Date(),
    }

    const db = await getDb()
    const result = await db.collection<WishData>('wishes').insertOne(wish)

    return NextResponse.json({
      success: true,
      data: { ...wish, _id: result.insertedId.toString() },
    })
  } catch (error) {
    console.error('Error creating wish:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create wish' },
      { status: 500 }
    )
  }
}

