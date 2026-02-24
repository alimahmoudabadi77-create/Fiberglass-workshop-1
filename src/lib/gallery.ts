// سیستم مدیریت گالری - پشتیبانی از Supabase و localStorage

import { getSupabaseClient, isSupabaseConfigured } from './supabase'

export { isSupabaseConfigured }

export interface GalleryItem {
  id: string
  type: 'image' | 'video'
  url: string
  title: string
  description: string
  createdAt: string
}

const GALLERY_KEY = 'fiberglass_gallery'
const BUCKET_NAME = 'gallery'
const TABLE_NAME = 'gallery'

// تولید ID یکتا
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// تبدیل ردیف Supabase به GalleryItem
function rowToItem(row: { id: string; type: string; url: string; title: string; description: string; created_at: string }): GalleryItem {
  return {
    id: row.id,
    type: row.type as 'image' | 'video',
    url: row.url,
    title: row.title || '',
    description: row.description || '',
    createdAt: row.created_at,
  }
}

// ========== Supabase ==========

async function fetchGalleryFromSupabase(): Promise<GalleryItem[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching gallery from Supabase:', error)
    return []
  }

  return (data || []).map(rowToItem)
}

async function addToSupabase(item: Omit<GalleryItem, 'id' | 'createdAt'>, file: File): Promise<GalleryItem | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return null

  const id = generateId()
  const ext = file.name.split('.').pop() || (item.type === 'image' ? 'jpg' : 'mp4')
  const storagePath = `${id}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file, { upsert: true })

  if (uploadError) {
    console.error('Error uploading to Supabase Storage:', uploadError)
    return null
  }

  const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath)
  const url = urlData.publicUrl

  const { data: insertData, error: insertError } = await supabase
    .from(TABLE_NAME)
    .insert({
      id,
      type: item.type,
      url,
      title: item.title,
      description: item.description || '',
      created_at: new Date().toISOString(),
      storage_path: storagePath,
    })
    .select()
    .single()

  if (insertError) {
    console.error('Error inserting gallery item:', insertError)
    await supabase.storage.from(BUCKET_NAME).remove([storagePath])
    return null
  }

  return insertData ? rowToItem({ ...insertData, created_at: insertData.created_at }) : null
}

async function updateInSupabase(id: string, updates: { title?: string; description?: string }): Promise<GalleryItem | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.description !== undefined && { description: updates.description }),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating gallery item:', error)
    return null
  }

  return data ? rowToItem(data) : null
}

async function deleteFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false

  const { data: row } = await supabase
    .from(TABLE_NAME)
    .select('storage_path')
    .eq('id', id)
    .single()

  if (row?.storage_path) {
    await supabase.storage.from(BUCKET_NAME).remove([row.storage_path])
  }

  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id)

  if (error) {
    console.error('Error deleting gallery item:', error)
    return false
  }

  return true
}

// ========== localStorage (fallback) ==========

function getGalleryItemsFromStorage(): GalleryItem[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(GALLERY_KEY)
    if (stored) return JSON.parse(stored)
  } catch (error) {
    console.error('Error reading gallery:', error)
  }

  return []
}

function saveGalleryItemsToStorage(items: GalleryItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(GALLERY_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Error saving gallery:', error)
  }
}

// ========== API عمومی (Async) ==========

export async function getGalleryItemsAsync(): Promise<GalleryItem[]> {
  if (isSupabaseConfigured()) {
    return fetchGalleryFromSupabase()
  }
  return getGalleryItemsFromStorage()
}

export async function addGalleryItemAsync(
  item: Omit<GalleryItem, 'id' | 'createdAt'>,
  file?: File | null
): Promise<GalleryItem | null> {
  if (isSupabaseConfigured() && file) {
    return addToSupabase(item, file)
  }

  const newItem: GalleryItem = {
    ...item,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  const items = getGalleryItemsFromStorage()
  items.unshift(newItem)
  saveGalleryItemsToStorage(items)
  return newItem
}

export async function updateGalleryItemAsync(
  id: string,
  updates: Partial<Omit<GalleryItem, 'id' | 'createdAt'>>
): Promise<GalleryItem | null> {
  if (isSupabaseConfigured()) {
    return updateInSupabase(id, {
      title: updates.title,
      description: updates.description,
    })
  }

  const items = getGalleryItemsFromStorage()
  const index = items.findIndex((i) => i.id === id)
  if (index === -1) return null
  items[index] = { ...items[index], ...updates }
  saveGalleryItemsToStorage(items)
  return items[index]
}

export async function deleteGalleryItemAsync(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    return deleteFromSupabase(id)
  }

  const items = getGalleryItemsFromStorage()
  const filtered = items.filter((i) => i.id !== id)
  if (filtered.length === items.length) return false
  saveGalleryItemsToStorage(filtered)
  return true
}

// ========== API همگام (برای سازگاری با کد قبلی - فقط localStorage) ==========

export function getGalleryItems(): GalleryItem[] {
  return getGalleryItemsFromStorage()
}

export function saveGalleryItems(items: GalleryItem[]): void {
  saveGalleryItemsToStorage(items)
}

export function addGalleryItem(item: Omit<GalleryItem, 'id' | 'createdAt'>): GalleryItem {
  const newItem: GalleryItem = {
    ...item,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  const items = getGalleryItemsFromStorage()
  items.unshift(newItem)
  saveGalleryItemsToStorage(items)
  return newItem
}

export function updateGalleryItem(
  id: string,
  updates: Partial<Omit<GalleryItem, 'id' | 'createdAt'>>
): GalleryItem | null {
  const items = getGalleryItemsFromStorage()
  const index = items.findIndex((i) => i.id === id)
  if (index === -1) return null
  items[index] = { ...items[index], ...updates }
  saveGalleryItemsToStorage(items)
  return items[index]
}

export function deleteGalleryItem(id: string): boolean {
  const items = getGalleryItemsFromStorage()
  const filtered = items.filter((i) => i.id !== id)
  if (filtered.length === items.length) return false
  saveGalleryItemsToStorage(filtered)
  return true
}

export function getGalleryItem(id: string): GalleryItem | null {
  const items = getGalleryItemsFromStorage()
  return items.find((i) => i.id === id) || null
}
