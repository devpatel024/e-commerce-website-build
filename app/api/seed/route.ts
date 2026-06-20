import { db } from '@/lib/db'
import { product } from '@/lib/db/schema'

const sampleProducts = [
  // Jewelry - Rings
  {
    name: 'Emerald Cut Diamond Ring',
    description: 'Elegant emerald cut diamond engagement ring with 18K gold band',
    price: '2499.00',
    image: '/images/ring-1.png',
    category: 'jewellery',
    subcategory: 'rings',
    stock: 15,
  },
  {
    name: 'Minimalist Gold Band',
    description: 'Simple elegant gold band ring, sophisticated and timeless',
    price: '899.00',
    image: '/images/ring-2.png',
    category: 'jewellery',
    subcategory: 'rings',
    stock: 20,
  },
  {
    name: 'Ruby Statement Ring',
    description: 'Bold ruby statement ring with diamond accents',
    price: '1899.00',
    image: '/images/ring-3.png',
    category: 'jewellery',
    subcategory: 'rings',
    stock: 10,
  },
  {
    name: 'Sapphire Cocktail Ring',
    description: 'Luxury sapphire cocktail ring with white diamond halo',
    price: '3299.00',
    image: '/images/ring-4.png',
    category: 'jewellery',
    subcategory: 'rings',
    stock: 8,
  },
  // Jewelry - Necklaces
  {
    name: 'Pearl Pendant Necklace',
    description: 'Elegant pearl pendant necklace on delicate gold chain',
    price: '1299.00',
    image: '/images/necklace-1.png',
    category: 'jewellery',
    subcategory: 'necklaces',
    stock: 18,
  },
  {
    name: 'Diamond Solitaire Necklace',
    description: 'Diamond solitaire necklace pendant on 18K white gold chain',
    price: '2199.00',
    image: '/images/necklace-2.png',
    category: 'jewellery',
    subcategory: 'necklaces',
    stock: 12,
  },
  {
    name: 'Multi-Strand Gold Chain',
    description: 'Multi-strand layered gold chain necklace, modern chic design',
    price: '799.00',
    image: '/images/necklace-3.png',
    category: 'jewellery',
    subcategory: 'necklaces',
    stock: 25,
  },
  {
    name: 'Emerald Chunky Choker',
    description: 'Bold emerald chunky choker necklace with deep green gemstone',
    price: '1599.00',
    image: '/images/necklace-4.png',
    category: 'jewellery',
    subcategory: 'necklaces',
    stock: 9,
  },
  // Jewelry - Earrings
  {
    name: 'Classic Diamond Studs',
    description: 'Classic diamond stud earrings, essential collection piece',
    price: '1399.00',
    image: '/images/earring-1.png',
    category: 'jewellery',
    subcategory: 'earrings',
    stock: 30,
  },
  {
    name: 'Pearl Drop Earrings',
    description: 'Elegant pearl drop earrings on gold wires',
    price: '699.00',
    image: '/images/earring-2.png',
    category: 'jewellery',
    subcategory: 'earrings',
    stock: 16,
  },
  {
    name: 'Blue Sapphire Drops',
    description: 'Bold blue sapphire statement drop earrings',
    price: '1199.00',
    image: '/images/earring-3.png',
    category: 'jewellery',
    subcategory: 'earrings',
    stock: 11,
  },
  {
    name: 'Gold Hoop Earrings',
    description: 'Timeless gold hoop earrings, versatile and stylish',
    price: '499.00',
    image: '/images/earring-4.png',
    category: 'jewellery',
    subcategory: 'earrings',
    stock: 28,
  },
  // Jewelry - Bracelets
  {
    name: 'Diamond Tennis Bracelet',
    description: 'Luxurious diamond tennis bracelet in 18K gold',
    price: '2799.00',
    image: '/images/bracelet-1.png',
    category: 'jewellery',
    subcategory: 'bracelets',
    stock: 7,
  },
  {
    name: 'Simple Gold Bangle',
    description: 'Simple elegant gold bangle bracelet',
    price: '599.00',
    image: '/images/bracelet-2.png',
    category: 'jewellery',
    subcategory: 'bracelets',
    stock: 22,
  },
  {
    name: 'Pearl Beaded Bracelet',
    description: 'Delicate pearl beaded bracelet on silk thread',
    price: '899.00',
    image: '/images/bracelet-3.png',
    category: 'jewellery',
    subcategory: 'bracelets',
    stock: 14,
  },
  {
    name: 'Ruby Link Bracelet',
    description: 'Stunning ruby link bracelet with diamonds',
    price: '1999.00',
    image: '/images/bracelet-4.png',
    category: 'jewellery',
    subcategory: 'bracelets',
    stock: 6,
  },
  // Clothes - Tops
  {
    name: 'Silk Charmeuse Blouse',
    description: 'Luxurious silk charmeuse blouse with elegant drape',
    price: '349.00',
    image: '/images/top-1.png',
    category: 'clothes',
    subcategory: 'tops',
    stock: 24,
  },
  {
    name: 'Premium White T-Shirt',
    description: 'Premium quality white cotton t-shirt',
    price: '89.00',
    image: '/images/top-2.png',
    category: 'clothes',
    subcategory: 'tops',
    stock: 50,
  },
  {
    name: 'Black Satin Camisole',
    description: 'Elegant black satin camisole',
    price: '199.00',
    image: '/images/top-3.png',
    category: 'clothes',
    subcategory: 'tops',
    stock: 18,
  },
  {
    name: 'Cashmere Turtleneck',
    description: 'Luxurious cashmere turtleneck',
    price: '449.00',
    image: '/images/top-4.png',
    category: 'clothes',
    subcategory: 'tops',
    stock: 12,
  },
  // Clothes - Bottoms
  {
    name: 'Tailored Black Trousers',
    description: 'Impeccably tailored black trousers',
    price: '229.00',
    image: '/images/bottom-1.png',
    category: 'clothes',
    subcategory: 'bottoms',
    stock: 19,
  },
  {
    name: 'Classic High-Waisted Jeans',
    description: 'Classic high-waisted blue jeans with flattering cut',
    price: '149.00',
    image: '/images/bottom-2.png',
    category: 'clothes',
    subcategory: 'bottoms',
    stock: 35,
  },
  {
    name: 'Camel Wool Midi Skirt',
    description: 'Elegant camel wool midi skirt',
    price: '279.00',
    image: '/images/bottom-3.png',
    category: 'clothes',
    subcategory: 'bottoms',
    stock: 15,
  },
  {
    name: 'White Linen Pants',
    description: 'Breathable white linen pants, perfect for summer',
    price: '189.00',
    image: '/images/bottom-4.png',
    category: 'clothes',
    subcategory: 'bottoms',
    stock: 22,
  },
  // Clothes - Dresses
  {
    name: 'Black Silk Evening Gown',
    description: 'Stunning black silk evening gown for special occasions',
    price: '899.00',
    image: '/images/dress-1.png',
    category: 'clothes',
    subcategory: 'dresses',
    stock: 5,
  },
  {
    name: 'White Minimalist Dress',
    description: 'Clean modern white minimalist dress',
    price: '349.00',
    image: '/images/dress-2.png',
    category: 'clothes',
    subcategory: 'dresses',
    stock: 20,
  },
  {
    name: 'Champagne Silk Midi Dress',
    description: 'Soft champagne silk midi dress, romantic and elegant',
    price: '549.00',
    image: '/images/dress-3.png',
    category: 'clothes',
    subcategory: 'dresses',
    stock: 13,
  },
  {
    name: 'Navy Wrap Dress',
    description: 'Classic navy wrap dress, versatile and flattering',
    price: '299.00',
    image: '/images/dress-4.png',
    category: 'clothes',
    subcategory: 'dresses',
    stock: 26,
  },
  // Clothes - Accessories
  {
    name: 'Luxury Silk Scarf',
    description: 'Luxurious silk scarf in elegant print',
    price: '199.00',
    image: '/images/accessory-1.png',
    category: 'clothes',
    subcategory: 'accessories',
    stock: 32,
  },
  {
    name: 'Premium Leather Belt',
    description: 'Premium leather belt, luxury leather with classic design',
    price: '149.00',
    image: '/images/accessory-2.png',
    category: 'clothes',
    subcategory: 'accessories',
    stock: 28,
  },
  {
    name: 'Designer Sunglasses',
    description: 'Chic designer sunglasses with UV protection',
    price: '349.00',
    image: '/images/accessory-3.png',
    category: 'clothes',
    subcategory: 'accessories',
    stock: 17,
  },
  {
    name: 'Cashmere Shawl',
    description: 'Soft cashmere shawl in luxurious fabric',
    price: '299.00',
    image: '/images/accessory-4.png',
    category: 'clothes',
    subcategory: 'accessories',
    stock: 11,
  },
]

export async function GET() {
  try {
    // Check if products already exist
    const existingProducts = await db.select().from(product)
    
    if (existingProducts.length > 0) {
      return Response.json({
        message: 'Products already seeded',
        count: existingProducts.length,
      })
    }

    // Insert sample products
    await db.insert(product).values(sampleProducts)

    return Response.json({
      message: 'Database seeded successfully',
      count: sampleProducts.length,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return Response.json({ error: 'Seed failed' }, { status: 500 })
  }
}
