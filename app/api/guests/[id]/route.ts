import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import type { Guest } from '@/types/wedding'
import { generateShortId } from '@/lib/short-id'

// Helper to serialize MongoDB documents
const serializeGuest = (guest: any): Guest => ({
  _id: guest._id?.toString(),
  shortId: guest.shortId,
  name: guest.name,
  invitationUrl: guest.invitationUrl,
  createdAt: guest.createdAt,
  updatedAt: guest.updatedAt,
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid guest ID' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const guest = await db.collection('guests').findOne({
      _id: new ObjectId(id),
    })

    if (!guest) {
      return NextResponse.json(
        { success: false, error: 'Guest not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: serializeGuest(guest) })
  } catch (error) {
    console.error('Error fetching guest:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch guest' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name } = body

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid guest ID' },
        { status: 400 }
      )
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Guest name is required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    
    // Get existing guest to preserve shortId
    const existingGuest = await db.collection('guests').findOne({
      _id: new ObjectId(id),
    })
    
    if (!existingGuest) {
      return NextResponse.json(
        { success: false, error: 'Guest not found' },
        { status: 404 }
      )
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    
    // Use existing shortId or generate new one if missing (for backward compatibility)
    const shortId = existingGuest.shortId || generateShortId()
    const invitationUrl = `${baseUrl}/invitation/${shortId}`

    const result = await db.collection('guests').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: name.trim(),
          shortId: shortId,
          invitationUrl,
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Guest not found' },
        { status: 404 }
      )
    }

    const updatedGuest = await db.collection('guests').findOne({
      _id: new ObjectId(id),
    })

    return NextResponse.json({ success: true, data: serializeGuest(updatedGuest!) })
  } catch (error) {
    console.error('Error updating guest:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update guest' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid guest ID' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const result = await db.collection('guests').deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Guest not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Guest deleted successfully' })
  } catch (error) {
    console.error('Error deleting guest:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete guest' },
      { status: 500 }
    )
  }
}

