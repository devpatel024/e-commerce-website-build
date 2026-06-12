export default function Footer() {
  return (
    <footer className="border-t border-border mt-16 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">LUXE</h3>
            <p className="text-sm text-muted-foreground">
              Discover premium fashion and jewellery collections. Elegant, timeless pieces for the modern aesthetic.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/products?category=jewellery" className="hover:text-accent transition-colors">Jewellery</a></li>
              <li><a href="/products?category=clothes" className="hover:text-accent transition-colors">Clothes</a></li>
              <li><a href="/products" className="hover:text-accent transition-colors">All Products</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Customer Service</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Returns</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 LUXE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
