import { User, UserRole, AuthSession } from './types'

const USERS_KEY = 'luxe_users'
const SESSION_KEY = 'luxe_session'

// Demo users - in production, these would be in a database
const DEMO_USERS = [
  {
    id: 'admin-001',
    email: 'admin@luxe.com',
    name: 'Admin User',
    role: 'admin' as UserRole,
    passwordHash: 'admin123', // In production, use proper hashing
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-001',
    email: 'customer@example.com',
    name: 'John Doe',
    role: 'user' as UserRole,
    passwordHash: 'user123', // In production, use proper hashing
    createdAt: new Date().toISOString(),
  },
]

interface StoredUser extends User {
  passwordHash: string
}

// Initialize demo users in localStorage
export function initializeUsers() {
  if (typeof window !== 'undefined') {
    const existing = localStorage.getItem(USERS_KEY)
    if (!existing) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_USERS))
    }
  }
}

// Get all users
function getAllUsers(): StoredUser[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(USERS_KEY)
    return data ? JSON.parse(data) : DEMO_USERS
  }
  return DEMO_USERS
}

// Save users
function saveUsers(users: StoredUser[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }
}

// Find user by email
function findUserByEmail(email: string): StoredUser | undefined {
  return getAllUsers().find(u => u.email === email)
}

// Login user
export function loginUser(email: string, password: string): { success: boolean; session?: AuthSession; error?: string } {
  const user = findUserByEmail(email)

  if (!user) {
    return { success: false, error: 'User not found' }
  }

  // In production, use proper password verification
  if (user.passwordHash !== password) {
    return { success: false, error: 'Invalid password' }
  }

  const session: AuthSession = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    },
    token: generateToken(user.id),
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }

  return { success: true, session }
}

// Register new user
export function registerUser(email: string, name: string, password: string): { success: boolean; session?: AuthSession; error?: string } {
  if (findUserByEmail(email)) {
    return { success: false, error: 'Email already exists' }
  }

  const users = getAllUsers()
  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    email,
    name,
    role: 'user',
    passwordHash: password, // In production, hash this
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  const session: AuthSession = {
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      createdAt: newUser.createdAt,
    },
    token: generateToken(newUser.id),
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }

  return { success: true, session }
}

// Get current session
export function getSession(): AuthSession | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(SESSION_KEY)
    return data ? JSON.parse(data) : null
  }
  return null
}

// Logout user
export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getSession() !== null
}

// Check if user has specific role
export function hasRole(requiredRole: UserRole): boolean {
  const session = getSession()
  return session?.user.role === requiredRole
}

// Check if user has admin role
export function isAdmin(): boolean {
  return hasRole('admin')
}

// Generate token (simple implementation, in production use JWT)
function generateToken(userId: string): string {
  return `token_${userId}_${Date.now()}`
}

// Validate token
export function validateToken(token: string): boolean {
  const session = getSession()
  return session?.token === token
}
