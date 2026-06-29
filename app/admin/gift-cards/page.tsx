'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Trash2, Copy } from 'lucide-react'

interface GiftCard {
  id: string
  code: string
  denomination: number
  balance: number
  isRedeemed: boolean
  redeemedBy?: string
  redeemedAt?: string
  createdAt: string
  expiresAt?: string
}

export default function AdminGiftCardsPage() {
  const router = useRouter()
  const [giftCards, setGiftCards] = useState<GiftCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [denomination, setDenomination] = useState('500')
  const [quantity, setQuantity] = useState('10')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    fetchGiftCards()
  }, [])

  const fetchGiftCards = async () => {
    try {
      const response = await fetch('/api/admin/gift-cards')
      if (!response.ok) throw new Error('Failed to fetch gift cards')
      const data = await response.json()
      setGiftCards(data)
    } catch (error) {
      console.error('[v0] Error fetching gift cards:', error)
      setErrorMessage('Failed to load gift cards')
    } finally {
      setIsLoading(false)
    }
  }

  const generateGiftCards = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/gift-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          denomination: parseFloat(denomination),
          quantity: parseInt(quantity),
        }),
      })

      if (!response.ok) throw new Error('Failed to generate gift cards')

      setSuccessMessage(`Generated ${quantity} gift cards successfully!`)
      setDenomination('500')
      setQuantity('10')
      setTimeout(() => setSuccessMessage(null), 3000)
      fetchGiftCards()
    } catch (error) {
      console.error('[v0] Error generating gift cards:', error)
      setErrorMessage('Failed to generate gift cards')
    }
  }

  const deleteGiftCard = async (id: string) => {
    if (!confirm('Are you sure? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/gift-cards/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete gift card')

      setSuccessMessage('Gift card deleted successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
      fetchGiftCards()
    } catch (error) {
      console.error('[v0] Error deleting gift card:', error)
      setErrorMessage('Failed to delete gift card')
    }
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold">ADs Admin - Gift Cards</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 text-sm font-medium border border-border hover:bg-secondary transition-colors"
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Success</p>
              <p className="text-sm">{successMessage}</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generate Gift Cards Form */}
          <div className="lg:col-span-1">
            <div className="border border-border rounded-lg p-6 sticky top-24">
              <h2 className="font-heading text-xl font-bold mb-6">Generate Gift Cards</h2>

              <form onSubmit={generateGiftCards} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Denomination (₹)</label>
                  <select
                    value={denomination}
                    onChange={(e) => setDenomination(e.target.value)}
                    className="w-full px-4 py-2 border border-border bg-background text-foreground rounded"
                  >
                    <option value="500">₹500</option>
                    <option value="1000">₹1000</option>
                    <option value="2000">₹2000</option>
                    <option value="5000">₹5000</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    max="1000"
                    className="w-full px-4 py-2 border border-border bg-background text-foreground rounded"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-foreground text-background font-semibold rounded hover:bg-accent transition-colors"
                >
                  Generate
                </button>
              </form>
            </div>
          </div>

          {/* Gift Cards List */}
          <div className="lg:col-span-2">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-card border-b border-border">
                <h3 className="font-heading text-lg font-bold">Active Gift Cards</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Total: {giftCards.length} cards | Redeemed: {giftCards.filter(gc => gc.isRedeemed).length}
                </p>
              </div>

              {isLoading ? (
                <div className="p-8 text-center text-muted-foreground">Loading gift cards...</div>
              ) : giftCards.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No gift cards yet. Generate one to get started.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-card border-b border-border text-sm font-semibold">
                      <tr>
                        <th className="px-6 py-3 text-left">Code</th>
                        <th className="px-6 py-3 text-left">Denomination</th>
                        <th className="px-6 py-3 text-left">Balance</th>
                        <th className="px-6 py-3 text-left">Status</th>
                        <th className="px-6 py-3 text-left">Created</th>
                        <th className="px-6 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {giftCards.map((gc) => (
                        <tr key={gc.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                          <td className="px-6 py-3 text-sm font-mono flex items-center gap-2">
                            {gc.code}
                            <button
                              onClick={() => copyToClipboard(gc.code)}
                              className="p-1 hover:bg-border rounded transition-colors"
                              title="Copy code"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            {copiedCode === gc.code && <span className="text-xs text-green-600">Copied!</span>}
                          </td>
                          <td className="px-6 py-3 text-sm">₹{gc.denomination.toFixed(2)}</td>
                          <td className="px-6 py-3 text-sm">₹{gc.balance.toFixed(2)}</td>
                          <td className="px-6 py-3 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              gc.isRedeemed
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {gc.isRedeemed ? 'Redeemed' : 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-sm text-muted-foreground">
                            {new Date(gc.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-3 text-center">
                            <button
                              onClick={() => deleteGiftCard(gc.id)}
                              className="p-2 hover:bg-red-100 rounded transition-colors text-red-600"
                              title="Delete gift card"
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
        </div>
      </main>
    </div>
  )
}
