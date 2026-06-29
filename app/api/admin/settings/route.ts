import { db } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const allSettings = await db.select().from(settings)
    const settingsMap = Object.fromEntries(
      allSettings.map(s => [s.key, s.value])
    )
    return Response.json(settingsMap)
  } catch (error) {
    console.error('[v0] Error fetching settings:', error)
    return Response.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Save each setting
    for (const [key, value] of Object.entries(body)) {
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, key))
        .limit(1)

      if (existing.length > 0) {
        await db
          .update(settings)
          .set({ value: String(value), updatedAt: new Date() })
          .where(eq(settings.key, key))
      } else {
        await db.insert(settings).values({
          key,
          value: String(value),
          updatedAt: new Date(),
        })
      }
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('[v0] Error saving settings:', error)
    return Response.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
