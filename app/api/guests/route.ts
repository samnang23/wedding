import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import type { Guest } from '@/types/wedding'
import { generateShortId } from '@/lib/short-id'
import { verifyAdmin } from '@/lib/auth'

// Helper to serialize MongoDB documents
const serializeGuest = (guest: any): Guest => ({
  _id: guest._id?.toString(),
  shortId: guest.shortId,
  name: guest.name,
  invitationUrl: guest.invitationUrl,
  createdAt: guest.createdAt,
  updatedAt: guest.updatedAt,
})

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = parseInt(searchParams.get('skip') || '0')

    const db = await getDb()
    const guests = await db
      .collection<Guest>('guests')
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray()

    const total = await db.collection<Guest>('guests').countDocuments()
    
    return NextResponse.json({ 
      success: true, 
      data: guests.map(serializeGuest),
      total,
      limit,
      skip,
    })
  } catch (error: any) {
    console.error('Error fetching guests:', error)
    const errorMessage = error?.message || 'Failed to fetch guests'
    return NextResponse.json(
      { success: false, error: errorMessage, details: process.env.NODE_ENV === 'development' ? error?.stack : undefined },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Guest name is required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    
    // Generate unique short ID
    let shortId: string | undefined
    let isUnique = false
    let attempts = 0
    const maxAttempts = 10
    
    while (!isUnique && attempts < maxAttempts) {
      shortId = generateShortId()
      const existing = await db.collection('guests').findOne({ shortId })
      if (!existing) {
        isUnique = true
      }
      attempts++
    }
    
    if (!isUnique || !shortId) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate unique invitation ID. Please try again.' },
        { status: 500 }
      )
    }
    
    const invitationUrl = `${baseUrl}/invitation/${shortId}`

    const guest: Guest = {
      shortId,
      name: name.trim(),
      invitationUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Guest>('guests').insertOne(guest)

    return NextResponse.json({
      success: true,
      data: { ...guest, _id: result.insertedId.toString() },
    })
  } catch (error) {
    console.error('Error creating guest:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create guest' },
      { status: 500 }
    )
  }
}

