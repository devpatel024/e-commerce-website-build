'use client'

import { useState, useEffect } from 'react'
import { getBackInStockAlerts, removeBackInStockAlert, getProductById, addBackInStockAlert } from '@/lib/storage'
import type { BackInStockAlert } from '@/lib/types'
import { Bell, Trash2, Plus, Check } from 'lucide-react'

export default function NotificationsPage() {
  const [alerts, setAlerts] = useState<BackInStockAlert[]>([])
  const [productEmail, setProductEmail] = useState('')
  const [productId, setProductId] = useState('')
  const [mounted, setMounted] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const loaded = getBackInStockAlerts()
    setAlerts(loaded)
    setMounted(true)
  }, [])

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault()

    if (!productEmail || !productId) {
      alert('Please fill in all fields')
      return
    }

    const newAlert: BackInStockAlert = {
      id: `alert-${Date.now()}`,
      productId,
      userEmail: productEmail,
      createdAt: new Date().toISOString(),
      notified: false,
    }

    addBackInStockAlert(newAlert)
    setAlerts(prev => [...prev, newAlert])
    setProductEmail('')
    setProductId('')
    setSubmitted(true)

    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleRemoveAlert = (id: string) => {
    removeBackInStockAlert(id)
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  if (!mounted) return <div>Loading...</div>

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-foreground text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-8 h-8" />
            <h1 className="text-4xl font-bold font-heading">Back-in-Stock Alerts</h1>
          </div>
          <p className="text-white/80">Get notified when your favorite out-of-stock items are available again</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Alert Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-border p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Alert
              </h2>

              <form onSubmit={handleAddAlert}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Product ID</label>
                  <input
                    type="text"
                    value={productId}
                    onChange={e => setProductId(e.target.value)}
                    placeholder="e.g., ring-001"
                    className="w-full border border-border rounded px-3 py-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Enter the product ID you want to track</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    value={productEmail}
                    onChange={e => setProductEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full border border-border rounded px-3 py-2"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-foreground text-white px-4 py-2 rounded hover:bg-foreground/90 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Set Alert
                </button>

                {submitted && (
                  <div className="mt-4 p-3 bg-green-100 text-green-800 rounded text-sm flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Alert created successfully!
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Alerts List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <div className="bg-white rounded-lg border border-border p-8 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Alerts Yet</h3>
                  <p className="text-muted-foreground">Create an alert to get notified when products are back in stock</p>
                </div>
              ) : (
                alerts.map(alert => {
                  const product = getProductById(alert.productId)
                  return (
                    <div
                      key={alert.id}
                      className="bg-white rounded-lg border border-border p-6 hover:border-foreground transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {product?.name || `Product ${alert.productId}`}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Product ID: {alert.productId}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          alert.notified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {alert.notified ? (
                            <>
                              <Check className="w-3 h-3" />
                              Notified
                            </>
                          ) : (
                            <>
                              <Bell className="w-3 h-3" />
                              Waiting
                            </>
                          )}
                        </span>
                      </div>

                      <div className="mb-4 p-3 bg-muted rounded">
                        <p className="text-sm">
                          <span className="font-semibold">Email:</span> {alert.userEmail}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created: {new Date(alert.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {product && (
                        <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                          <p className="text-sm">
                            <span className="font-semibold">Current Stock:</span>{' '}
                            {product.stock > 0 ? (
                              <span className="text-green-600 font-semibold">{product.stock} available</span>
                            ) : (
                              <span className="text-red-600 font-semibold">Out of Stock</span>
                            )}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => handleRemoveAlert(alert.id)}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded transition-colors inline-flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove Alert
                      </button>
                    </div>
                  )
                })
              )}
            </div>

            {/* Statistics */}
            {alerts.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-border p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{alerts.length}</div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                </div>
                <div className="bg-white rounded-lg border border-border p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {alerts.filter(a => a.notified).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Notified</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
