'use client'

import { useState, useEffect } from 'react'
import { getCoupons, saveCoupon, deleteCoupon } from '@/lib/storage'
import type { Coupon } from '@/lib/types'
import { Trash2, Plus, Edit2, Check, X } from 'lucide-react'

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    maxUses: undefined as number | undefined,
    minPurchase: undefined as number | undefined,
    expiresAt: '',
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const loaded = getCoupons()
    setCoupons(loaded)
    setMounted(true)
  }, [])

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.code || formData.value <= 0) {
      alert('Please fill in all required fields')
      return
    }

    if (editingId) {
      const coupon = coupons.find(c => c.id === editingId)
      if (coupon) {
        const updated = {
          ...coupon,
          code: formData.code,
          type: formData.type,
          value: formData.value,
          maxUses: formData.maxUses,
          minPurchase: formData.minPurchase,
          expiresAt: formData.expiresAt || undefined,
        }
        saveCoupon(updated)
        setCoupons(prev => prev.map(c => c.id === editingId ? updated : c))
      }
      setEditingId(null)
    } else {
      const newCoupon: Coupon = {
        id: `coupon-${Date.now()}`,
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: formData.value,
        maxUses: formData.maxUses,
        usedCount: 0,
        minPurchase: formData.minPurchase,
        isActive: true,
        expiresAt: formData.expiresAt || undefined,
        createdAt: new Date().toISOString(),
      }
      saveCoupon(newCoupon)
      setCoupons(prev => [...prev, newCoupon])
    }

    setFormData({
      code: '',
      type: 'percentage',
      value: 0,
      maxUses: undefined,
      minPurchase: undefined,
      expiresAt: '',
    })
    setShowForm(false)
  }

  const handleEdit = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      maxUses: coupon.maxUses,
      minPurchase: coupon.minPurchase,
      expiresAt: coupon.expiresAt || '',
    })
    setEditingId(coupon.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      deleteCoupon(id)
      setCoupons(prev => prev.filter(c => c.id !== id))
    }
  }

  if (!mounted) return <div>Loading...</div>

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold font-heading">Coupon Management</h1>
          <button
            onClick={() => {
              setEditingId(null)
              setFormData({ code: '', type: 'percentage', value: 0, maxUses: undefined, minPurchase: undefined, expiresAt: '' })
              setShowForm(!showForm)
            }}
            className="flex items-center gap-2 bg-foreground text-white px-4 py-2 rounded hover:bg-foreground/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Add Coupon'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg p-6 mb-8 border border-border">
            <form onSubmit={handleAddCoupon}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Coupon Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={e => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g., SAVE10"
                    className="w-full border border-border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full border border-border rounded px-3 py-2"
                  >
                    <option value="percentage">Percentage %</option>
                    <option value="fixed">Fixed $</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Value</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={e => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) }))}
                    placeholder="0"
                    className="w-full border border-border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Max Uses</label>
                  <input
                    type="number"
                    value={formData.maxUses || ''}
                    onChange={e => setFormData(prev => ({ ...prev, maxUses: e.target.value ? parseInt(e.target.value) : undefined }))}
                    placeholder="Unlimited"
                    className="w-full border border-border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Min Purchase</label>
                  <input
                    type="number"
                    value={formData.minPurchase || ''}
                    onChange={e => setFormData(prev => ({ ...prev, minPurchase: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    placeholder="No minimum"
                    className="w-full border border-border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={e => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                    className="w-full border border-border rounded px-3 py-2"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-foreground text-white px-6 py-2 rounded hover:bg-foreground/90 transition-colors"
              >
                {editingId ? 'Update Coupon' : 'Create Coupon'}
              </button>
            </form>
          </div>
        )}

        {/* Coupons List */}
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          {coupons.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No coupons created yet. Create your first coupon!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold">Code</th>
                    <th className="text-left px-6 py-3 font-semibold">Discount</th>
                    <th className="text-left px-6 py-3 font-semibold">Type</th>
                    <th className="text-left px-6 py-3 font-semibold">Uses</th>
                    <th className="text-left px-6 py-3 font-semibold">Min Purchase</th>
                    <th className="text-left px-6 py-3 font-semibold">Expires</th>
                    <th className="text-left px-6 py-3 font-semibold">Status</th>
                    <th className="text-right px-6 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map(coupon => (
                    <tr key={coupon.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-6 py-4 font-semibold text-foreground">{coupon.code}</td>
                      <td className="px-6 py-4">
                        {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                      </td>
                      <td className="px-6 py-4 text-sm">{coupon.type}</td>
                      <td className="px-6 py-4 text-sm">
                        {coupon.usedCount}/{coupon.maxUses || '∞'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {coupon.minPurchase ? `$${coupon.minPurchase}` : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                          coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {coupon.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="text-foreground hover:bg-muted p-2 rounded transition-colors"
                          title="Edit coupon"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="text-destructive hover:bg-destructive/10 p-2 rounded transition-colors"
                          title="Delete coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
