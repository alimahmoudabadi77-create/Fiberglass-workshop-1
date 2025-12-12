// سیستم مدیریت تیم کارگاه

// ساختار چند زبانه برای فیلدهای متنی
export interface LocalizedText {
  fa: string
  en: string
}

export interface TeamMember {
  id: string
  name: string | LocalizedText
  role: string | LocalizedText
  color: 'orange' | 'blue' | 'purple' | 'emerald' | 'pink' | 'cyan' | 'yellow' | 'red'
  createdAt: string
  // اطلاعات جدید
  bio?: string | LocalizedText // بیوگرافی کوتاه
  experience?: string // سال‌های تجربه
  skills?: string[] | LocalizedText[] // مهارت‌ها
  description?: string | LocalizedText // توضیحات کامل درباره کار
  achievements?: string[] | LocalizedText[] // دستاوردها
  phone?: string // شماره تماس (اختیاری)
  image?: string // تصویر پروفایل (base64)
}

// تابع کمکی برای دریافت متن بر اساس زبان
export function getLocalizedText(text: string | LocalizedText | undefined, language: 'fa' | 'en'): string {
  if (!text) return ''
  if (typeof text === 'string') return text
  return text[language] || text.fa || text.en || ''
}

// تابع کمکی برای دریافت آرایه متن بر اساس زبان
export function getLocalizedArray(arr: string[] | LocalizedText[] | undefined, language: 'fa' | 'en'): string[] {
  if (!arr) return []
  return arr.map(item => {
    if (typeof item === 'string') return item
    return item[language] || item.fa || item.en || ''
  })
}

const TEAM_KEY = 'fiberglass_team'

// تولید ID یکتا
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// انتخاب رنگ خودکار بر اساس تعداد اعضای فعلی
export function getAutoColor(memberCount: number): TeamMember['color'] {
  const colors: TeamMember['color'][] = ['orange', 'blue', 'purple', 'emerald', 'pink', 'cyan', 'yellow', 'red']
  return colors[memberCount % colors.length]
}

