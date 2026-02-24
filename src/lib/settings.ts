// تنظیمات وبسایت - پشتیبانی از Supabase و localStorage

import { getSupabaseClient, isSupabaseConfigured } from './supabase'

export interface SiteSettings {
  isLocked: boolean
  lockMessage: string
  lastUpdated: string
}

const DEFAULT_SETTINGS: SiteSettings = {
  isLocked: false,
  lockMessage: 'در حال بروزرسانی وبسایت هستیم. از صبر و شکیبایی شما سپاسگزاریم.',
  lastUpdated: new Date().toISOString(),
}

const SETTINGS_KEY = 'fiberglass_site_settings'
const TABLE_NAME = 'site_settings'
const ROW_ID = 'main'

// ========== Supabase ==========

async function fetchSettingsFromSupabase(): Promise<SiteSettings> {
  const supabase = getSupabaseClient()
  if (!supabase) return DEFAULT_SETTINGS

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('is_locked, lock_message, last_updated')
    .eq('id', ROW_ID)
    .single()

  if (error || !data) {
    return DEFAULT_SETTINGS
  }

  return {
    isLocked: !!data.is_locked,
    lockMessage: data.lock_message || DEFAULT_SETTINGS.lockMessage,
    lastUpdated: data.last_updated || new Date().toISOString(),
  }
}

async function saveSettingsToSupabase(settings: SiteSettings): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false

  const { error } = await supabase
    .from(TABLE_NAME)
    .upsert(
      {
        id: ROW_ID,
        is_locked: settings.isLocked,
        lock_message: settings.lockMessage,
        last_updated: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )

  return !error
}

// ========== localStorage ==========

function getSettingsFromStorage(): SiteSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS

  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error reading settings:', error)
  }

  return DEFAULT_SETTINGS
}

function saveSettingsToStorage(settings: SiteSettings): void {
  if (typeof window === 'undefined') return

  try {
    settings.lastUpdated = new Date().toISOString()
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving settings:', error)
  }
}

// ========== API عمومی ==========

export function getSettings(): SiteSettings {
  return getSettingsFromStorage()
}

export async function getSettingsAsync(): Promise<SiteSettings> {
  if (isSupabaseConfigured()) {
    const s = await fetchSettingsFromSupabase()
    saveSettingsToStorage(s)
    return s
  }
  return getSettingsFromStorage()
}

export function saveSettings(settings: SiteSettings): void {
  settings.lastUpdated = new Date().toISOString()
  saveSettingsToStorage(settings)
  if (isSupabaseConfigured()) {
    saveSettingsToSupabase(settings).catch(console.error)
  }
}

export async function saveSettingsAsync(settings: SiteSettings): Promise<void> {
  settings.lastUpdated = new Date().toISOString()

  if (isSupabaseConfigured()) {
    const ok = await saveSettingsToSupabase(settings)
    if (ok) {
      saveSettingsToStorage(settings)
    }
  } else {
    saveSettingsToStorage(settings)
  }
}

export function toggleSiteLock(isLocked: boolean): SiteSettings {
  const settings = getSettings()
  settings.isLocked = isLocked
  saveSettings(settings)
  return settings
}

export function updateLockMessage(message: string): SiteSettings {
  const settings = getSettings()
  settings.lockMessage = message
  saveSettings(settings)
  return settings
}
