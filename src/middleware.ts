import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res }, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })

  // Получаем сессию
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Проверяем токен в заголовках
  const authHeader = req.headers.get('authorization')
  
  // Проверяем cookies для сессии
  const sessionCookie = req.cookies.get('sb-chat-ai-auth-auth-token')
  const accessTokenCookie = req.cookies.get('sb-chat-ai-auth-access-token')
  const refreshTokenCookie = req.cookies.get('sb-chat-ai-auth-refresh-token')
  const hasSessionCookie = !!(sessionCookie || accessTokenCookie || refreshTokenCookie)
  
  // console.log('Cookies found:', {
  //   session: !!sessionCookie,
  //   access: !!accessTokenCookie,
  //   refresh: !!refreshTokenCookie
  // })
  
  // console.log('Middleware - pathname:', req.nextUrl.pathname, 'session:', !!session, 'user:', session?.user?.email, 'hasSessionCookie:', hasSessionCookie)

  // Защищенные роуты
  const protectedRoutes = ['/chat', '/profile', '/settings', '/upgrade']
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // Роуты аутентификации
  const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password']
  const isAuthRoute = authRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // Отключаем middleware для защищенных маршрутов - полагаемся на клиентскую проверку
  // if (!session && !hasSessionCookie && isProtectedRoute) {
  //   const redirectUrl = req.nextUrl.clone()
  //   redirectUrl.pathname = '/'
  //   return NextResponse.redirect(redirectUrl)
  // }

  // Если пользователь авторизован и пытается получить доступ к роутам аутентификации
  if (session && isAuthRoute) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/chat'
    return NextResponse.redirect(redirectUrl)
  }



  // Устанавливаем заголовки для кэширования
  res.headers.set('Cache-Control', 'no-store')
  
  return res
}

export const config = {
  matcher: [
    '/',
    '/chat/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/upgrade',
    '/auth/:path*',
  ],
}
