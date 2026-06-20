import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { role } = await request.json()

    if (!['user', 'admin'].includes(role)) {
      return Response.json({ error: 'Invalid role' }, { status: 400 })
    }

    const result = await db
      .update(user)
      .set({ role })
      .where(eq(user.id, session.user.id))
      .returning()

    return Response.json(result[0])
  } catch (error) {
    console.error('Role update error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
