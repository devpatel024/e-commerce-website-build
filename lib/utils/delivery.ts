export async function getDeliveryEstimate() {
  try {
    const response = await fetch('/api/admin/settings')
    const settings = await response.json()
    
    const minDays = parseInt(settings.deliveryDaysMin || '5')
    const maxDays = parseInt(settings.deliveryDaysMax || '7')
    
    const today = new Date()
    const minDate = new Date(today)
    const maxDate = new Date(today)
    
    minDate.setDate(minDate.getDate() + minDays)
    maxDate.setDate(maxDate.getDate() + maxDays)
    
    return {
      minDate: minDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      maxDate: maxDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      minDays,
      maxDays,
    }
  } catch (error) {
    console.error('[v0] Error getting delivery estimate:', error)
    return {
      minDate: 'Soon',
      maxDate: 'Soon',
      minDays: 5,
      maxDays: 7,
    }
  }
}

export function getStockStatus(stock: number) {
  if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800', show: true }
  if (stock < 5) return { text: `Only ${stock} left`, color: 'bg-amber-100 text-amber-800', show: true }
  return { text: 'In Stock', color: 'bg-green-100 text-green-800', show: false }
}
