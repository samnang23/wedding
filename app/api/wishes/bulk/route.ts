import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { verifyAdmin } from '@/lib/auth'

// Bulk DELETE wishes
export async function DELETE(request: NextRequest) {
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
    const { ids } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid request. IDs array is required.' },
        { status: 400 }
      )
    }

    // Validate all IDs
    const validIds = ids.filter(id => ObjectId.isValid(id))
    if (validIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid wish IDs provided' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const result = await db.collection('wishes').deleteMany({
      _id: { $in: validIds.map(id => new ObjectId(id)) },
    })

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} wish(es) deleted successfully`,
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    console.error('Error deleting wishes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete wishes' },
      { status: 500 }
    )
  }
}

// Bulk PATCH wishes (toggle hide/show)
export async function PATCH(request: NextRequest) {
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
    const { ids, isHidden } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid request. IDs array is required.' },
        { status: 400 }
      )
    }

    if (typeof isHidden !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Invalid request. isHidden must be a boolean.' },
        { status: 400 }
      )
    }

    // Validate all IDs
    const validIds = ids.filter(id => ObjectId.isValid(id))
    if (validIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid wish IDs provided' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const result = await db.collection('wishes').updateMany(
      { _id: { $in: validIds.map(id => new ObjectId(id)) } },
      {
        $set: {
          isHidden: isHidden,
        },
      }
    )

    return NextResponse.json({
      success: true,
      message: `${result.modifiedCount} wish(es) ${isHidden ? 'hidden' : 'shown'} successfully`,
      modifiedCount: result.modifiedCount,
    })
  } catch (error) {
    console.error('Error updating wishes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update wishes' },
      { status: 500 }
    )
  }
}

