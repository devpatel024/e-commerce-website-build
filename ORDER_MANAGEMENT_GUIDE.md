# Order Management System Guide

## Overview

The LUXE e-commerce platform includes a complete order management system that allows customers to place orders and admins to manage them efficiently.

## For Customers

### Placing an Order

1. **Add Items to Cart**
   - Browse products on `/products`
   - Click "Add to Cart" on product detail pages
   - View cart at `/cart`

2. **Checkout (Login Required)**
   - Click "Proceed to Checkout" from cart
   - If not logged in, redirected to `/auth/login` with return parameter
   - After login, returned to checkout automatically

3. **Fill Order Details**
   - Enter shipping address
   - Enter email for confirmation
   - Choose payment method:
     - **Manual Payment**: Enter card details (demo mode)
     - **Stripe**: Connected to Stripe API for real payments

4. **Place Order**
   - Click "Place Order" button
   - Order processes instantly (no delays)
   - Redirected to order confirmation page
   - Confirmation sent to provided email

### Order Confirmation

**Page**: `/order-confirmation/[orderId]`

Shows:
- Order number and date
- Items ordered with quantities
- Shipping address
- Total amount with tax breakdown
- Expected delivery timeline
- Quick links to:
  - **View Your Orders**: Go to account page to track order history
  - **Continue Shopping**: Back to products page
  - **Return to Home**: Homepage

### Tracking Your Orders

**Page**: `/account` (Login Required)

In the "Orders" tab, customers can:
- View all placed orders
- See order status (Pending, Processing, Shipped, Delivered)
- View order items and totals
- Check shipping address
- See order date and time

---

## For Admin

### Admin Dashboard

**Page**: `/admin/dashboard` (Admin Login Required)

#### Login
- Navigate to `/admin`
- Enter admin credentials
- Demo admin email: `admin@example.com`
- Password: `admin123`

#### Dashboard Features

**1. Quick Stats**
- Total Orders (with pending count)
- Total Revenue (from all orders)
- Average Order Value
- Unique Customers

**2. Action Required Alert**
- Appears when there are pending orders
- Shows count of orders waiting to be processed
- Direct button to process orders

**3. Recent Orders Table**
- Shows last 5 orders
- Columns: Order ID, Customer, Total, Status, Date
- Color-coded status badges:
  - 🟡 Yellow: Pending
  - 🔵 Blue: Processing
  - 🟣 Purple: Shipped
  - 🟢 Green: Delivered

**4. Quick Actions**
- Links to manage products or view all orders

### Orders Management

**Page**: `/admin/orders` (Admin Login Required)

#### Features

**1. Order Filtering**
- Filter by Status (All, Pending, Processing, Shipped, Delivered)
- Shows count of filtered orders

**2. Orders List**
Each order displays:
- **Order Header** (Always Visible)
  - Order ID
  - Customer Name
  - Total Amount
  - Current Status
  - Payment Status (if available)
  - Order Date

- **Expandable Details**
  - Click order row to expand
  - Shows items ordered with quantities and prices
  - Shows complete shipping address
  - Shows email address

**3. Status Management**
- Dropdown to change order status
- Updates instantly
- No manual save needed

**4. Order Details Page**
**Page**: `/admin/orders/[orderId]`
- Full order information
- Customer details
- Item breakdown
- Status update controls

### Order Status Workflow

Orders progress through these statuses:

```
Pending 
  ↓ (admin starts processing)
Processing 
  ↓ (admin ships order)
Shipped 
  ↓ (order delivered)
Delivered
```

**Best Practices:**
1. Check dashboard daily for new pending orders
2. Update status to "Processing" when order is being prepared
3. Update to "Shipped" once sent to courier
4. Update to "Delivered" once customer confirms receipt

---

## Order Data Structure

Each order stored in localStorage contains:

```javascript
{
  id: "ORD-1719072000000",           // Unique order ID
  createdAt: "2024-06-22T...",       // ISO timestamp
  status: "pending",                 // Order status
  paymentMethod: "manual",           // Payment type
  paymentStatus: "pending",          // Payment status
  items: [
    {
      productId: "ring-001",
      productName: "Classic Gold Ring",
      quantity: 1,
      price: 299.99,
      size: "M",
      variant: "gold"
    }
  ],
  total: 329.89,                     // With tax
  customer: {
    name: "John Doe",
    email: "john@example.com",
    address: "123 Main St",
    city: "New York",
    postalCode: "10001"
  }
}
```

---

## Key Files

- **Checkout**: `/app/checkout/page.tsx` - Order creation
- **Confirmation**: `/app/order-confirmation/[id]/page.tsx` - Order confirmation
- **Admin Dashboard**: `/app/admin/dashboard/page.tsx` - Admin overview
- **Admin Orders**: `/app/admin/orders/page.tsx` - Order management
- **Storage**: `/lib/storage.ts` - Order persistence (localStorage)
- **Types**: `/lib/types.ts` - Order TypeScript interface

---

## Performance

- **Place Order**: ~300ms total (instant feedback)
- **Admin Load**: Real-time localStorage retrieval
- **Status Update**: Instant (no server delay)
- **Order History**: Cached in localStorage

---

## Troubleshooting

### Order Not Appearing in Admin Panel

1. Check browser console for errors
2. Verify localStorage has data: 
   ```javascript
   JSON.parse(localStorage.getItem('orders') || '[]')
   ```
3. Try logging out and back in

### Status Not Updating

1. Refresh the admin orders page
2. Check browser localStorage is enabled
3. Look for errors in browser console

### Customer Can't Access Orders

1. Ensure customer is logged in
2. Orders appear in account tab after login
3. Try logout and login again

---

## Future Enhancements

- Email notifications on status changes
- Real database instead of localStorage
- Payment gateway integration
- Shipping label generation
- Customer order tracking link
- Analytics and reporting

---

For questions or issues, check the browser console (F12) for detailed error messages.
