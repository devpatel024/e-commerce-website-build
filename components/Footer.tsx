export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border mt-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="animate-fade-in">
            <img src="/logos/ads-logo.png" alt="ADs Logo" className="h-8 w-auto mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover premium fashion and jewellery collections crafted with precision and passion.
            </p>
          </div>

          {/* Shop */}
          <div className="animate-fade-in delay-100">
            <h4 className="font-semibold mb-4 text-foreground">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/products?category=jewellery" className="text-muted-foreground hover:text-accent hover:translate-x-1 transition-all duration-300 inline-block">Jewellery</a></li>
              <li><a href="/products?category=clothes" className="text-muted-foreground hover:text-accent hover:translate-x-1 transition-all duration-300 inline-block">Clothes</a></li>
              <li><a href="/products" className="text-muted-foreground hover:text-accent hover:translate-x-1 transition-all duration-300 inline-block">All Products</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="animate-fade-in delay-200">
            <h4 className="font-semibold mb-4 text-foreground">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-accent hover:translate-x-1 transition-all duration-300 inline-block">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent hover:translate-x-1 transition-all duration-300 inline-block">Contact</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent hover:translate-x-1 transition-all duration-300 inline-block">Returns & FAQ</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="animate-fade-in delay-300">
            <h4 className="font-semibold mb-4 text-foreground">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-3">Subscribe for exclusive offers</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-sm border border-border bg-background rounded focus:outline-none focus:border-accent transition-colors"
              />
              <button className="px-4 py-2 bg-foreground text-background text-sm font-medium hover:bg-accent transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">&copy; {currentYear} ADs Luxury Collections. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-accent transition-colors">Shipping Info</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
