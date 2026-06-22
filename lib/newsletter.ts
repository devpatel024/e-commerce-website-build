// Newsletter Subscription Management
const NEWSLETTER_KEY = 'newsletter_subscribers'

export interface NewsletterSubscriber {
  email: string
  subscribedAt: number
  status: 'active' | 'unsubscribed'
}

/**
 * Subscribe an email to the newsletter
 */
export function subscribeToNewsletter(email: string): boolean {
  try {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return false
    }

    const subscribers = getNewsletterSubscribers()
    
    // Check if already subscribed
    const existing = subscribers.find(s => s.email.toLowerCase() === email.toLowerCase())
    
    if (existing) {
      if (existing.status === 'active') {
        return false // Already subscribed
      }
      // Reactivate subscription
      existing.status = 'active'
      existing.subscribedAt = Date.now()
    } else {
      // Add new subscriber
      subscribers.push({
        email: email.toLowerCase(),
        subscribedAt: Date.now(),
        status: 'active',
      })
    }

    localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(subscribers))
    return true
  } catch (error) {
    console.error('[v0] Failed to subscribe to newsletter:', error)
    return false
  }
}

/**
 * Unsubscribe an email from the newsletter
 */
export function unsubscribeFromNewsletter(email: string): boolean {
  try {
    const subscribers = getNewsletterSubscribers()
    const index = subscribers.findIndex(s => s.email.toLowerCase() === email.toLowerCase())
    
    if (index !== -1) {
      subscribers[index].status = 'unsubscribed'
      localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(subscribers))
      return true
    }
    
    return false
  } catch (error) {
    console.error('[v0] Failed to unsubscribe from newsletter:', error)
    return false
  }
}

/**
 * Get all newsletter subscribers
 */
export function getNewsletterSubscribers(): NewsletterSubscriber[] {
  try {
    const stored = localStorage.getItem(NEWSLETTER_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('[v0] Failed to get newsletter subscribers:', error)
    return []
  }
}

/**
 * Get active newsletter subscribers count
 */
export function getActiveSubscriberCount(): number {
  const subscribers = getNewsletterSubscribers()
  return subscribers.filter(s => s.status === 'active').length
}

/**
 * Check if an email is subscribed
 */
export function isSubscribed(email: string): boolean {
  const subscribers = getNewsletterSubscribers()
  const subscriber = subscribers.find(s => s.email.toLowerCase() === email.toLowerCase())
  return subscriber?.status === 'active' ?? false
}

/**
 * Clear all newsletter subscribers (admin only)
 */
export function clearNewsletterSubscribers(): void {
  try {
    localStorage.removeItem(NEWSLETTER_KEY)
  } catch (error) {
    console.error('[v0] Failed to clear newsletter subscribers:', error)
  }
}
