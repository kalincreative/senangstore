'use client'

import { useState, useEffect } from 'react'
import { checkSlug, completeOnboarding } from '../onboarding-actions'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [storeName, setStoreName] = useState('')
  const [slug, setSlug] = useState('')
  const [bio, setBio] = useState('')
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null)
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (slug.length >= 3) {
        setIsCheckingSlug(true)
        const available = await checkSlug(slug)
        setIsSlugAvailable(available)
        setIsCheckingSlug(false)
      } else {
        setIsSlugAvailable(null)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [slug])

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('store_name', storeName)
    formData.append('store_slug', slug)
    formData.append('store_bio', bio)

    const result = await completeOnboarding(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-[#00685f]/5 p-8 sm:p-12 border border-[#e7eeff] animate-in fade-in zoom-in duration-500">
        
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-[#00685f]' : s < step ? 'bg-[#00685f]/40' : 'bg-[#e7eeff]'}`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-[#111c2d] mb-2">What&apos;s your store called?</h1>
                <p className="text-[#6d7a77]">This will be shown on your storefront and invoices.</p>
              </div>
              <input
                autoFocus
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="My Awesome Studio"
                className="w-full text-center text-2xl font-semibold py-4 bg-transparent border-b-2 border-[#e7eeff] focus:border-[#00685f] outline-none transition-all placeholder:text-[#bcc9c6]"
                required
              />
              <button
                type="button"
                onClick={nextStep}
                disabled={!storeName}
                className="w-full py-4 bg-[#00685f] text-white rounded-2xl font-bold shadow-lg shadow-[#00685f]/20 hover:bg-[#005049] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-[#111c2d] mb-2">Claim your URL</h1>
                <p className="text-[#6d7a77]">senangstore.com/<span className="text-[#00685f] font-bold">{slug || 'yourstore'}</span></p>
              </div>
              <div className="relative">
                <input
                  autoFocus
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="your-brand-name"
                  className="w-full text-center text-xl font-medium py-4 bg-transparent border-b-2 border-[#e7eeff] focus:border-[#00685f] outline-none transition-all placeholder:text-[#bcc9c6]"
                  required
                />
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  {isCheckingSlug && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00685f]"></div>
                  )}
                  {isSlugAvailable === true && !isCheckingSlug && (
                    <span className="text-green-500 font-bold">✓</span>
                  )}
                  {isSlugAvailable === false && !isCheckingSlug && (
                    <span className="text-red-500 font-bold">✗</span>
                  )}
                </div>
              </div>
              <p className="text-xs text-center text-[#6d7a77]">Only lowercase letters, numbers, and hyphens allowed.</p>
              
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-4 bg-[#f0f3ff] text-[#111c2d] rounded-2xl font-bold hover:bg-[#e7eeff] transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isSlugAvailable}
                  className="flex-[2] py-4 bg-[#00685f] text-white rounded-2xl font-bold shadow-lg shadow-[#00685f]/20 hover:bg-[#005049] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm URL
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-[#111c2d] mb-2">Tell us about your brand</h1>
                <p className="text-[#6d7a77]">A short bio to introduce yourself to your customers.</p>
              </div>
              <textarea
                autoFocus
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ex: Curating the best digital assets for Malaysian designers."
                className="w-full h-32 p-4 rounded-2xl bg-[#f9f9ff] border-2 border-[#e7eeff] focus:border-[#00685f] outline-none transition-all resize-none"
              />
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-4 bg-[#f0f3ff] text-[#111c2d] rounded-2xl font-bold hover:bg-[#e7eeff] transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] py-4 bg-[#00685f] text-white rounded-2xl font-bold shadow-lg shadow-[#00685f]/20 hover:bg-[#005049] transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Launch Store'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
