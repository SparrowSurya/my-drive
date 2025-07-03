import { NextResponse, NextRequest } from "next/server";


export default function middleware(request: NextRequest) {
  const token = request.cookies.get("next-auth.session-token") || request.cookies.get("__Secure-next-auth.session-token");

  if (!!token && request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/drive/home", request.nextUrl.origin));
  }

  if (!token && request.nextUrl.pathname.startsWith("/drive")) {
    const searchParams = new URLSearchParams({
      callbackUrl: request.nextUrl.pathname,
    });
    const loginUrl = `/auth/login?${searchParams}`;
    return NextResponse.redirect(new URL(loginUrl, request.nextUrl.origin));
  }

  return NextResponse.next();
}

