import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isOboardingRoute = createRouteMatcher(["/onboarding"]);

const isProtectedRoute = createRouteMatcher(["/new(.*)", "/comment(.*)"]);
export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // If the route is onboarding
  if (userId && isOboardingRoute(req)) {
    return NextResponse.next();
  }

  // Redirect them to the /onboarding route to complete onboarding
  if (userId && !sessionClaims?.metadata?.onboardingComplete) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // If the route is protected
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
