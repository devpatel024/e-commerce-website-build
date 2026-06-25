'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/price-formatter'
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

interface Customer {
  email: string
  name: string
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
}

export default function AdminCustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/orders')
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch orders')
      }

      // Group orders by customer email
      const customerMap = new Map<string, Customer>()
      const orders = data.data || []

      orders.forEach((order: any) => {
        const email = order.customerEmail
        const total = parseFloat(order.total) || 0

        if (!customerMap.has(email)) {
          customerMap.set(email, {
            email,
            name: order.customerName,
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: order.createdAt,
          })
        }

        const customer = customerMap.get(email)!
        customer.totalOrders += 1
        customer.totalSpent += total
        if (order.createdAt && (!customer.lastOrderDate || new Date(order.createdAt) > new Date(customer.lastOrderDate))) {
          customer.lastOrderDate = order.createdAt
        }
      })

      setCustomers(Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent))
    } catch (err) {
      console.error('[v0] Error fetching customers:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(
    customer =>
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold">LUXE Admin - Customers</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 text-sm font-medium border border-border hover:bg-secondary transition-colors"
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <h2 className="font-heading text-3xl font-bold mb-8">Customer Management</h2>

        <div className="mb-6 space-y-4 bg-secondary/30 p-6 rounded-lg">
          <div>
            <label className="text-sm font-medium mb-2 block">Search Customers</label>
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground"
            />
          </div>
          <div className="flex gap-4 items-center flex-wrap">
            <div className="text-sm text-muted-foreground">
              Showing {filteredCustomers.length} of {customers.length} customers
            </div>
            <button
              onClick={fetchCustomers}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium border border-border hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {loading && customers.length === 0 && (
          <div className="border border-border p-12 text-center text-muted-foreground">
            <p>Loading customers...</p>
          </div>
        )}

        {!loading && filteredCustomers.length === 0 ? (
          <div className="border border-border p-12 text-center text-muted-foreground">
            <p>No customers found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCustomers.map(customer => {
              const isExpanded = expandedCustomer === customer.email

              return (
                <div key={customer.email} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <button
                    onClick={() => setExpandedCustomer(isExpanded ? null : customer.email)}
                    className="w-full bg-secondary/30 p-6 hover:bg-secondary/50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 flex-1">
                        <div>
                          <p className="text-xs uppercase text-muted-foreground font-semibold">Customer Name</p>
                          <p className="font-semibold text-sm">{customer.name}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground font-semibold">Email</p>
                          <p className="font-semibold text-sm text-accent">{customer.email}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground font-semibold">Total Orders</p>
                          <p className="font-semibold text-sm">{customer.totalOrders}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground font-semibold">Total Spent</p>
                          <p className="font-semibold text-sm">{formatPrice(customer.totalSpent)}</p>
                        </div>
                      </div>
                      <div className="ml-4">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-6 border-t border-border space-y-4 bg-background">
                      <div>
                        <h3 className="font-semibold mb-3">Customer Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs uppercase text-muted-foreground font-semibold">Email</p>
                            <p className="text-sm">{customer.email}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase text-muted-foreground font-semibold">Name</p>
                            <p className="text-sm">{customer.name}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase text-muted-foreground font-semibold">Total Orders</p>
                            <p className="text-sm font-semibold">{customer.totalOrders}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase text-muted-foreground font-semibold">Average Order Value</p>
                            <p className="text-sm font-semibold">{formatPrice(customer.totalSpent / customer.totalOrders)}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase text-muted-foreground font-semibold">Total Spent</p>
                            <p className="text-sm font-semibold text-accent">{formatPrice(customer.totalSpent)}</p>
                          </div>
                          {customer.lastOrderDate && (
                            <div>
                              <p className="text-xs uppercase text-muted-foreground font-semibold">Last Order</p>
                              <p className="text-sm">{new Date(customer.lastOrderDate).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
