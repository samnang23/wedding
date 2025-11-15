import { NextResponse } from 'next/server'
import { getSession, verifyAdmin } from '@/lib/auth'

export async function GET() {
  const isAdmin = await verifyAdmin()
  const session = await getSession()
  
  return NextResponse.json({
    authenticated: isAdmin,
    username: session?.username || null,
  })
}

