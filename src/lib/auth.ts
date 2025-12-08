// سیستم احراز هویت برای پنل‌های مدیریت

export interface User {
  username: string
  password: string
  name: string
  role: 'admin' | 'designer'
}

// کاربران تعریف شده
const USERS: User[] = [
  {
    username: '09173147318',
    password: 'AI2025',
    name: 'محمد علی غارسی',
    role: 'admin',
  },
  {
    username: '09170427767',
    password: 'AI2025',
    name: 'علی محمودآبادی',
    role: 'designer',
  },
]

const AUTH_KEY_ADMIN = 'fiberglass_admin_auth'
const AUTH_KEY_DESIGNER = 'fiberglass_designer_auth'

export interface AuthSession {
  username: string
  name: string
  role: 'admin' | 'designer'
  loginTime: string
}

// ورود به سیستم
export function login(username: string, password: string, targetRole: 'admin' | 'designer'): { success: boolean; message: string; session?: AuthSession } {
  const user = USERS.find(u => u.username === username && u.password === password && u.role === targetRole)
  
  if (!user) {
    // Check if credentials are correct but role is wrong
    const wrongRoleUser = USERS.find(u => u.username === username && u.password === password)
    if (wrongRoleUser) {
      return { success: false, message: 'شما مجوز دسترسی به این پنل را ندارید' }
    }
    return { success: false, message: 'نام کاربری یا رمز عبور اشتباه است' }
  }

  const session: AuthSession = {
    username: user.username,
    name: user.name,
    role: user.role,
    loginTime: new Date().toISOString(),
  }

  const authKey = targetRole === 'admin' ? AUTH_KEY_ADMIN : AUTH_KEY_DESIGNER
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(authKey, JSON.stringify(session))
  }

  return { success: true, message: 'ورود موفقیت‌آمیز', session }
}

// بررسی وضعیت ورود
export function isLoggedIn(role: 'admin' | 'designer'): boolean {
  if (typeof window === 'undefined') return false
  
  const authKey = role === 'admin' ? AUTH_KEY_ADMIN : AUTH_KEY_DESIGNER
  const stored = localStorage.getItem(authKey)
  
  if (!stored) return false
  
  try {
    const session: AuthSession = JSON.parse(stored)
    // Check if session is still valid (24 hours)
    const loginTime = new Date(session.loginTime).getTime()
    const now = Date.now()
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60)
    
    if (hoursDiff > 24) {
      logout(role)
      return false
    }
    
    return session.role === role
  } catch {
    return false
  }
}

// دریافت اطلاعات جلسه
export function getSession(role: 'admin' | 'designer'): AuthSession | null {
  if (typeof window === 'undefined') return null
  
  const authKey = role === 'admin' ? AUTH_KEY_ADMIN : AUTH_KEY_DESIGNER
  const stored = localStorage.getItem(authKey)
  
  if (!stored) return null
  
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

// خروج از سیستم
export function logout(role: 'admin' | 'designer'): void {
  if (typeof window === 'undefined') return
  
  const authKey = role === 'admin' ? AUTH_KEY_ADMIN : AUTH_KEY_DESIGNER
  localStorage.removeItem(authKey)
}

// خروج از همه جلسات
export function logoutAll(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_KEY_ADMIN)
  localStorage.removeItem(AUTH_KEY_DESIGNER)
}

