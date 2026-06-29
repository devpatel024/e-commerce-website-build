# Luxury Design System Implementation Guide

## Overview
This guide provides developers with a comprehensive reference for applying the luxury aesthetic across all AD e-commerce components. All styling is CSS/Tailwind only—zero functional changes.

## Color Palette

### Primary Colors
- **Background**: `#F3E4C9` (cream)
- **Foreground**: `#8A5F41` (warm brown)
- **Primary**: `#8A5F41` (warm brown)
- **Secondary**: `#A77F60` (light brown)
- **Muted**: `#CCD67F` (sage green)

### Luxury Accents
- **Gold Luxury**: `#C9A876` (champagne-gold)
- **Gold Light**: `#E8D4B8` (soft gold)
- **Gold Dark**: `#A68559` (deep gold)

### CSS Variables
```css
--gold-luxury: #C9A876;
--gold-light: #E8D4B8;
--gold-dark: #A68559;
```

## Typography

### Hierarchy
- **H1/Headlines**: 48-64px, serif (Playfair Display), tight leading
- **H2/Sections**: 32-48px, serif (Playfair Display)
- **H3/Subsections**: 24-32px, serif (Playfair Display)
- **Body**: 16px, sans-serif (Geist), 1.6 line-height
- **Labels**: 12px, uppercase, 0.1em letter-spacing

### Classes to Use
```html
<!-- Serif Display Font (Headlines) -->
<h1 class="font-serif-display text-6xl md:text-7xl lg:text-8xl leading-tight">Timeless Elegance</h1>

<!-- Large Display Text -->
<h2 class="text-display-large">Premium Collections</h2>

<!-- Medium Display -->
<h3 class="text-display-medium">Featured Items</h3>

<!-- Uppercase Labels -->
<span class="text-label-uppercase">New Arrival</span>

<!-- Body Text -->
<p class="leading-relaxed">Product description...</p>
```

## Button Styles

### Pill-Shaped Buttons (All Buttons)
All buttons should be pill-shaped (`rounded-full`) with 300-500ms luxury transitions.

```html
<!-- Primary Button (Filled) -->
<button class="btn-luxury-primary">
  Shop Now
</button>

<!-- Secondary Button (Outline) -->
<button class="btn-luxury-secondary">
  Learn More
</button>

<!-- Ghost Button (Text Only) -->
<button class="btn-luxury-ghost">
  Explore
</button>

<!-- Manual Implementation -->
<button class="px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-gold-luxury transition-luxury">
  Custom Button
</button>
```

## Cards & Surfaces

### Card Styling
```html
<!-- Luxury Card -->
<div class="card-luxury bg-white">
  <img src="/product.jpg" class="img-luxury mb-6" alt="Product" />
  <h3 class="text-2xl font-serif-display mb-3">Product Name</h3>
  <p class="text-muted-foreground mb-6">Description</p>
  <button class="btn-luxury-primary">View Details</button>
</div>

<!-- Manual Card Implementation -->
<div class="rounded-2xl p-8 shadow-refined hover:shadow-luxury transition-luxury">
  <!-- Content -->
</div>
```

### Shadow Utilities
```css
.shadow-refined { /* 0 1px 3px rgba(0,0,0,0.08) */ }
.shadow-luxury { /* 0 4px 12px rgba(0,0,0,0.12) */ }
```

## Spacing

### Luxury Spacing Classes
```html
<!-- Add significant whitespace between sections -->
<div class="py-luxury">
  <!-- 12rem top/bottom on mobile, 20rem on desktop -->
</div>

<div class="px-luxury">
  <!-- 1.5rem sides on mobile, 3rem on desktop -->
</div>

<div class="space-y-luxury">
  <!-- 2rem gap on mobile, 3rem on desktop -->
</div>
```

### Padding Guidelines
- **Sections**: 60px-80px vertical (use `py-luxury`)
- **Cards**: 24px-32px internal (use `p-6` to `p-8`)
- **Buttons**: 12px-16px internal (use `py-3` with `px-6`)

## Images

### Photography-Led Layouts
```html
<!-- Hero Image (Full Viewport) -->
<div class="relative w-full h-screen overflow-hidden">
  <img src="/hero.jpg" class="img-hero" alt="Hero" />
  <!-- Overlay content -->
</div>

<!-- Product Images (Card Context) -->
<img src="/product.jpg" class="img-luxury rounded-2xl" alt="Product" />

<!-- Manual Image Styling -->
<img src="/image.jpg" class="w-full rounded-2xl object-cover shadow-refined hover:shadow-luxury transition-luxury" />
```

## Transitions & Animations

### Smooth Transitions
```html
<!-- 300ms transitions (default) -->
<button class="transition-smooth hover:bg-gold-luxury">Hover me</button>

<!-- 500ms luxury transitions -->
<div class="transition-luxury hover:shadow-luxury">Elegant hover</div>

<!-- Fast transitions (150ms) -->
<input class="transition-fast" />
```

### Link Underline Animation
```html
<!-- Animated underline on hover -->
<a href="#" class="link-underline">Hover for animation</a>
```

## Inputs & Forms

