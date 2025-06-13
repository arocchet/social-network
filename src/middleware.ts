import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "./lib/jwt/verifyJwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Routes publiques
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // API publiques
  const isPublicApi = pathname.startsWith('/api/public');

  // Extensions d'images
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.bmp'];
  const isImageRequest = imageExtensions.some(ext => pathname.toLowerCase().endsWith(ext));

  if (isPublicRoute || isPublicApi || isImageRequest) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const payload = await verifyJwt(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const res = NextResponse.next();
  res.headers.set("x-user-id", payload.userId);
  return res;
}

export const config = {
  // Matcher pour toutes les routes sauf les fichiers statiques Next.js
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