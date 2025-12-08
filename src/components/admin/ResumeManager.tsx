'use client'

import { useState, useEffect } from 'react'
import { getResume, saveResume, resetResume, ResumeData, Skill, PortfolioItem } from '@/lib/resume'

export default function ResumeManager() {
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'personal' | 'about' | 'skills' | 'portfolio' | 'contact'>('personal')
  
  // Modal states
  const [showSkillModal, setShowSkillModal] = useState(false)
  const [showToolModal, setShowToolModal] = useState(false)
  const [showPortfolioModal, setShowPortfolioModal] = useState(false)
  const [editingSkillType, setEditingSkillType] = useState<'language' | 'framework'>('language')
  const [newSkill, setNewSkill] = useState<Skill>({ name: '', color: 'from-purple-400 to-purple-600' })
  const [newTool, setNewTool] = useState('')
  const [newPortfolio, setNewPortfolio] = useState<PortfolioItem>({
    id: '',
    title: '',
    description: '',
    tags: [],
    color: 'from-purple-500 to-pink-600',
  })
  const [newTag, setNewTag] = useState('')
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null)

  useEffect(() => {
    setResume(getResume())
  }, [])

  const showSuccess = () => {
    setShowSaveSuccess(true)
    setTimeout(() => setShowSaveSuccess(false), 3000)
  }

  const handleSave = () => {
    if (!resume) return
    saveResume(resume)
    showSuccess()
  }

  const handleReset = () => {
    if (confirm('آیا از بازنشانی رزومه به حالت پیش‌فرض مطمئن هستید؟')) {
      resetResume()
      setResume(getResume())
      showSuccess()
    }
  }

  const handleAddSkill = () => {
    if (!resume || !newSkill.name.trim()) return
    
    if (editingSkillType === 'language') {
      setResume({
        ...resume,
        programmingLanguages: [...resume.programmingLanguages, { ...newSkill }],
      })
    } else {
      setResume({
        ...resume,
        frameworks: [...resume.frameworks, { ...newSkill }],
      })
    }
    setNewSkill({ name: '', color: 'from-purple-400 to-purple-600' })
    setShowSkillModal(false)
  }

  const handleRemoveSkill = (type: 'language' | 'framework', name: string) => {
    if (!resume) return
    if (type === 'language') {
      setResume({
        ...resume,
        programmingLanguages: resume.programmingLanguages.filter(s => s.name !== name),
      })
    } else {
      setResume({
        ...resume,
        frameworks: resume.frameworks.filter(s => s.name !== name),
      })
    }
  }

  const handleAddTool = () => {
    if (!resume || !newTool.trim()) return
    setResume({
      ...resume,
      tools: [...resume.tools, newTool.trim()],
    })
    setNewTool('')
    setShowToolModal(false)
  }

  const handleRemoveTool = (tool: string) => {
    if (!resume) return
    setResume({
      ...resume,
      tools: resume.tools.filter(t => t !== tool),
    })
  }

  const handleAddPortfolio = () => {
    if (!resume || !newPortfolio.title.trim()) return
    
    if (editingPortfolio) {
      setResume({
        ...resume,
        portfolio: resume.portfolio.map(p => p.id === editingPortfolio.id ? { ...newPortfolio } : p),
      })
    } else {
      setResume({
        ...resume,
        portfolio: [...resume.portfolio, { ...newPortfolio, id: Date.now().toString() }],
      })
    }
    setNewPortfolio({ id: '', title: '', description: '', tags: [], color: 'from-purple-500 to-pink-600' })
    setEditingPortfolio(null)
    setShowPortfolioModal(false)
  }

  const handleEditPortfolio = (item: PortfolioItem) => {
    setEditingPortfolio(item)
    setNewPortfolio({ ...item })
    setShowPortfolioModal(true)
  }

  const handleRemovePortfolio = (id: string) => {
    if (!resume) return
    setResume({
      ...resume,
      portfolio: resume.portfolio.filter(p => p.id !== id),
    })
  }

  const handleAddTag = () => {
    if (!newTag.trim() || newPortfolio.tags.includes(newTag.trim())) return
    setNewPortfolio({
      ...newPortfolio,
      tags: [...newPortfolio.tags, newTag.trim()],
    })
    setNewTag('')
  }

  const handleRemoveTag = (tag: string) => {
    setNewPortfolio({
      ...newPortfolio,
      tags: newPortfolio.tags.filter(t => t !== tag),
    })
  }

  const colorOptions = [
    { value: 'from-purple-400 to-purple-600', label: 'بنفش' },
    { value: 'from-pink-400 to-pink-600', label: 'صورتی' },
    { value: 'from-blue-400 to-blue-600', label: 'آبی' },
    { value: 'from-cyan-400 to-cyan-600', label: 'فیروزه‌ای' },
    { value: 'from-green-400 to-green-600', label: 'سبز' },
    { value: 'from-emerald-400 to-emerald-600', label: 'زمردی' },
    { value: 'from-yellow-400 to-yellow-600', label: 'زرد' },
    { value: 'from-orange-400 to-orange-600', label: 'نارنجی' },
    { value: 'from-red-400 to-red-600', label: 'قرمز' },
    { value: 'from-indigo-400 to-indigo-600', label: 'نیلی' },
    { value: 'from-gray-400 to-gray-600', label: 'خاکستری' },
  ]

  if (!resume) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      {/* Success Toast */}
      {showSaveSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="flex items-center gap-3 px-5 py-3 rounded-lg bg-emerald-500 text-white shadow-xl shadow-emerald-500/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium text-sm">تغییرات ذخیره شد</span>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              افزودن {editingSkillType === 'language' ? 'زبان برنامه‌نویسی' : 'فریمورک'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">نام</label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                  placeholder="مثال: React"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">رنگ</label>
                <select
                  value={newSkill.color}
                  onChange={(e) => setNewSkill({ ...newSkill, color: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                >
                  {colorOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowSkillModal(false)} className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-400 text-sm font-medium hover:bg-slate-700 transition-colors">
                انصراف
              </button>
              <button onClick={handleAddSkill} className="flex-1 px-4 py-3 rounded-xl bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-colors">
                افزودن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tool Modal */}
      {showToolModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">افزودن ابزار</h3>
            <input
              type="text"
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
              placeholder="مثال: Docker"
            />
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowToolModal(false)} className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-400 text-sm font-medium hover:bg-slate-700 transition-colors">
                انصراف
              </button>
              <button onClick={handleAddTool} className="flex-1 px-4 py-3 rounded-xl bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-colors">
                افزودن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Modal */}
      {showPortfolioModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingPortfolio ? 'ویرایش نمونه کار' : 'افزودن نمونه کار'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">عنوان پروژه</label>
                <input
                  type="text"
                  value={newPortfolio.title}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                  placeholder="مثال: وبسایت فروشگاهی"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">توضیحات</label>
                <textarea
                  value={newPortfolio.description}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none resize-none"
                  placeholder="توضیح مختصر پروژه..."
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">رنگ</label>
                <select
                  value={newPortfolio.color}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, color: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                >
                  {colorOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">تگ‌ها</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                    placeholder="مثال: React"
                  />
                  <button onClick={handleAddTag} className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 text-sm font-medium hover:bg-purple-500/30 transition-colors">
                    افزودن
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newPortfolio.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-sm flex items-center gap-2">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="text-red-400 hover:text-red-300">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowPortfolioModal(false); setEditingPortfolio(null); setNewPortfolio({ id: '', title: '', description: '', tags: [], color: 'from-purple-500 to-pink-600' }); }} className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-400 text-sm font-medium hover:bg-slate-700 transition-colors">
                انصراف
              </button>
              <button onClick={handleAddPortfolio} className="flex-1 px-4 py-3 rounded-xl bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-colors">
                {editingPortfolio ? 'ذخیره تغییرات' : 'افزودن'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">ویرایش رزومه</h2>
              <p className="text-slate-400 text-sm">مدیریت اطلاعات صفحه رزومه</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
            >
              بازنشانی
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              ذخیره تغییرات
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'personal', label: 'اطلاعات شخصی', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
          { id: 'about', label: 'درباره من', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          { id: 'skills', label: 'مهارت‌ها', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
          { id: 'portfolio', label: 'نمونه‌کارها', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
          { id: 'contact', label: 'تماس', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Personal Info Tab */}
      {activeTab === 'personal' && (
        <div className="space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">اطلاعات اصلی</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">نام و نام خانوادگی</label>
                <input
                  type="text"
                  value={resume.name}
                  onChange={(e) => setResume({ ...resume, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">عنوان شغلی</label>
                <input
                  type="text"
                  value={resume.title}
                  onChange={(e) => setResume({ ...resume, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">توضیح کوتاه</label>
                <textarea
                  value={resume.description}
                  onChange={(e) => setResume({ ...resume, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">وضعیت</label>
                  <input
                    type="text"
                    value={resume.status}
                    onChange={(e) => setResume({ ...resume, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">حرف آواتار</label>
                  <input
                    type="text"
                    value={resume.avatar}
                    onChange={(e) => setResume({ ...resume, avatar: e.target.value.charAt(0) })}
                    maxLength={1}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">آمار</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">سال تجربه</label>
                <input
                  type="text"
                  value={resume.stats.experience}
                  onChange={(e) => setResume({ ...resume, stats: { ...resume.stats, experience: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none text-center"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">پروژه موفق</label>
                <input
                  type="text"
                  value={resume.stats.projects}
                  onChange={(e) => setResume({ ...resume, stats: { ...resume.stats, projects: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none text-center"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">رضایت مشتری</label>
                <input
                  type="text"
                  value={resume.stats.satisfaction}
                  onChange={(e) => setResume({ ...resume, stats: { ...resume.stats, satisfaction: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none text-center"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">لینک‌های اجتماعی</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">اینستاگرام</label>
                <input
                  type="text"
                  value={resume.socialLinks.instagram}
                  onChange={(e) => setResume({ ...resume, socialLinks: { ...resume.socialLinks, instagram: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">لینکدین</label>
                <input
                  type="text"
                  value={resume.socialLinks.linkedin}
                  onChange={(e) => setResume({ ...resume, socialLinks: { ...resume.socialLinks, linkedin: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">واتساپ</label>
                <input
                  type="text"
                  value={resume.socialLinks.whatsapp}
                  onChange={(e) => setResume({ ...resume, socialLinks: { ...resume.socialLinks, whatsapp: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">تلگرام</label>
                <input
                  type="text"
                  value={resume.socialLinks.telegram}
                  onChange={(e) => setResume({ ...resume, socialLinks: { ...resume.socialLinks, telegram: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Tab */}
      {activeTab === 'about' && (
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">متن درباره من</h3>
          <div className="space-y-4">
            {resume.aboutText.map((text, index) => (
              <div key={index} className="flex gap-3">
                <textarea
                  value={text}
                  onChange={(e) => {
                    const newAbout = [...resume.aboutText]
                    newAbout[index] = e.target.value
                    setResume({ ...resume, aboutText: newAbout })
                  }}
                  rows={3}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none resize-none"
                />
                <button
                  onClick={() => setResume({ ...resume, aboutText: resume.aboutText.filter((_, i) => i !== index) })}
                  className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={() => setResume({ ...resume, aboutText: [...resume.aboutText, ''] })}
              className="w-full py-3 rounded-xl border-2 border-dashed border-slate-700 text-slate-400 hover:border-purple-500/50 hover:text-purple-400 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              افزودن پاراگراف جدید
            </button>
          </div>
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          {/* Programming Languages */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">زبان‌های برنامه‌نویسی</h3>
              <button
                onClick={() => { setEditingSkillType('language'); setShowSkillModal(true); }}
                className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 text-sm font-medium hover:bg-purple-500/30 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                افزودن
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {resume.programmingLanguages.map(skill => (
                <div key={skill.name} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700">
                  <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${skill.color}`} />
                  <span className="text-white text-sm">{skill.name}</span>
                  <button onClick={() => handleRemoveSkill('language', skill.name)} className="text-red-400 hover:text-red-300 mr-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Frameworks */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">فریمورک‌ها و کتابخانه‌ها</h3>
              <button
                onClick={() => { setEditingSkillType('framework'); setShowSkillModal(true); }}
                className="px-4 py-2 rounded-xl bg-pink-500/20 text-pink-400 text-sm font-medium hover:bg-pink-500/30 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                افزودن
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {resume.frameworks.map(skill => (
                <div key={skill.name} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700">
                  <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${skill.color}`} />
                  <span className="text-white text-sm">{skill.name}</span>
                  <button onClick={() => handleRemoveSkill('framework', skill.name)} className="text-red-400 hover:text-red-300 mr-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">ابزارها</h3>
              <button
                onClick={() => setShowToolModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                افزودن
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {resume.tools.map(tool => (
                <span key={tool} className="px-4 py-2 rounded-full bg-slate-800/50 text-gray-300 text-sm border border-slate-700 flex items-center gap-2">
                  {tool}
                  <button onClick={() => handleRemoveTool(tool)} className="text-red-400 hover:text-red-300">×</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Tab */}
      {activeTab === 'portfolio' && (
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">نمونه‌کارها</h3>
            <button
              onClick={() => setShowPortfolioModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 text-sm font-medium hover:bg-purple-500/30 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              افزودن نمونه کار
            </button>
          </div>

          <div className="space-y-4">
            {resume.portfolio.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium mb-1">{item.title}</h4>
                  <p className="text-slate-400 text-sm mb-2 truncate">{item.description}</p>
                  <div className="flex gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-700 text-slate-300 text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditPortfolio(item)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => handleRemovePortfolio(item.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {resume.portfolio.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">هیچ نمونه کاری اضافه نشده است</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">اطلاعات تماس</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">شماره تماس</label>
                <input
                  type="text"
                  value={resume.contact.phone}
                  onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, phone: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">ایمیل</label>
                <input
                  type="email"
                  value={resume.contact.email}
                  onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, email: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">بخش فراخوان (CTA)</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">عنوان</label>
                <input
                  type="text"
                  value={resume.contact.ctaTitle}
                  onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, ctaTitle: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">توضیحات</label>
                <textarea
                  value={resume.contact.ctaDescription}
                  onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, ctaDescription: e.target.value } })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

