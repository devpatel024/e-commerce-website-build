'use client'

import { useState, useEffect } from 'react'
import { getOrders, getProducts, getAnalytics, saveAnalytics } from '@/lib/storage'
import type { Order, Product, Category } from '@/lib/types'
import { BarChart, TrendingUp, DollarSign, Package } from 'lucide-react'

export default function AnalyticsDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [mounted, setMounted] = useState(false)
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'all'>('month')

  useEffect(() => {
    const loadedOrders = getOrders()
    const loadedProducts = getProducts()
    setOrders(loadedOrders)
    setProducts(loadedProducts)

    // Generate analytics
    generateAnalytics(loadedOrders, loadedProducts)

    setMounted(true)
  }, [])

  const generateAnalytics = (ordersList: Order[], productsList: Product[]) => {
    const today = new Date()
    const monthAgo = new Date(today.setDate(today.getDate() - 30))

    const filteredOrders = ordersList.filter(o => new Date(o.createdAt) >= monthAgo)

    // Calculate by category
    const categoryBreakdown: { [key in Category]?: { revenue: number; unitsSold: number } } = {}

    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const product = productsList.find(p => p.id === item.productId)
        if (product) {
          const category = product.category as Category
          if (!categoryBreakdown[category]) {
            categoryBreakdown[category] = { revenue: 0, unitsSold: 0 }
          }
          categoryBreakdown[category]!.revenue += item.price * item.quantity
          categoryBreakdown[category]!.unitsSold += item.quantity
        }
      })
    })

    // Calculate top products
    const topProducts: { [key: string]: { name: string; unitsSold: number; revenue: number } } = {}

    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const product = productsList.find(p => p.id === item.productId)
        if (product) {
          if (!topProducts[item.productId]) {
            topProducts[item.productId] = {
              name: product.name,
              unitsSold: 0,
              revenue: 0,
            }
          }
          topProducts[item.productId].unitsSold += item.quantity
          topProducts[item.productId].revenue += item.price * item.quantity
        }
      })
    })

    const topProductsList = Object.entries(topProducts)
      .map(([productId, data]) => ({
        productId,
        productName: data.name,
        unitsSold: data.unitsSold,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0)
    const totalOrders = filteredOrders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    const analytics = {
      date: new Date().toISOString().split('T')[0],
      categoryBreakdown: Object.entries(categoryBreakdown).map(([category, data]) => ({
        category: category as Category,
        revenue: data.revenue,
        unitsSold: data.unitsSold,
      })),
      topProducts: topProductsList,
      totalRevenue,
      totalOrders,
      averageOrderValue,
    }

    saveAnalytics(analytics)
  }

  const allAnalytics = getAnalytics()
  const latestAnalytics = allAnalytics[allAnalytics.length - 1]

  const totalRevenue = latestAnalytics?.totalRevenue || 0
  const totalOrders = latestAnalytics?.totalOrders || 0
  const avgOrderValue = latestAnalytics?.averageOrderValue || 0

  if (!mounted) return <div className="p-8 text-center">Loading...</div>

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-heading mb-4">Sales Analytics</h1>
          <p className="text-muted-foreground">Track your store performance and customer insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-foreground">${totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-500 opacity-10" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-foreground">{totalOrders}</p>
              </div>
              <Package className="w-12 h-12 text-blue-500 opacity-10" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Average Order Value</p>
                <p className="text-3xl font-bold text-foreground">${avgOrderValue.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-500 opacity-10" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                <p className="text-3xl font-bold text-foreground">{products.length}</p>
              </div>
              <BarChart className="w-12 h-12 text-orange-500 opacity-10" />
            </div>
          </div>
        </div>

        {/* Revenue by Category */}
        {latestAnalytics && (
          <>
            <div className="bg-white rounded-lg border border-border p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BarChart className="w-6 h-6" />
                Revenue by Category
              </h2>

              {latestAnalytics.categoryBreakdown.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No sales data yet</p>
              ) : (
                <div className="space-y-4">
                  {latestAnalytics.categoryBreakdown.map(category => {
                    const percentage = (category.revenue / totalRevenue) * 100
                    return (
                      <div key={category.category}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold capitalize">{category.category}</span>
                          <div className="text-right">
                            <p className="font-bold text-foreground">${category.revenue.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">{category.unitsSold} units</p>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-foreground h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Top Selling Products
              </h2>

              {latestAnalytics.topProducts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No product sales yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold">#</th>
                        <th className="text-left px-4 py-3 font-semibold">Product</th>
                        <th className="text-left px-4 py-3 font-semibold">Units Sold</th>
                        <th className="text-right px-4 py-3 font-semibold">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestAnalytics.topProducts.map((product, index) => (
                        <tr key={product.productId} className="border-b border-border hover:bg-muted/50">
                          <td className="px-4 py-3 font-semibold text-foreground">{index + 1}</td>
                          <td className="px-4 py-3">{product.productName}</td>
                          <td className="px-4 py-3 text-center font-semibold">{product.unitsSold}</td>
                          <td className="px-4 py-3 text-right font-bold text-foreground">
                            ${product.revenue.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
