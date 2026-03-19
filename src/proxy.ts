import { auth } from "@/auth";
import { NextResponse } from "next/server";

const isAuthFlowRoute = (pathname: string) =>
  pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

const isApiAuthRoute = (pathname: string) => pathname.startsWith("/api/auth");

const isOnboardingRoute = (pathname: string) =>
  pathname.startsWith("/onboarding");

const isProtectedRoute = (pathname: string) =>
  pathname.startsWith("/user-profile");

const isAuthorRoute = (pathname: string) =>
  pathname.startsWith("/new") ||
  pathname.startsWith("/blog/my-blogs") ||
  pathname.startsWith("/blog/edit");

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const user = session?.user;

  // Always let /api/auth/* pass through — NextAuth needs these
  if (isApiAuthRoute(pathname)) {
    return NextResponse.next();
  }

  // Redirect logged-in users away from sign-in/sign-up
  if (user && isAuthFlowRoute(pathname)) {
    if (!user.onboardingComplete) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Send users who haven't completed onboarding to /onboarding
  if (user && !user.onboardingComplete && !isOnboardingRoute(pathname)) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (isAuthorRoute(pathname)) {
    if (!user) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
    if (user.role !== "Admin" && user.role !== "Author") {
      const redirectUrl = new URL("/unauthorized", req.url);
      redirectUrl.searchParams.set(
        "error",
        "You are not authorized to access this route",
      );
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (isProtectedRoute(pathname) && !user) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
