"use client";

import { Loader2 } from "lucide-react";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <div className="bg-muted flex min-h-screen w-full items-center justify-center px-6">
      <div className="flex items-center gap-3 rounded-full border border-border bg-background px-5 py-3 text-sm text-muted-foreground shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        Completing sign-in...
      </div>
      <AuthenticateWithRedirectCallback
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        signInFallbackRedirectUrl="/"
        signUpForceRedirectUrl="/onboarding"
      />
    </div>
  );
}
