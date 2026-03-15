import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  const isAdminRoot  = pathname === '/admin'
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
}

export const config = {
  matcher: ['/admin/:path*'],
}
