import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_LOGGED_IN_ROUTE,
  ALLOWED_OPENLIT_ROUTES_WITHOUT_TOKEN,
} from "@/constants/route";

export default function checkAuth(next: NextMiddleware) {
  return async function middleware(request: NextRequest, _next: NextFetchEvent) {
    const pathname = request.nextUrl.pathname;
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/static") ||
      pathname.startsWith("/images")
    ) {
      return next(request, _next);
    }

    const token = await getToken({ req: request });
    const isAuth = !!token;
    const isAllowedRequestWithoutToken =
      ALLOWED_OPENLIT_ROUTES_WITHOUT_TOKEN.includes(pathname);
    const isAuthPage =
      pathname.startsWith("/login") || pathname.startsWith("/register");
    const isApiPage = pathname.startsWith("/api");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL(DEFAULT_LOGGED_IN_ROUTE, request.url));
      }

      return NextResponse.next();
    }

    if (isApiPage) {
      if (isAuth || isAllowedRequestWithoutToken) {
        return NextResponse.next();
      }
    }

    if (!isAuth) {
      let from = pathname;
      if (request.nextUrl.search) {
        from += request.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(from)}`, request.url)
      );
    }

    return NextResponse.next();
  }
}
