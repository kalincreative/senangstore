import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirect URL
  const next = searchParams.get('next') ?? '/onboarding'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Logic to check if user needs onboarding
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if merchant profile already exists
        const { data: merchant } = await supabase
          .from('merchants')
          .select('id')
          .eq('id', user.id)
          .single()

        if (merchant) {
          return NextResponse.redirect(`${origin}/dashboard`)
        }
      }
      
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?message=Could not authenticate user`)
}
