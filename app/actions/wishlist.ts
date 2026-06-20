'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { wishlist } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function addToWishlist(productId: string) {
  const userId = await getUserId()

  const result = await db
    .insert(wishlist)
    .values({ userId, productId })
    .returning()

  revalidatePath('/wishlist')
  revalidatePath('/products')

  return result[0]
}

export async function removeFromWishlist(productId: string) {
  const userId = await getUserId()

  await db
    .delete(wishlist)
    .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)))

  revalidatePath('/wishlist')
  revalidatePath('/products')
}

export async function getWishlist() {
  const userId = await getUserId()

  return db.select().from(wishlist).where(eq(wishlist.userId, userId))
}

export async function isProductInWishlist(productId: string) {
  const userId = await getUserId()

  const items = await db
    .select()
    .from(wishlist)
    .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)))

  return items.length > 0
}
