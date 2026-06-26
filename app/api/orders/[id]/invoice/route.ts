import { NextRequest, NextResponse } from 'next/server'
import jsPDF from 'jspdf'

// Helper function to fetch order from database
async function getOrderFromDatabase(orderId: string) {
  try {
    // Fetch all orders from the admin endpoint
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/admin/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const data = await response.json()

    if (data.success && data.data) {
      const order = data.data.find((o: any) => o.id === orderId)
      if (order) {
        let items: any[] = []
        try {
          if (order.items) {
            items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
          }
        } catch (e) {
          console.log('[v0] Error parsing items')
        }

        return {
          id: order.id,
          status: order.status,
          items,
          subtotal: order.subtotal,
          total: order.total,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          address: order.address,
          city: order.city,
          postalCode: order.postalCode,
          country: order.country,
          createdAt: order.createdAt,
        }
      }
    }
  } catch (error) {
    console.error('[v0] Error fetching order from database:', error)
  }

  return null
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Fetch order from database
    const order = await getOrderFromDatabase(orderId)

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Create PDF
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 15
    let yPosition = margin

    // Logo/Header - using text instead of image
    doc.setFontSize(24)
    doc.setTextColor(40, 40, 40)
    doc.setFont(undefined, 'bold')
    doc.text('ADs', margin, yPosition)
    yPosition += 12

    // Invoice title
    doc.setFontSize(14)
    doc.text('INVOICE', margin, yPosition)
    yPosition += 8

    // Invoice details
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text(`Invoice #: ${order.id.slice(0, 8)}`, margin, yPosition)
    yPosition += 6
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, margin, yPosition)
    yPosition += 6
    doc.text(`Status: ${order.status.toUpperCase()}`, margin, yPosition)
    yPosition += 12

    // Customer Information
    doc.setTextColor(40, 40, 40)
    doc.setFont(undefined, 'bold')
    doc.text('BILL TO:', margin, yPosition)
    yPosition += 6
    
    doc.setFont(undefined, 'normal')
    doc.setTextColor(60, 60, 60)
    doc.text(order.customerName, margin, yPosition)
    yPosition += 5
    doc.text(order.address, margin, yPosition)
    yPosition += 5
    doc.text(`${order.city}, ${order.postalCode}`, margin, yPosition)
    yPosition += 5
    doc.text(order.country, margin, yPosition)
    yPosition += 5
    doc.text(order.customerEmail, margin, yPosition)
    yPosition += 10

    // Items Table Header
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.setTextColor(40, 40, 40)
    
    const tableStartY = yPosition
    const colWidths = {
      description: pageWidth - 2 * margin - 60,
      quantity: 20,
      price: 20,
      total: 20,
    }

    let colX = margin
    doc.text('Description', colX, yPosition)
    colX += colWidths.description
    doc.text('Qty', colX, yPosition, { align: 'center' })
    colX += colWidths.quantity
    doc.text('Price', colX, yPosition, { align: 'right' })
    colX += colWidths.price
    doc.text('Total', colX, yPosition, { align: 'right' })

    // Separator line
    yPosition += 2
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 6

    // Items
    doc.setFont(undefined, 'normal')
    doc.setTextColor(60, 60, 60)
    const lineHeight = 6

    const items = Array.isArray(order.items) ? order.items : []
    items.forEach((item: any) => {
      const description = item.name || item.productName || 'Item'
      const quantity = item.quantity || 1
      const price = parseFloat(item.price || 0)
      const total = price * quantity

      // Description
      colX = margin
      doc.text(description.substring(0, 30), colX, yPosition)
      
      // Quantity
      colX = margin + colWidths.description
      doc.text(quantity.toString(), colX, yPosition, { align: 'center' })

      // Price
      colX += colWidths.quantity
      doc.text(`₹${price.toFixed(2)}`, colX, yPosition, { align: 'right' })

      // Total
      colX += colWidths.price
      doc.text(`₹${total.toFixed(2)}`, colX, yPosition, { align: 'right' })

      yPosition += lineHeight
    })

    // Subtotal section separator
    yPosition += 4
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 6

    // Summary
    doc.setFont(undefined, 'normal')
    const subtotal = parseFloat(order.subtotal)
    const total = parseFloat(order.total)
    const tax = total - subtotal

    colX = pageWidth - margin - 40
    doc.setTextColor(60, 60, 60)
    doc.text('Subtotal:', colX, yPosition, { align: 'right' })
    doc.text(`₹${subtotal.toFixed(2)}`, colX + 35, yPosition, { align: 'right' })
    yPosition += 6

    doc.text('Tax (10%):', colX, yPosition, { align: 'right' })
    doc.text(`₹${tax.toFixed(2)}`, colX + 35, yPosition, { align: 'right' })
    yPosition += 6

    // Total (bold)
    doc.setFont(undefined, 'bold')
    doc.setFontSize(12)
    doc.setTextColor(40, 40, 40)
    doc.text('TOTAL:', colX, yPosition, { align: 'right' })
    doc.text(`₹${total.toFixed(2)}`, colX + 35, yPosition, { align: 'right' })

    // Footer
    yPosition = pageHeight - margin - 20
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.setFont(undefined, 'normal')
    doc.text('Thank you for your purchase!', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 5
    doc.text('For support, contact support@ads.com', pageWidth / 2, yPosition, { align: 'center' })

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${order.id.slice(0, 8)}.pdf"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    })
  } catch (error) {
    console.error('[v0] Error generating invoice:', error)
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}
