# LUXE - Fashion & Jewellery E-Commerce Store

A complete, full-featured e-commerce website for selling fashion and jewellery items, built with Next.js 16, React, TypeScript, and Tailwind CSS.

## Features

### Storefront (Customer-Facing)
- **Homepage** with hero banner, featured jewellery and clothes sections
- **Product Listing Page** with advanced filtering:
  - Filter by category (Jewellery, Clothes)
  - Filter by subcategory (rings, necklaces, earrings, bracelets, tops, bottoms, dresses, accessories)
  - Price range slider
  - Sort options (popular, price low-to-high, price high-to-low, newest)
- **Product Detail Page** with:
  - Large product images
  - Detailed descriptions
  - Size/variant selectors
  - Quantity adjustment
  - Add to cart functionality
- **Shopping Cart** with:
  - Item list with images and prices
  - Quantity adjustment
  - Remove items
  - Subtotal and tax calculation
- **Checkout Page** with:
  - Shipping information form (name, email, address, city, postal code)
  - Payment information form (card number, expiry, CVC)
  - Order summary with final total
- **Order Confirmation Page** showing order details and next steps
- **Responsive Design** optimized for mobile and desktop
- **Elegant Aesthetic** with luxury brand positioning using Playfair Display serif fonts and cream/black color scheme

### Admin Panel (Password Protected)
- **Admin Login** with password protection (password: `admin123`)
- **Dashboard** showing:
  - Total orders
  - Total revenue
  - Product count by category
  - Recent orders with status
- **Products Management**:
  - Add new products with name, price, category, subcategory, description, image URL, stock
  - Edit existing products
  - Delete products
  - Filter products by category
  - View product inventory
- **Orders Management**:
  - View all orders with customer information
  - Update order status (pending, processing, shipped, delivered)
  - View order details and items
  - Filter orders by status

## Project Structure

```
/app
  /admin
    /dashboard      # Admin dashboard
    /products       # Product management
    /orders         # Order management
    page.tsx        # Admin login
  /cart             # Shopping cart page
  /checkout         # Checkout page
  /product/[id]     # Product detail page
  /products         # Product listing page
  /order-confirmation/[id]  # Order confirmation
  layout.tsx        # Root layout
  page.tsx          # Homepage
  globals.css       # Global styles with design tokens

/components
  Header.tsx        # Navigation header
  Footer.tsx        # Footer

/lib
  types.ts          # TypeScript types
  storage.ts        # Data persistence (localStorage)

/public/images      # Product images (32 generated images)
```

## Technologies

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Fonts**: Playfair Display (headings), Geist (body)
- **Storage**: Browser localStorage for carts and orders (easily migratable to a real backend)
- **Image Generation**: AI-powered product images

## Color Scheme

- **Background**: Cream (#faf8f6)
- **Foreground**: Black (#1a1a1a)
- **Accent**: Warm Gold (#c4a47d)
- **Neutrals**: Light grays and whites for clean aesthetic

## Sample Data

The store comes pre-loaded with 32 sample products across two main categories:

### Jewellery (16 products)
- **Rings** (4): Emerald Engagement Ring, Minimalist Gold Band, Ruby Statement Ring, Sapphire Cocktail Ring
- **Necklaces** (4): Pearl Pendant, Diamond Solitaire, Gold Layered Chain, Emerald Chunky Choker
- **Earrings** (4): Diamond Studs, Pearl Drops, Sapphire Statement Drops, Gold Hoops
- **Bracelets** (4): Diamond Tennis Bracelet, Gold Bangle, Pearl Beaded Bracelet, Ruby Link Bracelet

### Clothes (16 products)
- **Tops** (4): Silk Charmeuse Blouse, White Cotton T-Shirt, Black Satin Camisole, Cashmere Turtleneck
- **Bottoms** (4): Black Tailored Trousers, High-Waisted Jeans, Camel Wool Skirt, White Linen Pants
- **Dresses** (4): Black Evening Gown, White Minimalist Dress, Champagne Midi Dress, Navy Wrap Dress
- **Accessories** (4): Silk Scarf, Leather Belt, Designer Sunglasses, Cashmere Shawl

## Getting Started

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Accessing Different Parts of the Site

**Storefront:**
- Homepage: `http://localhost:3000/`
- Products: `http://localhost:3000/products`
- Product Detail: `http://localhost:3000/product/[product-id]`
- Cart: `http://localhost:3000/cart`
- Checkout: `http://localhost:3000/checkout`

**Admin Panel:**
- Login: `http://localhost:3000/admin`
- Dashboard: `http://localhost:3000/admin/dashboard`
- Products: `http://localhost:3000/admin/products`
- Orders: `http://localhost:3000/admin/orders`

**Admin Password**: `admin123`

## Data Persistence

Currently, the application uses browser localStorage to persist:
- **Cart items**: `luxe_cart`
- **Orders**: `luxe_orders`
- **Products**: `luxe_products` (initialized with sample data)

The data structure is defined in `/lib/types.ts` and storage operations are in `/lib/storage.ts`.

### Migrating to Real Backend

To connect to a real database:

1. Install a database library (e.g., Prisma, Supabase, etc.)
2. Replace the localStorage calls in `/lib/storage.ts` with API calls
3. Create backend API routes in `/app/api/`
4. Update components to use the new API endpoints

## Key Features Implementation

### Shopping Cart
- Uses localStorage for persistence
- Updates cart count in header in real-time
- Supports quantity adjustments
- Calculates subtotal with tax (10%)

### Product Filtering
- Real-time filtering by category and subcategory
- Price range slider (0-$5000)
- Multiple sort options
- Responsive filter sidebar

### Admin Authentication
- Simple password-based login
- Session stored in localStorage
- Protected routes redirect to login if not authenticated
- Logout functionality

### Order Management
- Orders stored with customer information
- Status tracking (pending, processing, shipped, delivered)
- Order confirmation with full details
- Order history accessible in admin panel

## Responsive Design

The site is fully responsive and optimized for:
- **Mobile** (320px and up)
- **Tablet** (768px and up)
- **Desktop** (1024px and up)

Grid layouts use CSS Grid for complex arrangements and Flexbox for component layouts.

## Styling Highlights

- **Design tokens** in globals.css for consistent theming
- **Semantic HTML** for accessibility
- **Tailwind CSS v4** with custom color scheme
- **Responsive typography** using Tailwind's responsive prefixes
- **Hover effects** for interactive elements
- **Smooth transitions** for better UX

## Future Enhancements

Potential improvements for production:

1. **Backend Integration**
   - Connect to a real database (PostgreSQL, MongoDB, etc.)
   - Implement proper API routes with validation

2. **Authentication**
   - User registration and login
   - Order history for logged-in customers
   - Admin role-based access control

3. **Payments**
   - Integrate Stripe or Paypal for real payments
   - Order fulfillment workflow

4. **Performance**
   - Image optimization with Next.js Image component
   - Database indexing for faster queries
   - Caching strategies

5. **Analytics**
   - Track customer behavior
   - Monitor sales performance
   - Dashboard analytics

6. **Additional Features**
   - Product reviews and ratings
   - Wishlist functionality
   - Email notifications for orders
   - Search functionality
   - Product recommendations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created for demonstration purposes.

## Support

For issues or questions, please refer to the code documentation and comments within the files.
