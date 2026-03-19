"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import {
  AuthDivider,
  AuthErrors,
  AuthFooterLink,
  AuthNotice,
  AuthShell,
  AuthSubmitButton,
  GoogleIcon,
  SocialAuthButton,
} from "@/components/auth/auth-ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [googleLoading, setGoogleLoading] = useState(false);
  const [credentialsLoading, setCredentialsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const error = searchParams.get("error");
  const baseErrors = error
    ? ["We couldn't sign you in. Please try again."]
    : [];
  const combinedErrors = [...baseErrors, ...errors];

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl });
  };

  const handleCredentialsSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors([]);
    if (!identifier.trim() || !password) {
      setErrors(["Please enter your email or username and password."]);
      return;
    }
    setCredentialsLoading(true);
    let result: Awaited<ReturnType<typeof signIn>>;
    try {
      result = await signIn("credentials", {
        redirect: false,
        callbackUrl,
        email: identifier,
        password,
      });
    } catch (error) {
      console.error(error);
      setErrors(["We couldn't sign you in right now. Please try again."]);
      setCredentialsLoading(false);
      return;
    }

    if (!result || !result.ok) {
      setErrors([
        result?.error
          ? "Invalid email/username or password."
          : "We couldn't sign you in right now. Please try again.",
      ]);
      setCredentialsLoading(false);
      return;
    }
    window.location.href = result?.url ?? callbackUrl;
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
    >
      <AuthErrors errors={combinedErrors} />
      <form className="space-y-4" onSubmit={handleCredentialsSignIn}>
        <div className="space-y-2">
          <Label htmlFor="identifier">Email or username</Label>
          <Input
            id="identifier"
            name="identifier"
            autoComplete="username"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="you@example.com"
            disabled={credentialsLoading || googleLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={credentialsLoading || googleLoading}
          />
        </div>
        <AuthSubmitButton loading={credentialsLoading} type="submit">
          Sign in
        </AuthSubmitButton>
      </form>
      <AuthDivider />
      <SocialAuthButton
        icon={<GoogleIcon />}
        loading={googleLoading}
        onClick={handleGoogleSignIn}
      >
        Continue with Google
      </SocialAuthButton>
      <AuthNotice>
        We&apos;ll never post on your behalf. Sign in keeps your drafts, likes,
        and reading list in sync.
      </AuthNotice>
      <AuthFooterLink
        href="/sign-up"
        label="New to Bloog?"
        action="Create an account"
      />
    </AuthShell>
  );
}
