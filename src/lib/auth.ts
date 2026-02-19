// سیستم احراز هویت برای پنل‌های مدیریت
// امنیت: استفاده از sessionStorage برای اجبار ورود مجدد در هر بازدید

export interface User {
  username: string
  password: string
  name: string
  role: 'admin' | 'designer'
}

// کاربران پیش‌فرض
const DEFAULT_USERS: User[] = [
  {
    username: '09173147318',
    password: 'AI2025',
    name: 'آقای محمد علی غارسی',
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
const USERS_KEY = 'fiberglass_users'
// زمان انقضای session به دقیقه (30 دقیقه)
const SESSION_TIMEOUT_MINUTES = 30

export interface AuthSession {
  username: string
  name: string
  role: 'admin' | 'designer'
  loginTime: string
  sessionId: string // شناسه یکتای session برای امنیت بیشتر
}

// دریافت لیست کاربران از localStorage
export function getUsers(): User[] {
  if (typeof window === 'undefined') return DEFAULT_USERS
  
  try {
    const stored = localStorage.getItem(USERS_KEY)
    if (stored) {
      const users = JSON.parse(stored)
      if (Array.isArray(users) && users.length > 0) {
        return users
      }
    }
    // اگر داده‌ای نبود، کاربران پیش‌فرض را ذخیره و برگردان
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS))
    return DEFAULT_USERS
  } catch (error) {
    console.error('Error reading users:', error)
    return DEFAULT_USERS
  }
}

// ذخیره کاربران
function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch (error) {
    console.error('Error saving users:', error)
  }
}

// دریافت کاربر با نقش خاص
export function getUserByRole(role: 'admin' | 'designer'): User | null {
  const users = getUsers()
  return users.find(u => u.role === role) || null
}

// تغییر نام کاربری
export function updateUsername(role: 'admin' | 'designer', newUsername: string): { success: boolean; message: string } {
  if (!newUsername || newUsername.trim().length < 3) {
    return { success: false, message: 'نام کاربری باید حداقل ۳ کاراکتر باشد' }
  }
  
  const users = getUsers()
  const userIndex = users.findIndex(u => u.role === role)
  
  if (userIndex === -1) {
    return { success: false, message: 'کاربر یافت نشد' }
  }
  
  // بررسی تکراری نبودن نام کاربری
  const otherUser = users.find((u, i) => i !== userIndex && u.username === newUsername.trim())
  if (otherUser) {
    return { success: false, message: 'این نام کاربری قبلاً استفاده شده است' }
  }
  
  users[userIndex].username = newUsername.trim()
  saveUsers(users)
  
  // بروزرسانی session اگر کاربر لاگین باشه
  updateSessionUsername(role, newUsername.trim())
  
  return { success: true, message: 'نام کاربری با موفقیت تغییر کرد' }
}

// تغییر رمز عبور
export function updatePassword(role: 'admin' | 'designer', currentPassword: string, newPassword: string): { success: boolean; message: string } {
  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد' }
  }
  
  const users = getUsers()
  const userIndex = users.findIndex(u => u.role === role)
  
  if (userIndex === -1) {
    return { success: false, message: 'کاربر یافت نشد' }
  }
  
  // بررسی رمز عبور فعلی
  if (users[userIndex].password !== currentPassword) {
    return { success: false, message: 'رمز عبور فعلی اشتباه است' }
  }
  
  users[userIndex].password = newPassword
  saveUsers(users)
  
  return { success: true, message: 'رمز عبور با موفقیت تغییر کرد' }
}

// بروزرسانی نام کاربری در session
function updateSessionUsername(role: 'admin' | 'designer', newUsername: string): void {
  if (typeof window === 'undefined') return
  
  const authKey = role === 'admin' ? AUTH_KEY_ADMIN : AUTH_KEY_DESIGNER
  // استفاده از sessionStorage
  const stored = sessionStorage.getItem(authKey)
  
  if (stored) {
    try {
      const session: AuthSession = JSON.parse(stored)
      session.username = newUsername
      sessionStorage.setItem(authKey, JSON.stringify(session))
    } catch {
      // ignore
    }
  }
}

// تولید شناسه یکتای session
function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 15)
}

// ورود به سیستم
export function login(username: string, password: string, targetRole: 'admin' | 'designer'): { success: boolean; message: string; session?: AuthSession } {
  const users = getUsers()
  const user = users.find(u => u.username === username && u.password === password && u.role === targetRole)
  
  if (!user) {
    // Check if credentials are correct but role is wrong
    const wrongRoleUser = users.find(u => u.username === username && u.password === password)
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
    sessionId: generateSessionId(),
  }

  const authKey = targetRole === 'admin' ? AUTH_KEY_ADMIN : AUTH_KEY_DESIGNER
  
  if (typeof window !== 'undefined') {
    // استفاده از sessionStorage به جای localStorage
    // با بستن مرورگر یا تب، session پاک می‌شود
    sessionStorage.setItem(authKey, JSON.stringify(session))
  }

  return { success: true, message: 'ورود موفقیت‌آمیز', session }
}

// بررسی وضعیت ورود
export function isLoggedIn(role: 'admin' | 'designer'): boolean {
  if (typeof window === 'undefined') return false
  
  const authKey = role === 'admin' ? AUTH_KEY_ADMIN : AUTH_KEY_DESIGNER
  // استفاده از sessionStorage
  const stored = sessionStorage.getItem(authKey)
  
  if (!stored) return false
  
  try {
    const session: AuthSession = JSON.parse(stored)
    // بررسی انقضای session (30 دقیقه)
    const loginTime = new Date(session.loginTime).getTime()
    const now = Date.now()
    const minutesDiff = (now - loginTime) / (1000 * 60)
    
    if (minutesDiff > SESSION_TIMEOUT_MINUTES) {
      logout(role)
      return false
    }
    
    // بررسی وجود sessionId برای امنیت بیشتر
    if (!session.sessionId) {
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
  // استفاده از sessionStorage
  const stored = sessionStorage.getItem(authKey)
  
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
  // استفاده از sessionStorage
  sessionStorage.removeItem(authKey)
}

// خروج از همه جلسات
export function logoutAll(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(AUTH_KEY_ADMIN)
  sessionStorage.removeItem(AUTH_KEY_DESIGNER)
}

// تمدید session (برای جلوگیری از خروج خودکار هنگام کار)
export function refreshSession(role: 'admin' | 'designer'): void {
  if (typeof window === 'undefined') return
  
  const authKey = role === 'admin' ? AUTH_KEY_ADMIN : AUTH_KEY_DESIGNER
  const stored = sessionStorage.getItem(authKey)
  
  if (stored) {
    try {
      const session: AuthSession = JSON.parse(stored)
      session.loginTime = new Date().toISOString()
      sessionStorage.setItem(authKey, JSON.stringify(session))
    } catch {
      // ignore
    }
  }
}// ریست کردن کاربران به پیش‌فرض
export function resetUsersToDefault(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS))
}