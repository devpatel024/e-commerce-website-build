import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { order } from '@/lib/db/schema'

let stripe: any = null

function getStripe() {
  if (!stripe) {
    const Stripe = require('stripe')
    stripe = new Stripe.default(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2026-05-27.dahlia',
    })
  }
  return stripe
}

export async function POST(request: NextRequest) {
  const stripeClient = getStripe()
  const body = await request.text()
  const sig = (await headers()).get('stripe-signature') || ''
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

  let event: any

  try {
    event = stripeClient.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('[v0] Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object

        // Extract order data from session metadata
        const metadata = session.metadata || {}
        const lineItems = await stripeClient.checkout.sessions.listLineItems(session.id)

        // Parse order items from metadata or line items
        const items = lineItems.data.map((item: any) => ({
          productId: item.id,
          name: item.description,
          quantity: item.quantity,
          price: (item.amount_total / 100).toFixed(2),
        }))

        const total = (session.amount_total || 0) / 100
        const subtotal = (session.amount_subtotal || 0) / 100

        // Create order in database
        const newOrder = await db
          .insert(order)
          .values({
            userId: metadata.userId || 'guest',
            status: 'pending', // Initial status after payment
            items: JSON.stringify(items),
            subtotal: subtotal.toString(),
            total: total.toString(),
            customerName: metadata.customerName || session.customer_details?.name || 'Guest',
            customerEmail: metadata.customerEmail || session.customer_details?.email || '',
            address: metadata.address || session.customer_details?.address?.line1 || '',
            city: metadata.city || session.customer_details?.address?.city || '',
            postalCode: metadata.postalCode || session.customer_details?.address?.postal_code || '',
            country: metadata.country || session.customer_details?.address?.country || '',
          })
          .returning()

        console.log('[v0] Order created from Stripe webhook:', newOrder[0].id)
        break
      }

      case 'payment_intent.succeeded': {
        console.log('[v0] Payment succeeded:', event.data.object.id)
        break
      }

      case 'payment_intent.payment_failed': {
        console.log('[v0] Payment failed:', event.data.object.id)
        break
      }

      default:
        console.log('[v0] Unhandled webhook event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[v0] Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
