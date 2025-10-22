import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const publicPages = ['/sign-in', '/sign-up'];

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isPublicPage = publicPages.some((page) => pathname.includes(page));

  if (isPublicPage) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return intlMiddleware(req);
  }

  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  const completedOnboarding = token.completedOnboarding as boolean | undefined;

  if (!completedOnboarding && !pathname.includes('/onboarding')) {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  if (completedOnboarding && pathname.includes('/onboarding')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
