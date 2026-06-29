'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function AdminSettingsPage() {
  const router = useRouter()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    storeName: 'ADs',
    storeEmail: 'info@ads.com',
    supportEmail: 'support@ads.com',
    taxRate: '10',
    shippingCost: '10',
    maintenanceMode: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Save to database
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) throw new Error('Failed to save settings')
      
      setSuccessMessage('Settings saved successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      console.error('[v0] Error saving settings:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold">ADs Admin - Settings</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 text-sm font-medium border border-border hover:bg-secondary transition-colors"
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Success</p>
              <p className="text-sm">{successMessage}</p>
            </div>
          </div>
        )}

        <h2 className="font-heading text-3xl font-bold mb-8">Store Settings</h2>

        <form onSubmit={handleSave} className="space-y-8">
          {/* General Settings */}
          <div className="border border-border rounded-lg p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-4">General Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Store Name</label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Store Email</label>
                  <input
                    type="email"
                    name="storeEmail"
                    value={formData.storeEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Support Email</label>
                  <input
                    type="email"
                    name="supportEmail"
                    value={formData.supportEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border bg-background text-foreground"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Financial Settings */}
          <div className="border border-border rounded-lg p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Financial Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tax Rate (%)</label>
                  <input
                    type="number"
                    name="taxRate"
                    value={formData.taxRate}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-4 py-2 border border-border bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Default Shipping Cost</label>
                  <input
                    type="number"
                    name="shippingCost"
                    value={formData.shippingCost}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-4 py-2 border border-border bg-background text-foreground"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="border border-border rounded-lg p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-4">System Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={formData.maintenanceMode}
                    onChange={handleInputChange}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium">Enable Maintenance Mode</span>
                </label>
                {formData.maintenanceMode && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    Maintenance mode is active. The store will show a maintenance page to visitors.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-foreground text-background font-semibold rounded hover:bg-accent transition-colors"
            >
              Save Settings
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className="px-6 py-2 border border-border font-semibold rounded hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
