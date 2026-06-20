'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { order } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

async function getAdminUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }
  return session.user
}

export async function createOrder(data: {
  items: any
  subtotal: string
  total: string
  customerName: string
  customerEmail: string
  address: string
  city: string
  postalCode: string
  country: string
}) {
  const userId = await getUserId()

  const result = await db
    .insert(order)
    .values({
      userId,
      status: 'pending',
      items: data.items,
      subtotal: data.subtotal,
      total: data.total,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      country: data.country,
    })
    .returning()

  revalidatePath('/orders')

  return result[0]
}

export async function getUserOrders() {
  const userId = await getUserId()

  return db.select().from(order).where(eq(order.userId, userId))
}

export async function getOrderById(id: string) {
  const userId = await getUserId()

  const orders = await db
    .select()
    .from(order)
    .where(and(eq(order.id, id), eq(order.userId, userId)))

  return orders[0]
}

export async function getAllOrders() {
  await getAdminUser()
  return db.select().from(order)
}

export async function updateOrderStatus(id: string, status: string) {
  await getAdminUser()

  const result = await db
    .update(order)
    .set({ status, updatedAt: new Date() })
    .where(eq(order.id, id))
    .returning()

  revalidatePath('/admin/orders')

  return result[0]
}
