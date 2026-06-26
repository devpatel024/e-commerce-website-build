'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, LayoutDashboard, Box, Truck, Users, Tag, BarChart3, Settings, Upload } from 'lucide-react'

const ADMIN_LINKS = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Box, label: 'Products' },
  { href: '/admin/orders', icon: Truck, label: 'Orders' },
  { href: '/admin/customers', icon: Users, label: 'Customers' },
  { href: '/admin/coupons', icon: Tag, label: 'Coupons' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/admin/bulk-upload', icon: Upload, label: 'Bulk Upload' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle */}
      <div className="fixed top-4 left-4 md:hidden z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-secondary transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-background border-r border-border transition-transform duration-300 ease-in-out transform md:translate-x-0 z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/admin/dashboard" className="font-heading text-lg font-bold">
            ADs Admin
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-1">
            {ADMIN_LINKS.map(link => {
              const Icon = link.icon
              const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-foreground text-background font-medium'
                      : 'text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4 text-xs text-muted-foreground">
          <p>Logged in as Admin</p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 md:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
