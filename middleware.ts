import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Guard: env vars must be present for Supabase to work in edge runtime
  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If env vars are missing, pass through — client-side layout.tsx handles auth
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next()
  }

  try {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2]),
            )
          },
        },
      },
    )

    // Refresh the session — required for Server Components
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl

    const isAdminRoute = pathname.startsWith('/admin')
    const isLoginPage  = pathname === '/admin/login'

    // Unauthenticated → redirect to login
    if (isAdminRoute && !isLoginPage && !user) {
      const redirect = request.nextUrl.clone()
      redirect.pathname = '/admin/login'
      return NextResponse.redirect(redirect)
    }

    // Already authenticated → skip the login page
    if (isLoginPage && user) {
      const redirect = request.nextUrl.clone()
      redirect.pathname = '/admin'
      return NextResponse.redirect(redirect)
    }

    return supabaseResponse
  } catch {
    // If anything fails in the edge runtime, pass through safely.
    // The client-side auth check in app/admin/layout.tsx handles the redirect.
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
