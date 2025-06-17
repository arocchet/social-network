import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "./lib/jwt/verifyJwt";
import { defaultLocale, locales, type Locale } from "./config/i18n";

function getLocale(request: NextRequest): Locale {
  const pathname = request.nextUrl.pathname;

  // 1. Locale dans l’URL
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) {
    return pathname.split("/")[1] as Locale;
  }

  // 2. Locale dans les cookies
  const cookieLocale = request.cookies.get("locale")?.value as Locale;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 3. Locale dans les headers
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(",")[0].split("-")[0] as Locale;
    if (locales.includes(preferred)) {
      return preferred;
    }
  }

  // 4. Locale par défaut
  return defaultLocale;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Cas API publique (on ne fait rien)
  if (pathname.startsWith("/api/public")) {
    return NextResponse.next();
  }

  // 2. Cas API privée
  if (pathname.startsWith("/api/")) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const payload = await verifyJwt(token);
    if (!payload) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const res = NextResponse.next();
    res.headers.set("x-user-id", payload.userId);
    return res;
  }

  // 3. Cas ressources statiques ou images
  const isStatic = pathname.startsWith("/_next/") || pathname === "/favicon.ico";
  const isImage = [".jpg", ".jpeg", ".png", ".svg", ".webp", ".gif"].some(ext =>
    pathname.toLowerCase().endsWith(ext)
  );
  if (isStatic || isImage) {
    return NextResponse.next();
  }

  // 4. Cas routes web → vérifier locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(req);
    const redirectUrl = new URL(`/${locale}${pathname}${req.nextUrl.search}`, req.url);
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set("locale", locale, { maxAge: 60 * 60 * 24 * 365 }); // 1 an
    return response;
  }

  // 5. Authentification des routes web privées
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route) ||
    locales.some(locale => pathname.startsWith(`/${locale}${route}`))
  );

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
    '/((?!_next/static|_next/image|favicon.ico|api/public).*)',
  ],
};