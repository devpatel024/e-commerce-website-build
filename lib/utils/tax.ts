export async function getGSTRate(): Promise<number> {
  try {
    const response = await fetch('/api/admin/settings')
    const settings = await response.json()
    return parseFloat(settings.gstPercentage || '0')
  } catch (error) {
    console.error('[v0] Error fetching GST rate:', error)
    return 0
  }
}

export function calculateTax(subtotal: number, gstRate: number): number {
  return Math.round((subtotal * gstRate / 100) * 100) / 100
}

export function calculateTotal(subtotal: number, tax: number, discount: number = 0): number {
  return Math.round((subtotal + tax - discount) * 100) / 100
}
