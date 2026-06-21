'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthContext } from '@/components/AuthProvider'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { getProducts, deleteProduct, saveProduct, initializeStorage } from '@/lib/storage'
import { Product } from '@/lib/types'
import { X, Plus, Edit2, Trash2, LogOut } from 'lucide-react'
import { formatPrice } from '@/lib/price-formatter'

export default function AdminProductsPage() {
  const router = useRouter()
  const { user, logout } = useAuthContext()
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'jewellery',
    subcategory: 'rings',
    description: '',
    image: '',
    stock: 0,
  })
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    if (user?.role === 'admin') {
      initializeStorage()
      setProducts(getProducts())
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? +value : value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setFormData(prev => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
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
      category: formData.category as 'jewellery' | 'clothes',
      subcategory: formData.subcategory as string,
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
    setImagePreview('')
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (product: Product) => {
    setFormData(product)
    setImagePreview(product.image)
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
    logout()
    router.push('/auth/login')
  }

  const filteredProducts = filterCategory === 'all' 
    ? products 
    : products.filter(p => p.category === filterCategory)

  const jewelryCount = products.filter(p => p.category === 'jewellery').length
  const clothesCount = products.filter(p => p.category === 'clothes').length

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <Link href="/admin/dashboard" className="font-heading text-2xl font-bold mb-1">LUXE Admin</Link>
              <p className="text-sm text-muted-foreground">Products Management</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-border hover:bg-secondary transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="border border-border p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Products</p>
              <p className="font-heading text-3xl font-bold">{products.length}</p>
            </div>
            <div className="border border-border p-6">
              <p className="text-sm text-muted-foreground mb-1">Jewellery</p>
              <p className="font-heading text-3xl font-bold">{jewelryCount}</p>
            </div>
            <div className="border border-border p-6">
              <p className="text-sm text-muted-foreground mb-1">Clothes</p>
              <p className="font-heading text-3xl font-bold">{clothesCount}</p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  filterCategory === 'all'
                    ? 'bg-foreground text-background'
                    : 'border border-border hover:bg-secondary'
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => setFilterCategory('jewellery')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  filterCategory === 'jewellery'
                    ? 'bg-foreground text-background'
                    : 'border border-border hover:bg-secondary'
                }`}
              >
                Jewellery
              </button>
              <button
                onClick={() => setFilterCategory('clothes')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  filterCategory === 'clothes'
                    ? 'bg-foreground text-background'
                    : 'border border-border hover:bg-secondary'
                }`}
              >
                Clothes
              </button>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-foreground text-background px-6 py-2 font-semibold hover:bg-accent transition-colors"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>

          {/* Add/Edit Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 flex justify-between items-center p-6 border-b border-border bg-card">
                  <h2 className="font-heading text-2xl font-bold">
                    {editingId ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-secondary transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                        className="w-full px-4 py-2 border border-border bg-background focus:outline-none focus:border-foreground"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Price *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price || 0}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full px-4 py-2 border border-border bg-background focus:outline-none focus:border-foreground"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <select
                        name="category"
                        value={formData.category || 'jewellery'}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border bg-background focus:outline-none focus:border-foreground"
                      >
                        <option value="jewellery">Jewellery</option>
                        <option value="clothes">Clothes</option>
                      </select>
                    </div>

                    {/* Subcategory */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Subcategory *</label>
                      <select
                        name="subcategory"
                        value={formData.subcategory || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border bg-background focus:outline-none focus:border-foreground"
                      >
                        {formData.category === 'jewellery' ? (
                          <>
                            <option value="rings">Rings</option>
                            <option value="necklaces">Necklaces</option>
                            <option value="earrings">Earrings</option>
                            <option value="bracelets">Bracelets</option>
                          </>
                        ) : (
                          <>
                            <option value="tops">Tops</option>
                            <option value="bottoms">Bottoms</option>
                            <option value="dresses">Dresses</option>
                            <option value="accessories">Accessories</option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock || 0}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="w-full px-4 py-2 border border-border bg-background focus:outline-none focus:border-foreground"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      placeholder="Product description"
                      rows={4}
                      className="w-full px-4 py-2 border border-border bg-background focus:outline-none focus:border-foreground"
                    />
                  </div>

                  {/* Image */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Image *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-border bg-background focus:outline-none focus:border-foreground"
                    />
                    {imagePreview && (
                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                        <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-foreground text-background py-3 font-semibold hover:bg-accent transition-colors"
                    >
                      {editingId ? 'Update Product' : 'Add Product'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 border border-border py-3 font-semibold hover:bg-secondary transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="border border-border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 bg-secondary/30 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.subcategory}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm capitalize">{product.category}</td>
                    <td className="px-6 py-4 font-semibold">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded ${
                        product.stock > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 hover:bg-secondary transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-red-100 text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-muted-foreground">No products found in this category</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
