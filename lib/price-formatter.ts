/**
 * Format price in Indian Rupees (₹)
 * @param price - Price value
 * @returns Formatted price string with rupee symbol
 */
export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return `₹${numPrice.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Convert price to Indian Rupees (₹) for display
 * @param price - Price value
 * @returns Formatted price string
 */
export function priceINR(price: string | number): string {
  return formatPrice(price)
}
