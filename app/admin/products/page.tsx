'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getProducts, deleteProduct, saveProduct, initializeStorage } from '@/lib/storage'
import { Product, Category, ProductSubcategory } from '@/lib/types'

export default function AdminProducts() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all')
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'jewellery',
    subcategory: 'rings',
    description: '',
    image: '',
    stock: 0,
  })

  useEffect(() => {
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('admin_logged_in')
    if (!isLoggedIn) {
      router.push('/admin')
      return
    }

    initializeStorage()
    setProducts(getProducts())
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? +value : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.category || !formData.subcategory || !formData.image) {
      alert('Please fill in all required fields')
      return
    }

    const product: Product = {
      id: editingId || `prod-${Date.now()}`,
      name: formData.name,
      price: formData.price,
      category: formData.category as Category,
      subcategory: formData.subcategory as ProductSubcategory,
      description: formData.description || '',
      image: formData.image,
      stock: formData.stock || 0,
    }

    saveProduct(product)
    const updated = getProducts()
    setProducts(updated)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      category: 'jewellery',
      subcategory: 'rings',
      description: '',
      image: '',
      stock: 0,
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (product: Product) => {
    setFormData(product)
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id)
      const updated = getProducts()
      setProducts(updated)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in')
    router.push('/admin')
  }

  const filteredProducts = filterCategory === 'all'
    ? products
    : products.filter(p => p.category === filterCategory)

  const subcategories: Record<Category, ProductSubcategory[]> = {
    jewellery: ['rings', 'necklaces', 'earrings', 'bracelets'],
    clothes: ['tops', 'bottoms', 'dresses', 'accessories'],
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold">LUXE Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium border border-border hover:bg-secondary transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
          <Link
            href="/admin/dashboard"
            className="py-4 px-4 border-b-2 border-transparent font-medium text-sm hover:border-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="py-4 px-4 border-b-2 border-foreground font-medium text-sm"
          >
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="py-4 px-4 border-b-2 border-transparent font-medium text-sm hover:border-foreground"
          >
            Orders
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-3xl font-bold">Products</h2>
          <button
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
            }}
            className="bg-foreground text-background px-6 py-2 font-medium hover:bg-accent hover:text-white transition-colors"
          >
            {showForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="border border-border p-8 mb-8 bg-secondary/30">
            <h3 className="font-semibold text-lg mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., Diamond Ring"
                  required
                  className="w-full px-4 py-2 border border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || 0}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-4 py-2 border border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category || 'jewellery'}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border bg-background text-foreground"
                >
                  <option value="jewellery">Jewellery</option>
                  <option value="clothes">Clothes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subcategory *</label>
                <select
                  name="subcategory"
                  value={formData.subcategory || 'rings'}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border bg-background text-foreground"
                >
                  {subcategories[formData.category as Category]?.map(sub => (
                    <option key={sub} value={sub}>{sub.charAt(0).toUpperCase() + sub.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock || 0}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  required
                  className="w-full px-4 py-2 border border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL *</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image || ''}
                  onChange={handleInputChange}
                  placeholder="/images/product.png"
                  required
                  className="w-full px-4 py-2 border border-border bg-background text-foreground"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  placeholder="Product description..."
                  rows={4}
                  className="w-full px-4 py-2 border border-border bg-background text-foreground"
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-foreground text-background px-6 py-2 font-medium hover:bg-accent hover:text-white transition-colors"
                >
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-border px-6 py-2 font-medium hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter */}
        <div className="mb-6 flex gap-4">
          <div>
            <label className="text-sm font-medium mr-2">Filter by Category:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as Category | 'all')}
              className="px-4 py-2 border border-border bg-background text-foreground"
            >
              <option value="all">All Products</option>
              <option value="jewellery">Jewellery</option>
              <option value="clothes">Clothes</option>
            </select>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredProducts.length} products
          </div>
        </div>

        {/* Products Table */}
        {filteredProducts.length === 0 ? (
          <div className="border border-border p-6 text-center text-muted-foreground">
            <p>No products found</p>
          </div>
        ) : (
          <div className="border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-secondary/30">
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-12 bg-secondary/30">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-sm capitalize">{product.subcategory}</td>
                    <td className="px-6 py-4 text-sm font-semibold">${product.price}</td>
                    <td className="px-6 py-4 text-sm">{product.stock}</td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-accent hover:text-foreground transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
