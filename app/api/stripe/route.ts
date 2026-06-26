import { NextRequest, NextResponse } from 'next/server'
import { getOrders, saveOrder } from '@/lib/storage'
import { Order, OrderItem } from '@/lib/types'
import { db } from '@/lib/db'
import { order as orderTable } from '@/lib/db/schema'

export const runtime = 'nodejs'

// Initialize Stripe only when needed
let stripe: any

function getStripe() {
  if (!stripe) {
    const Stripe = require('stripe').default
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
  }
  return stripe
}

// POST /api/stripe - Create checkout session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'create-session') {
      return handleCreateSession(data)
    } else if (action === 'webhook') {
      return handleWebhook(data)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleCreateSession(data: any) {
  const { items, total, customer } = data

  if (!items || !total || !customer) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  try {
    const stripe = getStripe()
    
    // Create line items for Stripe checkout
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description || '',
        },
        unit_amount: Math.round(parseFloat(item.price) * 100),
      },
      quantity: item.quantity,
    }))

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout`,
      customer_email: customer.email,
      metadata: {
        userId: customer.userId || 'guest',
        customerName: customer.name,
        customerEmail: customer.email,
        address: customer.address,
        city: customer.city,
        postalCode: customer.postalCode,
        country: customer.country || 'US',
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

async function handleWebhook(data: any) {
  const { sessionId } = data

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
  }

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    })

    // Create order from session
    const orderItems: OrderItem[] = []
    const lineItems = (session.line_items?.data || []) as any[]

    let total = 0
    lineItems.forEach((item: any) => {
      const amount = item.amount_total || 0
      const quantity = item.quantity || 1
      const itemTotal = amount / 100
      total += itemTotal

      orderItems.push({
        productId: `product-${item.id}`,
        productName: item.description || 'Product',
        quantity,
        price: amount / (100 * quantity),
      })
    })

    const order: Order = {
      id: `order-${session.id}`,
      createdAt: new Date().toISOString(),
      status: 'processing',
      items: orderItems,
      total,
      customer: {
        name: (session.metadata?.customerName as string) || 'Customer',
        email: session.customer_email || (session.metadata?.customerEmail as string) || '',
        address: (session.metadata?.address as string) || (session.metadata?.customerAddress as string) || '',
        city: (session.metadata?.city as string) || (session.metadata?.customerCity as string) || '',
        postalCode: (session.metadata?.postalCode as string) || (session.metadata?.customerPostalCode as string) || '',
        country: (session.metadata?.country as string) || 'US',
      },
      paymentStatus: 'completed',
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
    }

    // Save order to BOTH storage (for backward compatibility) AND database
    saveOrder(order)

    // Also save to database for admin panel
    try {
      const dbOrder = await db
        .insert(orderTable)
        .values({
          userId: (session.metadata?.userId as string) || 'guest',
          status: 'pending',
          items: JSON.stringify(orderItems),
          subtotal: ((total * 100 - (session.metadata?.tax || 0)) / 100).toFixed(2),
          total: total.toFixed(2),
          customerName: (session.metadata?.customerName as string) || 'Customer',
          customerEmail: session.customer_email || (session.metadata?.customerEmail as string) || '',
          address: (session.metadata?.address as string) || (session.metadata?.customerAddress as string) || '',
          city: (session.metadata?.city as string) || (session.metadata?.customerCity as string) || '',
          postalCode: (session.metadata?.postalCode as string) || (session.metadata?.customerPostalCode as string) || '',
          country: (session.metadata?.country as string) || 'US',
        })
        .returning()
      console.log('[v0] Order created in database:', dbOrder[0].id)
    } catch (dbError) {
      console.error('[v0] Failed to save order to database:', dbError)
      // Continue even if DB save fails - we have localStorage backup
    }

    console.log('[v0] Order created from Stripe webhook:', order.id)
    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error: any) {
    console.error('[v0] Webhook processing error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// GET /api/stripe - Process webhook callback
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
    }

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      // Process the payment
      return handleWebhook({ sessionId })
    }

    return NextResponse.json({ status: session.payment_status })
  } catch (error: any) {
    console.error('Stripe GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