### Input Styling
```html
<!-- Minimal Input -->
<input 
  type="text" 
  class="w-full px-4 py-3 rounded-xl border border-gold-luxury/30 bg-white text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-gold-luxury/50 focus:border-gold-luxury transition-luxury"
  placeholder="Enter text..."
/>

<!-- Textarea -->
<textarea 
  class="w-full px-4 py-3 rounded-xl border border-gold-luxury/30 bg-white text-foreground focus:ring-2 focus:ring-gold-luxury/50 transition-luxury"
  placeholder="Your message..."
></textarea>

<!-- Select -->
<select 
  class="w-full px-4 py-3 rounded-xl border border-gold-luxury/30 bg-white text-foreground focus:ring-2 focus:ring-gold-luxury/50 transition-luxury"
>
  <option>Choose option</option>
</select>
```

## Component Examples

### Product Card (Complete)
```html
<div class="card-luxury bg-white">
  <!-- Image -->
  <div class="relative overflow-hidden rounded-2xl mb-6">
    <img src="/product.jpg" class="img-luxury w-full aspect-square" alt="Product" />
  </div>
  
  <!-- Content -->
  <div class="space-y-3 mb-6">
    <span class="text-label-uppercase text-gold-luxury">New Collection</span>
    <h3 class="text-2xl font-serif-display leading-tight">Premium Jacket</h3>
    <p class="text-muted-foreground text-sm leading-relaxed">
      Handcrafted with premium materials and modern design
    </p>
  </div>
  
  <!-- Price & Action -->
  <div class="flex items-center justify-between">
    <span class="text-xl font-semibold text-foreground">$299</span>
    <button class="btn-luxury-primary">Add to Cart</button>
  </div>
</div>
```

### Newsletter Signup (Complete)
```html
<section class="py-luxury px-luxury">
  <div class="max-w-2xl mx-auto text-center space-y-6">
    <h2 class="text-display-medium">Join Our Community</h2>
    <p class="text-lg text-muted-foreground">
      Get exclusive offers and styling tips delivered to your inbox
    </p>
    
    <form class="flex flex-col sm:flex-row gap-3 mt-8">
      <input 
        type="email" 
        class="flex-1 px-6 py-3 rounded-full border border-gold-luxury/30 bg-white focus:ring-2 focus:ring-gold-luxury/50 transition-luxury"
        placeholder="your@email.com"
      />
      <button class="btn-luxury-primary whitespace-nowrap">Subscribe</button>
    </form>
  </div>
</section>
```

## Pages Styling Checklist

### Homepage
- [ ] Hero section with `text-6xl md:text-7xl` headline
- [ ] `py-luxury` on all section containers
- [ ] Product cards use `card-luxury` class
- [ ] Buttons use `btn-luxury-*` classes
- [ ] Images use `img-luxury` class with rounded-2xl

### Product Detail Page
- [ ] Hero image with full viewport height
- [ ] H1 headline at 48-64px with serif font
- [ ] Generous spacing between sections (py-8 to py-12)
- [ ] Buttons pill-shaped with `btn-luxury-primary`
- [ ] Stock status badge with gold border

### Product Listing
- [ ] Product grid with consistent `card-luxury` styling
- [ ] Filters use `btn-luxury-secondary` style
- [ ] Images 1:1 aspect ratio with rounded-2xl
- [ ] Smooth hover animations on cards

### Checkout & Cart
- [ ] Form inputs with rounded-full and gold borders
- [ ] Buttons all `btn-luxury-primary` with pill shape
- [ ] Summary cards use `card-luxury`
- [ ] Generous spacing between form sections

### Admin Panel
- [ ] Tables use refined shadows (`shadow-refined`)
- [ ] Buttons use `btn-luxury-*` classes
- [ ] Cards use `card-luxury` for consistency
- [ ] Keep darker admin aesthetic but refine edges

## Testing Checklist

After applying luxury styling:
- [ ] All buttons are pill-shaped (rounded-full)
- [ ] Gold accents appear on hover states
- [ ] Transitions are 300-500ms smooth
- [ ] Spacing feels generous (50% more than original)
- [ ] Typography hierarchy is clear
- [ ] Images are rounded-2xl with shadows
- [ ] Shadows are subtle (0 1px 3px or 0 4px 12px)
- [ ] Forms have gold borders and focus rings
- [ ] Mobile responsive (320px+)
- [ ] All functionality still works (auth, cart, checkout, etc.)

## Common Patterns

### Hover States
```css
/* Luxury hover for any element */
.hover:transition-luxury.hover:shadow-luxury
.hover:border-gold-luxury
.hover:bg-gold-light/20
```

### Focus States
```css
/* Inputs and interactive elements */
.focus:ring-2.focus:ring-gold-luxury/50
.focus:border-gold-luxury
```

### Text Colors
```css
/* Primary text */
class="text-foreground"

/* Secondary/muted text */
class="text-muted-foreground"

/* Accent/highlighted text */
class="text-gold-luxury"
```

## Responsive Considerations

- Mobile: Base sizing, minimal padding (px-4)
- Tablet: Increased padding (px-6), larger text
- Desktop: Full luxury spacing (px-12, py-20), maximum typography

Use Tailwind breakpoints: `md:` (768px), `lg:` (1024px), `xl:` (1280px)

## Performance Notes

- Transitions use `transition-luxury` for consistent 500ms duration
- No excessive animations or auto-playing videos
- Images are lazy-loaded where possible
- Shadows are GPU-accelerated (box-shadow, not filter)

---

**Last Updated**: June 2026
**Version**: 1.0 - Initial Luxury System
