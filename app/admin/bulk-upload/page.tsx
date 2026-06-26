'use client'

import { useState } from 'react'
import { getProducts, saveProduct } from '@/lib/storage'
import type { Product, Category, ProductSubcategory, ProductBadge } from '@/lib/types'
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'

interface CSVProduct {
  id: string
  name: string
  price: number
  category: Category
  subcategory: ProductSubcategory
  description: string
  image: string
  stock: number
  originalPrice?: number
  badge?: ProductBadge
}

export default function BulkUploadPage() {
  const [csvContent, setCSVContent] = useState('')
  const [uploadedProducts, setUploadedProducts] = useState<CSVProduct[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState(false)
  const [validCategories] = useState<Category[]>(['jewellery', 'clothes'])
  const [validSubcategories] = useState<{ [key in Category]: ProductSubcategory[] }>({
    jewellery: ['rings', 'necklaces', 'earrings', 'bracelets'],
    clothes: ['tops', 'bottoms', 'dresses', 'accessories'],
  })

  const validateCSV = (content: string): { valid: boolean; products: CSVProduct[]; errors: string[] } => {
    const lines = content.trim().split('\n')
    const errors: string[] = []
    const products: CSVProduct[] = []

    if (lines.length < 2) {
      errors.push('CSV must have header row and at least one product')
      return { valid: false, products: [], errors }
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const requiredHeaders = ['id', 'name', 'price', 'category', 'subcategory', 'description', 'image', 'stock']

    for (const required of requiredHeaders) {
      if (!headers.includes(required)) {
        errors.push(`Missing required column: ${required}`)
      }
    }

    if (errors.length > 0) {
      return { valid: false, products: [], errors }
    }

    const categoryIndex = headers.indexOf('category')
    const subcategoryIndex = headers.indexOf('subcategory')
    const priceIndex = headers.indexOf('price')
    const stockIndex = headers.indexOf('stock')
    const idIndex = headers.indexOf('id')
    const nameIndex = headers.indexOf('name')
    const descIndex = headers.indexOf('description')
    const imageIndex = headers.indexOf('image')
    const originalPriceIndex = headers.indexOf('originalPrice')
    const badgeIndex = headers.indexOf('badge')

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())

      if (values.length < requiredHeaders.length) {
        errors.push(`Row ${i + 1}: Missing required columns`)
        continue
      }

      const category = values[categoryIndex] as Category
      const subcategory = values[subcategoryIndex] as ProductSubcategory
      const price = parseFloat(values[priceIndex])
      const stock = parseInt(values[stockIndex])

      if (!validCategories.includes(category)) {
        errors.push(`Row ${i + 1}: Invalid category. Must be: ${validCategories.join(', ')}`)
        continue
      }

      if (!validSubcategories[category].includes(subcategory)) {
        errors.push(`Row ${i + 1}: Invalid subcategory for ${category}`)
        continue
      }

      if (isNaN(price) || price < 0) {
        errors.push(`Row ${i + 1}: Invalid price`)
        continue
      }

      if (isNaN(stock) || stock < 0) {
        errors.push(`Row ${i + 1}: Invalid stock quantity`)
        continue
      }

      const VALID_BADGES = ['new', 'bestseller', 'sale', 'trending', 'limited', 'exclusive']
      const badgeValue = badgeIndex !== -1 ? values[badgeIndex] : undefined
      const badge = badgeValue && VALID_BADGES.includes(badgeValue) ? (badgeValue as ProductBadge) : undefined

      const product: CSVProduct = {
        id: values[idIndex],
        name: values[nameIndex],
        price,
        category,
        subcategory,
        description: values[descIndex],
        image: values[imageIndex],
        stock,
        originalPrice: originalPriceIndex !== -1 ? parseFloat(values[originalPriceIndex]) : undefined,
        badge,
      }

      products.push(product)
    }

    return {
      valid: errors.length === 0,
      products,
      errors,
    }
  }

  const handleParse = () => {
    if (!csvContent.trim()) {
      setErrors(['Please paste CSV content'])
      return
    }

    const result = validateCSV(csvContent)
    setErrors(result.errors)
    setUploadedProducts(result.products)
  }

  const handleUpload = () => {
    if (uploadedProducts.length === 0) {
      setErrors(['No valid products to upload'])
      return
    }

    const existingProducts = getProducts()
    let addedCount = 0
    let updatedCount = 0

    uploadedProducts.forEach(csvProduct => {
      const existing = existingProducts.find(p => p.id === csvProduct.id)

      if (existing) {
        updatedCount++
      } else {
        addedCount++
      }

      const validBadges: ProductBadge[] = ['new', 'bestseller', 'sale', 'trending', 'limited', 'exclusive']
      const badge = csvProduct.badge && validBadges.includes(csvProduct.badge as ProductBadge)
        ? (csvProduct.badge as ProductBadge)
        : undefined

      const product: Product = {
        id: csvProduct.id,
        name: csvProduct.name,
        price: csvProduct.price,
        category: csvProduct.category,
        subcategory: csvProduct.subcategory,
        description: csvProduct.description,
        image: csvProduct.image,
        stock: csvProduct.stock,
        originalPrice: csvProduct.originalPrice,
        badge,
        reviews: [],
      }

      saveProduct(product)
    })

    setSuccess(true)
    setErrors([])
    setCSVContent('')
    setUploadedProducts([])

    setTimeout(() => setSuccess(false), 5000)
  }

  const downloadTemplate = () => {
    const headers = 'id,name,price,originalPrice,category,subcategory,description,image,stock,badge'
    const example = 'ring-new-001,Sapphire Engagement Ring,3500,4000,jewellery,rings,Stunning sapphire ring,/images/ring-new.png,5,new'

    const csv = `${headers}\n${example}`
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv))
    element.setAttribute('download', 'product_template.csv')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-heading mb-4 flex items-center gap-3">
            <Upload className="w-8 h-8" />
            Bulk Product Upload
          </h1>
          <p className="text-muted-foreground">Upload multiple products at once using CSV format</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Instructions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-border p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Instructions</h2>

              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold mb-2">1. Download Template</h3>
                  <button
                    onClick={downloadTemplate}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Download CSV Template
                  </button>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">2. Fill in Your Products</h3>
                  <p className="text-muted-foreground">Add your product data to the CSV file</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3. Valid Categories</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• jewellery</li>
                    <li>• clothes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">4. Valid Subcategories</h3>
                  <div className="text-muted-foreground space-y-1">
                    <p className="font-semibold text-foreground text-xs">Jewellery:</p>
                    <p className="pl-2">rings, necklaces, earrings, bracelets</p>
                    <p className="font-semibold text-foreground text-xs mt-2">Clothes:</p>
                    <p className="pl-2">tops, bottoms, dresses, accessories</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">5. Paste & Upload</h3>
                  <p className="text-muted-foreground">Paste your CSV content and click parse to validate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* CSV Input */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Paste CSV Content
              </h2>

              <textarea
                value={csvContent}
                onChange={e => setCSVContent(e.target.value)}
                placeholder="id,name,price,originalPrice,category,subcategory,description,image,stock,badge&#10;ring-new-001,Sapphire Ring,3500,4000,jewellery,rings,Stunning sapphire,/images/ring.png,5,new"
                className="w-full h-32 border border-border rounded px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleParse}
                  className="flex-1 bg-foreground text-white px-4 py-2 rounded hover:bg-foreground/90 transition-colors font-semibold"
                >
                  Parse CSV
                </button>
                <button
                  onClick={downloadTemplate}
                  className="flex-1 bg-muted text-muted-foreground px-4 py-2 rounded hover:bg-muted/80 transition-colors font-semibold"
                >
                  Download Template
                </button>
              </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Validation Errors
                </h3>
                <ul className="space-y-1 text-sm text-red-700">
                  {errors.map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Upload Successful!
                </h3>
                <p className="text-sm text-green-700">Products have been imported successfully</p>
              </div>
            )}

            {/* Preview */}
            {uploadedProducts.length > 0 && (
              <div className="bg-white rounded-lg border border-border p-6">
                <h2 className="text-xl font-bold mb-4">Preview ({uploadedProducts.length} products)</h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="text-left px-3 py-2 font-semibold">ID</th>
                        <th className="text-left px-3 py-2 font-semibold">Name</th>
                        <th className="text-left px-3 py-2 font-semibold">Price</th>
                        <th className="text-left px-3 py-2 font-semibold">Category</th>
                        <th className="text-left px-3 py-2 font-semibold">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedProducts.slice(0, 10).map(product => (
                        <tr key={product.id} className="border-b border-border hover:bg-muted/50">
                          <td className="px-3 py-2 font-semibold">{product.id}</td>
                          <td className="px-3 py-2">{product.name}</td>
                          <td className="px-3 py-2">${product.price}</td>
                          <td className="px-3 py-2">{product.subcategory}</td>
                          <td className="px-3 py-2">{product.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {uploadedProducts.length > 10 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    ... and {uploadedProducts.length - 10} more products
                  </p>
                )}

                <button
                  onClick={handleUpload}
                  className="mt-4 w-full bg-foreground text-white px-4 py-2 rounded hover:bg-foreground/90 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload {uploadedProducts.length} Product{uploadedProducts.length !== 1 ? 's' : ''}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
