import { db } from '@/lib/db'
import { giftCard } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import crypto from 'crypto'

function generateUniqueCode(): string {
  return crypto.randomBytes(8).toString('hex').toUpperCase().slice(0, 12)
}

export async function GET() {
  try {
    const cards = await db.select().from(giftCard).orderBy(giftCard.createdAt)
    return Response.json(cards)
  } catch (error) {
    console.error('[v0] Error fetching gift cards:', error)
    return Response.json({ error: 'Failed to fetch gift cards' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { denomination, quantity } = body

    if (!denomination || !quantity) {
      return Response.json({ error: 'Missing denomination or quantity' }, { status: 400 })
    }

    const cardsToCreate = []
    for (let i = 0; i < quantity; i++) {
      cardsToCreate.push({
        code: generateUniqueCode(),
        denomination: String(denomination),
        balance: String(denomination),
        isRedeemed: false,
        createdAt: new Date(),
      })
    }

    await db.insert(giftCard).values(cardsToCreate)
    return Response.json({ success: true, generated: quantity })
  } catch (error) {
    console.error('[v0] Error creating gift cards:', error)
    return Response.json({ error: 'Failed to create gift cards' }, { status: 500 })
  }
}
