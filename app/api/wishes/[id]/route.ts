import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import type { WishData } from '@/types/wedding'
import { verifyAdmin } from '@/lib/auth'

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

// DELETE wish (permanent deletion)
// Allows both admin and guest (if it's their own wish) to delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid wish ID' },
        { status: 400 }
      )
    }

    const db = await getDb()
    
    // Get the wish first to check ownership
    const wish = await db.collection('wishes').findOne({
      _id: new ObjectId(id),
    })

    if (!wish) {
      return NextResponse.json(
        { success: false, error: 'Wish not found' },
        { status: 404 }
      )
    }

    // Check if user is admin
    const isAdmin = await verifyAdmin()
    
    // If not admin, check if guest is deleting their own wish
    if (!isAdmin) {
      const body = await request.json().catch(() => ({}))
      const { guestShortId } = body

      if (!guestShortId || wish.guestShortId !== guestShortId) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized. You can only delete your own wishes.' },
          { status: 403 }
        )
      }
    }

    // Delete the wish
    const result = await db.collection('wishes').deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Wish not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Wish deleted successfully' })
  } catch (error) {
    console.error('Error deleting wish:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete wish' },
      { status: 500 }
    )
  }
}

// PATCH wish (toggle hide/show)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { isHidden } = body

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid wish ID' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const result = await db.collection('wishes').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isHidden: isHidden === true,
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Wish not found' },
        { status: 404 }
      )
    }

    const updatedWish = await db.collection('wishes').findOne({
      _id: new ObjectId(id),
    })

    return NextResponse.json({ success: true, data: serializeWish(updatedWish!) })
  } catch (error) {
    console.error('Error updating wish:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update wish' },
      { status: 500 }
    )
  }
}

