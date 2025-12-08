'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { getGalleryItems, GalleryItem } from '@/lib/gallery'
import { useLanguage } from '@/lib/LanguageContext'

export default function Gallery() {
  const [isVisible, setIsVisible] = useState(false)
  const [items, setItems] = useState<GalleryItem[]>([])
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

  const loadItems = useCallback(() => {
    const galleryItems = getGalleryItems()
    setItems(galleryItems)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Load gallery items immediately
    loadItems()

    // Listen for storage changes (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fiberglass_gallery') {
        loadItems()
      }
    }
    window.addEventListener('storage', handleStorageChange)

    // Check for updates every 500ms (same-tab updates)
    const interval = setInterval(loadItems, 500)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [loadItems])

  return (
    <>
      <section ref={sectionRef} id="gallery" className="py-12 sm:py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
        <div className="absolute end-0 top-1/3 w-48 sm:w-80 h-48 sm:h-80 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className={`text-center max-w-3xl mx-auto mb-8 sm:mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="text-green-400 font-semibold text-xs sm:text-sm tracking-wider">{t.gallery.sectionTitle}</span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-2 sm:mt-3 mb-4 sm:mb-6">
              {t.gallery.title} <span className="gradient-text">{t.gallery.titleHighlight}</span>
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base px-2">
              {t.gallery.description}
            </p>
          </div>

          {/* Gallery Content */}
          {items.length === 0 ? (
            /* Empty State */
            <div className={`text-center py-10 sm:py-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-2xl sm:rounded-3xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-8 sm:w-12 h-8 sm:h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm sm:text-base">{t.gallery.emptyState}</p>
            </div>
          ) : (
            /* Gallery Grid */
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`group relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 hover:shadow-2xl hover:shadow-purple-500/20 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${Math.min(index * 100, 500)}ms` }}
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Thumbnail */}
                  <div className="aspect-[4/3] bg-slate-800 relative overflow-hidden">
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                        />
                        {/* Play Icon Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="w-10 sm:w-16 h-10 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-5 sm:w-8 h-5 sm:h-8 text-white ms-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-bold mb-0.5 sm:mb-1 text-xs sm:text-base line-clamp-1">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-300 text-[10px] sm:text-sm line-clamp-1 sm:line-clamp-2 hidden xs:block">{item.description}</p>
                      )}
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-2 sm:top-3 end-2 sm:end-3">
                      <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium backdrop-blur-sm ${
                        item.type === 'image' 
                          ? 'bg-blue-500/80 text-white' 
                          : 'bg-purple-500/80 text-white'
                      }`}>
                        {item.type === 'image' ? t.gallery.image : t.gallery.video}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-2 sm:top-4 start-2 sm:start-4 z-10 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <svg className="w-5 sm:w-6 h-5 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Media */}
            <div className="aspect-video bg-black flex items-center justify-center">
              {selectedItem.type === 'image' ? (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <video
                  src={selectedItem.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-full"
                />
              )}
            </div>

            {/* Info */}
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-xl font-bold text-white mb-1 sm:mb-2">{selectedItem.title}</h3>
              {selectedItem.description && (
                <p className="text-gray-400 text-sm sm:text-base">{selectedItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
