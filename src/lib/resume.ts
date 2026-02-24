// مدیریت اطلاعات رزومه طراح

export interface ResumeData {
  // اطلاعات شخصی
  name: string
  title: string
  description: string
  status: string
  avatar: string // حرف اول نام
  
  // آمار
  stats: {
    experience: string
    projects: string
    satisfaction: string
  }
  
  // درباره من
  aboutText: string[]
  
  // مهارت‌ها
  programmingLanguages: Skill[]
  frameworks: Skill[]
  tools: string[]
  
  // نمونه کارها
  portfolio: PortfolioItem[]
  
  // اطلاعات تماس
  contact: {
    phone: string
    email: string
    ctaTitle: string
    ctaDescription: string
  }
  
  // لینک‌های اجتماعی
  socialLinks: {
    instagram: string
    linkedin: string
    whatsapp: string
    telegram: string
  }
}

export interface Skill {
  name: string
  color: string
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  tags: string[]
  color: string
  url?: string
}

const DEFAULT_RESUME: ResumeData = {
  name: 'علی محمودآبادی',
  title: 'طراح و توسعه‌دهنده وب',
  description: 'طراح این وبسایت و علاقه‌مند به ساخت تجربه‌های کاربری زیبا و کاربردی',
  status: 'آماده همکاری',
  avatar: 'ع',
  
  stats: {
    experience: '۳+',
    projects: '۱۰+',
    satisfaction: '۱۰۰٪',
  },
  
  aboutText: [
    'سلام! من علی محمودآبادی هستم، طراح و توسعه‌دهنده وب با ۳ سال سابقه کاری در زمینه طراحی و برنامه‌نویسی وبسایت.',
    'علاقه‌مند به ساخت تجربه‌های کاربری زیبا، مدرن و کاربردی هستم. تخصص من در طراحی رابط کاربری (UI) و تجربه کاربری (UX) همراه با پیاده‌سازی فنی پروژه‌هاست.',
  ],
  
  programmingLanguages: [
    { name: 'JavaScript', color: 'from-yellow-400 to-yellow-600' },
    { name: 'TypeScript', color: 'from-blue-400 to-blue-600' },
    { name: 'Python', color: 'from-green-400 to-blue-500' },
    { name: 'PHP', color: 'from-indigo-400 to-purple-600' },
    { name: 'HTML5', color: 'from-orange-400 to-red-500' },
    { name: 'CSS3', color: 'from-blue-400 to-cyan-500' },
    { name: 'SQL', color: 'from-cyan-400 to-blue-600' },
    { name: 'C#', color: 'from-purple-400 to-violet-600' },
  ],
  
  frameworks: [
    { name: 'React', color: 'from-cyan-400 to-blue-500' },
    { name: 'Next.js', color: 'from-gray-400 to-gray-600' },
    { name: 'Vue.js', color: 'from-green-400 to-emerald-600' },
    { name: 'Node.js', color: 'from-green-500 to-green-700' },
    { name: 'Laravel', color: 'from-red-400 to-red-600' },
    { name: 'Django', color: 'from-green-600 to-green-800' },
    { name: 'TailwindCSS', color: 'from-cyan-400 to-cyan-600' },
    { name: 'Bootstrap', color: 'from-purple-500 to-purple-700' },
  ],
  
  tools: ['Git', 'GitHub', 'VS Code', 'Figma', 'Photoshop', 'Linux', 'Docker', 'MongoDB', 'MySQL', 'PostgreSQL'],
  
  portfolio: [
    {
      id: '1',
      title: 'کارگاه فایبرگلاس',
      description: 'طراحی و توسعه وبسایت کامل با Next.js و TailwindCSS',
      tags: ['Next.js', 'TailwindCSS'],
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: '2',
      title: 'وبسایت شخصی علی محمودآبادی',
      description: 'طراحی و توسعه وبسایت شخصی و رزومه آنلاین با تمرکز بر تجربه کاربری و معرفی مهارت‌ها',
      tags: ['Next.js', 'Portfolio', 'UI/UX'],
      color: 'from-purple-500 to-pink-600',
      url: 'https://personalwebsite-beta-green.vercel.app/',
    },
  ],
  
  contact: {
    phone: '09170427767',
    email: 'alimahmoudabadi77@gmail.com',
    ctaTitle: 'آماده همکاری هستم!',
    ctaDescription: 'اگر پروژه‌ای دارید یا به طراحی وبسایت نیاز دارید، خوشحال می‌شم باهم صحبت کنیم.',
  },
  
  socialLinks: {
    instagram: '#',
    linkedin: '#',
    whatsapp: '#',
    telegram: '#',
  },
}

const RESUME_KEY = 'fiberglass_designer_resume'

export function getResume(): ResumeData {
  if (typeof window === 'undefined') return DEFAULT_RESUME
  try {
    const stored = localStorage.getItem(RESUME_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Merge with defaults to ensure all fields exist
      return { ...DEFAULT_RESUME, ...parsed }
    }
  } catch (error) {
    console.error('Error reading resume:', error)
  }
  return DEFAULT_RESUME
}

export function saveResume(data: ResumeData): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(RESUME_KEY, JSON.stringify(data))
    window.dispatchEvent(new Event('resumeUpdated'))
  } catch (error) {
    console.error('Error saving resume:', error)
  }
}

export function resetResume(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(RESUME_KEY)
    window.dispatchEvent(new Event('resumeUpdated'))
  } catch (error) {
    console.error('Error resetting resume:', error)
  }
}

