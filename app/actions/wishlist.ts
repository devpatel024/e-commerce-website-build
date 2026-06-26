'use server'

import { db } from '@/lib/db'
import { wishlist } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function addToWishlist(productId: string, userId: string) {
  try {
    // Check if already in wishlist
    const existing = await db
      .select()
      .from(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)))

    if (existing.length > 0) {
      return { success: true, message: 'Already in wishlist' }
    }

    await db.insert(wishlist).values({
      userId,
      productId,
    })

    return { success: true, message: 'Added to wishlist' }
  } catch (error) {
    console.error('[v0] Error adding to wishlist:', error)
    return { success: false, message: 'Failed to add to wishlist' }
  }
}

export async function removeFromWishlist(productId: string, userId: string) {
  try {
    await db
      .delete(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)))

    return { success: true, message: 'Removed from wishlist' }
  } catch (error) {
    console.error('[v0] Error removing from wishlist:', error)
    return { success: false, message: 'Failed to remove from wishlist' }
  }
}

export async function getWishlist(userId: string) {
  try {
    const items = await db
      .select()
      .from(wishlist)
      .where(eq(wishlist.userId, userId))

    return items.map(item => item.productId)
  } catch (error) {
    console.error('[v0] Error fetching wishlist:', error)
    return []
  }
}

export async function isProductInWishlist(productId: string, userId: string) {
  try {
    const item = await db
      .select()
      .from(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)))

    return item.length > 0
  } catch (error) {
    console.error('[v0] Error checking wishlist:', error)
    return false
  }
}
