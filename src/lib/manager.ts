// Manager Info Storage

export interface ManagerInfo {
  firstName: string
  lastName: string
  phone: string
  title: string
  lastUpdated: string
}

const STORAGE_KEY = 'fiberglass_manager_info'

const defaultManager: ManagerInfo = {
  firstName: 'محمد علی',
  lastName: 'غارسی',
  phone: '09173147318',
  title: 'مدیر کارگاه فایبرگلاس',
  lastUpdated: new Date().toISOString()
}

export function getManagerInfo(): ManagerInfo {
  if (typeof window === 'undefined') return defaultManager
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return defaultManager
  
  try {
    return JSON.parse(stored)
  } catch {
    return defaultManager
  }
}

export function saveManagerInfo(info: ManagerInfo): void {
  if (typeof window === 'undefined') return
  
  const updatedInfo = {
    ...info,
    lastUpdated: new Date().toISOString()
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInfo))
  
  // Dispatch event for real-time updates
  window.dispatchEvent(new CustomEvent('managerInfoUpdated'))
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')
  
  // Format as: 0917 314 7318
  if (digits.length === 11) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
  }
  
  return phone
}