// داده‌های پیش‌فرض با پشتیبانی چند زبانه
const DEFAULT_TEAM: TeamMember[] = [
  {
    id: '1',
    name: { fa: 'علی غارسی', en: 'Ali Gharsi' },
    role: { fa: 'جوشکار', en: 'Welder' },
    color: 'orange',
    createdAt: new Date().toISOString(),
    bio: { fa: 'متخصص جوشکاری با بیش از ۱۰ سال تجربه در صنعت فایبرگلاس', en: 'Welding specialist with over 10 years of experience in the fiberglass industry' },
    experience: '10',
    skills: [
      { fa: 'جوشکاری آرگون', en: 'Argon Welding' },
      { fa: 'جوشکاری CO2', en: 'CO2 Welding' },
      { fa: 'برشکاری', en: 'Cutting' },
      { fa: 'ساخت سازه‌های فلزی', en: 'Metal Structure Construction' }
    ],
    description: { fa: 'علی غارسی یکی از باتجربه‌ترین جوشکاران کارگاه است که در زمینه جوشکاری انواع فلزات و ساخت سازه‌های فلزی تخصص دارد. ایشان با دقت و ظرافت بالا، کیفیت کار را در اولویت قرار می‌دهد.', en: 'Ali Gharsi is one of the most experienced welders in the workshop, specializing in welding various metals and constructing metal structures. He prioritizes work quality with high precision and delicacy.' },
    achievements: [
      { fa: 'بیش از ۵۰۰ پروژه موفق', en: 'Over 500 successful projects' },
      { fa: 'گواهینامه جوشکاری حرفه‌ای', en: 'Professional Welding Certificate' },
      { fa: 'برنده جایزه بهترین جوشکار سال ۱۴۰۰', en: 'Winner of Best Welder Award 2021' }
    ],
  },
  {
    id: '2',
    name: { fa: 'میلاد غارسی', en: 'Milad Gharsi' },
    role: { fa: 'فایبر و جوشکاری', en: 'Fiberglass & Welding' },
    color: 'blue',
    createdAt: new Date().toISOString(),
    bio: { fa: 'متخصص کار با فایبرگلاس و جوشکاری صنعتی', en: 'Specialist in fiberglass work and industrial welding' },
    experience: '8',
    skills: [
      { fa: 'کار با فایبرگلاس', en: 'Fiberglass Work' },
      { fa: 'ساخت قالب', en: 'Mold Making' },
      { fa: 'جوشکاری', en: 'Welding' },
      { fa: 'رزین‌کاری', en: 'Resin Work' }
    ],
    description: { fa: 'میلاد غارسی در زمینه کار با فایبرگلاس و ساخت قطعات کامپوزیتی تخصص دارد. ترکیب مهارت‌های فایبرکاری و جوشکاری او را به یک نیروی چندمنظوره و ارزشمند تبدیل کرده است.', en: 'Milad Gharsi specializes in fiberglass work and composite parts manufacturing. The combination of his fiberglass and welding skills makes him a versatile and valuable team member.' },
    achievements: [
      { fa: 'تخصص در ساخت قطعات سفارشی', en: 'Expertise in custom parts manufacturing' },
      { fa: 'آموزش بیش از ۲۰ کارآموز', en: 'Training over 20 apprentices' },
      { fa: 'همکاری در پروژه‌های صنعتی بزرگ', en: 'Collaboration on major industrial projects' }
    ],
  },
  {
    id: '3',
    name: { fa: 'علی محمودآبادی', en: 'Ali Mahmoudabadi' },
    role: { fa: 'بازاریاب و طراح', en: 'Marketing & Designer' },
    color: 'purple',
    createdAt: new Date().toISOString(),
    bio: { fa: 'متخصص بازاریابی و طراحی محصولات فایبرگلاس', en: 'Marketing and fiberglass product design specialist' },
    experience: '5',
    skills: [
      { fa: 'بازاریابی دیجیتال', en: 'Digital Marketing' },
      { fa: 'طراحی محصول', en: 'Product Design' },
      { fa: 'مذاکره فروش', en: 'Sales Negotiation' },
      { fa: 'طراحی گرافیک', en: 'Graphic Design' }
    ],
    description: { fa: 'علی محمودآبادی مسئول بازاریابی و طراحی محصولات کارگاه است. ایشان با شناخت نیازهای بازار و مشتریان، در توسعه محصولات جدید و جذب مشتری نقش کلیدی دارد.', en: 'Ali Mahmoudabadi is responsible for marketing and product design at the workshop. With his understanding of market and customer needs, he plays a key role in developing new products and attracting customers.' },
    achievements: [
      { fa: 'افزایش ۱۵۰٪ فروش در سال گذشته', en: '150% sales increase last year' },
      { fa: 'طراحی بیش از ۳۰ محصول جدید', en: 'Design of over 30 new products' },
      { fa: 'ایجاد شبکه گسترده مشتریان', en: 'Building an extensive customer network' }
    ],
  },
  {
    id: '4',
    name: { fa: 'غلامرضا مومنی', en: 'Gholamreza Momeni' },
    role: { fa: 'نقاش', en: 'Painter' },
    color: 'emerald',
    createdAt: new Date().toISOString(),
    bio: { fa: 'متخصص رنگ‌آمیزی و پوشش‌دهی قطعات فایبرگلاس', en: 'Specialist in painting and coating fiberglass parts' },
    experience: '12',
    skills: [
      { fa: 'رنگ‌آمیزی صنعتی', en: 'Industrial Painting' },
      { fa: 'پوشش ژل‌کوت', en: 'Gel Coat Coating' },
      { fa: 'پولیش و براق‌کاری', en: 'Polishing & Buffing' },
      { fa: 'ترمیم رنگ', en: 'Paint Repair' }
    ],
    description: { fa: 'غلامرضا مومنی با بیش از ۱۲ سال تجربه در رنگ‌آمیزی صنعتی، مسئول مرحله نهایی تولید یعنی رنگ‌آمیزی و پرداخت قطعات است. کار او تضمین‌کننده زیبایی و دوام محصولات نهایی است.', en: 'Gholamreza Momeni, with over 12 years of experience in industrial painting, is responsible for the final production stage: painting and finishing parts. His work guarantees the beauty and durability of final products.' },
    achievements: [
      { fa: 'استاد رنگ‌آمیزی با کیفیت بالا', en: 'Master of high-quality painting' },
      { fa: 'تخصص در رنگ‌های خاص و سفارشی', en: 'Expertise in special and custom colors' },
      { fa: 'صفر درصد برگشتی به دلیل کیفیت رنگ', en: 'Zero returns due to paint quality' }
    ],
  },
]

