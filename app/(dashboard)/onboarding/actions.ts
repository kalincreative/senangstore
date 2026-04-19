'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function checkSlug(slug: string) {
  const supabase = await createClient()
  
  // Reserved words check (matching DB constraint)
  const reservedSlugs = ['dashboard', 'api', 'admin', 'login', 'signup', 'onboarding', 'settings', 'orders', 'products', 'checkout', 'api', 'static', 'public']
  if (reservedSlugs.includes(slug.toLowerCase())) {
    return false
  }

  const { data } = await supabase
    .from('merchants')
    .select('store_slug')
    .eq('store_slug', slug.toLowerCase())
    .single()
  
  return !data
}

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const store_name = formData.get('store_name') as string
  const store_slug = (formData.get('store_slug') as string).toLowerCase().trim()
  const store_bio = formData.get('store_bio') as string

  const { error } = await supabase.from('merchants').insert({
    id: user.id,
    store_name,
    store_slug,
    store_bio,
    plan: 'free',
    currency: 'MYR'
  })

  if (error) {
    console.error('Onboarding error:', error)
    return { error: error.message }
  }

  return redirect('/dashboard')
}
