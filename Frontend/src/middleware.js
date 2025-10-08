import { NextResponse } from "next/server";

export function middleware(request) {
  const session = request.cookies.get("session");

  // Si no hay sesión y no estamos en la página de login, redirigir al login
  if (!session && !request.nextUrl.pathname.startsWith("/auth/login")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Si hay sesión y estamos en login, redirigir a home
  if (session && request.nextUrl.pathname.startsWith("/auth/login")) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/admin/:path*", "/auth/login"],
};
