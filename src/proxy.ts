import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isOboardingRoute = createRouteMatcher(["/onboarding"]);
const isAuthFlowRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
]);
const isProtectedRoute = createRouteMatcher(["/user-profile(.*)"]);
const isAuthorRoute = createRouteMatcher([
  "/new(.*)",
  "/blog/my-blogs(.*)",
  "/blog/edit/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  // If the route is onboarding
  if (userId && (isOboardingRoute(req) || isAuthFlowRoute(req))) {
    return NextResponse.next();
  }

  // Redirect them to the /onboarding route to complete onboarding
  if (userId && !sessionClaims?.metadata?.onboardingComplete) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // Restrict author routes
  if (isAuthorRoute(req)) {
    await auth.protect();

    const hasAuthorPermission =
      sessionClaims?.metadata?.role === "Admin" ||
      sessionClaims?.metadata?.role === "Author";

    if (!hasAuthorPermission) {
      const redirectUrl = new URL("/unauthorized", req.url);
      redirectUrl.searchParams.set(
        "error",
        "You are not authorized to access this route"
      );
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If the route is protected
  if (isProtectedRoute(req)) {
    // This will handle standard protection; no specific message is provided.
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
