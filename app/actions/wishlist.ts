'use server'

// Wishlist server actions using client-side auth context

export async function addToWishlist(productId: string) {
  // Placeholder - wishlist managed client-side
  console.log('Adding to wishlist:', productId)
  return { productId }
}

export async function removeFromWishlist(productId: string) {
  // Placeholder - wishlist managed client-side
  console.log('Removing from wishlist:', productId)
}

export async function getWishlist() {
  // Placeholder
  return []
}

export async function isProductInWishlist(productId: string) {
  // Placeholder
  return false
}
