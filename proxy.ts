import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Next.js 16 Edge runtime compatibility - initializing Supabase client inline
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // PROTECTED ROUTES: If no user, redirect to login
  if (
    !user &&
    (url.pathname.startsWith('/dashboard') || 
     url.pathname.startsWith('/onboarding') ||
     url.pathname.startsWith('/settings') ||
     url.pathname.startsWith('/orders') ||
     url.pathname.startsWith('/products'))
  ) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // AUTH ROUTES: If user already logged in, redirect to dashboard
  if (
    user &&
    (url.pathname.startsWith('/login') || url.pathname.startsWith('/signup'))
  ) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/onboarding', 
    '/login', 
    '/signup', 
    '/settings', 
    '/orders', 
    '/products'
  ],
}
