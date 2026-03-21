import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_PATH = "/login";
export const ACCESS_TOKEN_COOKIE_NAME = "level_up_access_token";

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
  const hasAccessToken = Boolean(accessToken);

  if (
    !hasAccessToken &&
    request.nextUrl.pathname !== AUTH_PATH &&
    !request.nextUrl.pathname.startsWith(`${AUTH_PATH}/`)
  ) {
    return NextResponse.redirect(new URL(AUTH_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp)|api).*)",
  ],
};
