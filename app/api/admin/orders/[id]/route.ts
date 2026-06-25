import { db } from '@/lib/db'
import { order } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params

    const orderData = await db.select().from(order).where(eq(order.id, orderId))

    if (!orderData.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: orderData[0],
      message: 'Order retrieved successfully',
    })
  } catch (error) {
    console.error('[v0] Error fetching order:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve order',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const body = await request.json()

    const { status } = body

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Status field is required',
        },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        },
        { status: 400 }
      )
    }

    const updatedOrder = await db
      .update(order)
      .set({ status, updatedAt: new Date() })
      .where(eq(order.id, orderId))
      .returning()

    if (!updatedOrder.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder[0],
      message: `Order status updated to ${status} successfully`,
    })
  } catch (error) {
    console.error('[v0] Error updating order:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update order',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params

    const deletedOrder = await db
      .delete(order)
      .where(eq(order.id, orderId))
      .returning()

    if (!deletedOrder.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully',
    })
  } catch (error) {
    console.error('[v0] Error deleting order:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete order',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