// بررسی اینکه آیا داده چند زبانه است
function isLocalizedData(data: TeamMember[]): boolean {
  if (!data || data.length === 0) return false
  const firstMember = data[0]
  // اگر name یک object با کلید fa باشد، داده چند زبانه است
  return typeof firstMember.name === 'object' && firstMember.name !== null && 'fa' in firstMember.name
}

// دریافت همه اعضای تیم
export function getTeamMembers(): TeamMember[] {
  if (typeof window === 'undefined') {
    return DEFAULT_TEAM
  }
  
  try {
    const stored = localStorage.getItem(TEAM_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // اگر آرایه معتبر بود
      if (Array.isArray(parsed) && parsed.length > 0) {
        // بررسی کنیم که آیا داده‌ها چند زبانه هستند
        if (isLocalizedData(parsed)) {
          return parsed
        } else {
          // داده‌های قدیمی هستند، از داده‌های پیش‌فرض جدید استفاده کن
          console.log('Upgrading team data to multilingual format...')
          localStorage.setItem(TEAM_KEY, JSON.stringify(DEFAULT_TEAM))
          return DEFAULT_TEAM
        }
      }
    }
    // اگر داده‌ای نبود یا خالی بود، داده‌های پیش‌فرض را ذخیره و برگردان
    localStorage.setItem(TEAM_KEY, JSON.stringify(DEFAULT_TEAM))
    return DEFAULT_TEAM
  } catch (error) {
    console.error('Error reading team:', error)
    return DEFAULT_TEAM
  }
}

// دریافت یک عضو با ID
export function getTeamMemberById(id: string): TeamMember | null {
  const members = getTeamMembers()
  return members.find(m => m.id === id) || null
}

// ذخیره همه اعضا
export function saveTeamMembers(members: TeamMember[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(TEAM_KEY, JSON.stringify(members))
    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('teamUpdated'))
    window.dispatchEvent(new Event('storage'))
  } catch (error) {
    console.error('Error saving team:', error)
  }
}

// اضافه کردن عضو جدید
export function addTeamMember(member: Omit<TeamMember, 'id' | 'createdAt'>): TeamMember {
  const members = getTeamMembers()
  const newMember: TeamMember = {
    ...member,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  members.push(newMember)
  saveTeamMembers(members)
  return newMember
}

// ویرایش عضو
export function updateTeamMember(id: string, updates: Partial<Omit<TeamMember, 'id' | 'createdAt'>>): TeamMember | null {
  const members = getTeamMembers()
  const index = members.findIndex(m => m.id === id)
  
  if (index === -1) return null
  
  members[index] = { ...members[index], ...updates }
  saveTeamMembers(members)
  return members[index]
}

// حذف عضو
export function deleteTeamMember(id: string): boolean {
  const members = getTeamMembers()
  const filteredMembers = members.filter(m => m.id !== id)
  
  if (filteredMembers.length === members.length) return false
  
  saveTeamMembers(filteredMembers)
  return true
}

// ریست کردن به داده‌های پیش‌فرض
export function resetTeamToDefault(): TeamMember[] {
  saveTeamMembers(DEFAULT_TEAM)
  return DEFAULT_TEAM
}

// لیست رنگ‌ها
export const TEAM_COLORS = [
  { value: 'orange', label: 'نارنجی', gradient: 'from-orange-400 to-red-500' },
  { value: 'blue', label: 'آبی', gradient: 'from-blue-400 to-cyan-500' },
  { value: 'purple', label: 'بنفش', gradient: 'from-purple-400 to-pink-500' },
  { value: 'emerald', label: 'سبز', gradient: 'from-emerald-400 to-teal-500' },
  { value: 'pink', label: 'صورتی', gradient: 'from-pink-400 to-rose-500' },
  { value: 'cyan', label: 'فیروزه‌ای', gradient: 'from-cyan-400 to-blue-500' },
  { value: 'yellow', label: 'زرد', gradient: 'from-yellow-400 to-orange-500' },
  { value: 'red', label: 'قرمز', gradient: 'from-red-400 to-rose-600' },
] as const
