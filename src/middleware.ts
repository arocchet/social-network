// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "./lib/jwt/verifyJwt";
import { defaultLocale, locales, type Locale } from "./config/i18n";

function getLocale(request: NextRequest): Locale {
  // 1. Vérifier dans l'URL
  const pathname = request.nextUrl.pathname;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return pathname.split('/')[1] as Locale;
  }

  // 2. Vérifier dans les cookies
  const cookieLocale = request.cookies.get('locale')?.value as Locale;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 3. Vérifier dans les headers Accept-Language
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')[0]
      .split('-')[0] as Locale;
    if (locales.includes(preferredLocale)) {
      return preferredLocale;
    }
  }

  // 4. Retourner la locale par défaut
  return defaultLocale;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Vérifier si la pathname contient déjà une locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Routes publiques (sans locale)
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route) ||
    locales.some(locale => pathname.startsWith(`/${locale}${route}`))
  );

  // API publiques
  const isPublicApi = pathname.startsWith('/api/public');

  // Extensions d'images
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.bmp'];
  const isImageRequest = imageExtensions.some(ext => pathname.toLowerCase().endsWith(ext));

  // Fichiers statiques Next.js
  const isNextStaticFile = pathname.startsWith('/_next/') || pathname === '/favicon.ico';

  if (isPublicApi || isImageRequest || isNextStaticFile) {
    return NextResponse.next();
  }

  // Rediriger vers la locale appropriée si elle n'est pas présente
  if (!pathnameHasLocale) {
    const locale = getLocale(req);
    const redirectUrl = new URL(`/${locale}${pathname}${req.nextUrl.search}`, req.url);

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set('locale', locale, { maxAge: 60 * 60 * 24 * 365 }); // 1 an
    return response;
  }

  // Vérification d'authentification pour les routes protégées
  if (!isPublicRoute) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      const locale = getLocale(req);
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }

    const payload = await verifyJwt(token);
    if (!payload) {
      const locale = getLocale(req);
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }

    const res = NextResponse.next();
    res.headers.set("x-user-id", payload.userId);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};