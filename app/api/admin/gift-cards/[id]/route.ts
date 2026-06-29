import { db } from '@/lib/db'
import { giftCard } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return Response.json({ error: 'Missing gift card ID' }, { status: 400 })
    }

    await db.delete(giftCard).where(eq(giftCard.id, id))
    return Response.json({ success: true })
  } catch (error) {
    console.error('[v0] Error deleting gift card:', error)
    return Response.json({ error: 'Failed to delete gift card' }, { status: 500 })
  }
}
