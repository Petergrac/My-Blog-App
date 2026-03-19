"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/onboarding";
  const [googleLoading, setGoogleLoading] = useState(false);
  const [credentialsLoading, setCredentialsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const error = searchParams.get("error");
  const baseErrors = error
    ? ["We couldn't create your account. Please try again."]
    : [];
  const combinedErrors = [...baseErrors, ...errors];

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl });
  };

  const handleCredentialsSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors([]);

    if (!email.trim() || !username.trim() || !password) {
      setErrors(["Please fill in email, username, and password."]);
      return;
    }

    if (password !== confirmPassword) {
      setErrors(["Passwords do not match."]);
      return;
    }

    setCredentialsLoading(true);
    let response: Response;
    try {
      response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });
    } catch (error) {
      console.error(error);
      setErrors(["Could not reach the server. Please try again."]);
      setCredentialsLoading(false);
      return;
    }

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setErrors([data?.error ?? "Could not create your account."]);
      setCredentialsLoading(false);
      return;
    }

    let result: Awaited<ReturnType<typeof signIn>>;
    try {
      result = await signIn("credentials", {
        redirect: false,
        callbackUrl,
        email,
        password,
      });
    } catch (error) {
      console.error(error);
      setErrors([
        "Account created, but we couldn't sign you in right now. Please try again.",
      ]);
      setCredentialsLoading(false);
      return;
    }

    if (!result || !result.ok) {
      setErrors([
        result?.error
          ? "Account created, but we couldn't sign you in. Please use the sign in page."
          : "Account created, but we couldn't sign you in right now. Please try again.",
      ]);
      setCredentialsLoading(false);
      return;
    }

    router.push(result?.url ?? callbackUrl);
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start reading and publishing in minutes."
    >
      <AuthErrors errors={combinedErrors} />
      <form className="space-y-4" onSubmit={handleCredentialsSignUp}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            disabled={credentialsLoading || googleLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="your_handle"
            disabled={credentialsLoading || googleLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={credentialsLoading || googleLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={credentialsLoading || googleLoading}
          />
        </div>
        <AuthSubmitButton loading={credentialsLoading} type="submit">
          Create account
        </AuthSubmitButton>
      </form>
      <AuthDivider />
      <SocialAuthButton
        icon={<GoogleIcon />}
        loading={googleLoading}
        onClick={handleGoogleSignUp}
      >
        Sign up with Google
      </SocialAuthButton>
      <AuthNotice>
        New here? We will guide you through a quick onboarding to pick your
        role.
      </AuthNotice>
      <AuthFooterLink
        href="/sign-in"
        label="Already have an account?"
        action="Sign in"
      />
    </AuthShell>
  );
}
