import { getSession } from './auth'

export interface AuthMiddlewareResult {
  isAuthenticated: boolean
  redirectTo?: string
  returnTo?: string
}

/**
 * Check if user is authenticated and optionally redirect to login if not
 * @param redirectIfNotAuth - If true and not authenticated, returns redirect URL
 * @param currentPath - Current page path for return-to functionality
 * @returns Authentication status and optional redirect URL
 */
export function checkAuthStatus(currentPath?: string): AuthMiddlewareResult {
  const session = getSession()
  const isAuthenticated = session !== null

  if (!isAuthenticated && currentPath) {
    return {
      isAuthenticated: false,
      redirectTo: `/auth/login?returnTo=${encodeURIComponent(currentPath)}`,
      returnTo: currentPath,
    }
  }

  return { isAuthenticated }
}

/**
 * Get the return-to path from URL params, with fallback
 */
export function getReturnToPath(searchParams?: Record<string, string | string[] | undefined>): string {
  if (!searchParams?.returnTo) return '/'

  const returnTo = searchParams.returnTo
  const path = Array.isArray(returnTo) ? returnTo[0] : returnTo

  // Security: only allow safe paths
  if (path && (path.startsWith('/') || path.startsWith('http'))) {
    return path
  }

  return '/'
}
