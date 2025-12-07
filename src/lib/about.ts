// مدیریت محتوای بخش درباره ما

export interface AboutFeature {
  id: string
  title: string
  description: string
  iconType: 'quality' | 'speed' | 'team' | 'price'
}

export interface AboutContent {
  sectionTitle: string
  mainTitle: string
  highlightText: string
  mainTitleEnd: string
  description1: string
  description2: string
  establishmentYear: string
  establishmentLabel: string
  features: AboutFeature[]
  lastUpdated: string
}

const DEFAULT_ABOUT: AboutContent = {
  sectionTitle: 'درباره ما',
  mainTitle: 'بیش از',
  highlightText: '۳۰ سال',
  mainTitleEnd: 'تجربه در صنعت فایبرگلاس',
  description1: 'کارگاه فایبرگلاس ما از سال ۱۳۷۴ فعالیت خود را آغاز کرده و با بهره‌گیری از تجربیات ارزشمند و تجهیزات پیشرفته، توانسته است جایگاه ویژه‌ای در صنعت فایبرگلاس کشور کسب کند.',
  description2: 'ما با تعهد به کیفیت و رضایت مشتری، انواع محصولات فایبرگلاس را در ابعاد و طرح‌های مختلف تولید می‌کنیم. از قطعات صنعتی گرفته تا محصولات تزئینی، همه با دقت و ظرافت خاصی ساخته می‌شوند.',
  establishmentYear: '۱۳۷۴',
  establishmentLabel: 'سال تأسیس کارگاه',
  features: [
    {
      id: '1',
      title: 'کیفیت تضمینی',
      description: 'استفاده از مواد اولیه درجه یک و استانداردهای بین‌المللی',
      iconType: 'quality'
    },
    {
      id: '2',
      title: 'تحویل سریع',
      description: 'تحویل به موقع پروژه‌ها با رعایت زمان‌بندی دقیق',
      iconType: 'speed'
    },
    {
      id: '3',
      title: 'تیم متخصص',
      description: 'کارشناسان با تجربه و متعهد در خدمت شما',
      iconType: 'team'
    },
    {
      id: '4',
      title: 'قیمت منصفانه',
      description: 'ارائه قیمت‌های رقابتی با بهترین کیفیت',
      iconType: 'price'
    }
  ],
  lastUpdated: new Date().toISOString()
}

const ABOUT_KEY = 'fiberglass_about_content'

export function getAboutContent(): AboutContent {
  if (typeof window === 'undefined') {
    return DEFAULT_ABOUT
  }
  
  try {
    const stored = localStorage.getItem(ABOUT_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error reading about content:', error)
  }
  
  return DEFAULT_ABOUT
}

export function saveAboutContent(content: AboutContent): void {
  if (typeof window === 'undefined') return
  
  try {
    content.lastUpdated = new Date().toISOString()
    localStorage.setItem(ABOUT_KEY, JSON.stringify(content))
    // Dispatch event for real-time updates
    window.dispatchEvent(new Event('aboutUpdated'))
  } catch (error) {
    console.error('Error saving about content:', error)
  }
}

export function resetAboutContent(): AboutContent {
  saveAboutContent(DEFAULT_ABOUT)
  return DEFAULT_ABOUT
}

