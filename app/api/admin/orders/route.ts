import { db } from '@/lib/db'
import { order } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const orders = await db.select().from(order).orderBy(desc(order.createdAt))
    
    return NextResponse.json({
      success: true,
      data: orders,
      message: 'Orders retrieved successfully',
    })
  } catch (error) {
    console.error('[v0] Error fetching orders:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve orders',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      userId,
      status = 'pending',
      items,
      subtotal,
      total,
      customerName,
      customerEmail,
      address,
      city,
      postalCode,
      country,
    } = body

    if (!customerName || !customerEmail || !address || !city || !total) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      )
    }

    const newOrder = await db.insert(order).values({
      userId: userId || 'guest',
      status,
      items: items ? JSON.stringify(items) : null,
      subtotal: subtotal?.toString() || '0',
      total: total.toString(),
      customerName,
      customerEmail,
      address,
      city,
      postalCode,
      country,
    }).returning()

    return NextResponse.json(
      {
        success: true,
        data: newOrder[0],
        message: 'Order created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Error creating order:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create order',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
