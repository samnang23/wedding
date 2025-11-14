import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import type { Guest } from '@/types/wedding'
import { isValidShortId } from '@/lib/short-id'

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
    
    // Validate short ID format
    if (!isValidShortId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid invitation ID format' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const guest = await db.collection('guests').findOne({
      shortId: id.toUpperCase(),
    })

    if (!guest) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: serializeGuest(guest) 
    })
  } catch (error: any) {
    console.error('Error fetching invitation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invitation' },
      { status: 500 }
    )
  }
}

