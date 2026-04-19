'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  return redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  })

  if (error) {
    return redirect(`/signup?message=${encodeURIComponent(error.message)}`)
  }

  // After signup, redirect to check email or onboarding (depends on confirm email setting)
  // For Supabase default (confirm email enabled), they might need to check email first.
  return redirect('/login?message=Check your email to continue')
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/api/auth/callback`,
    },
  })

  if (error) {
    return redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  return redirect(data.url)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/')
}
