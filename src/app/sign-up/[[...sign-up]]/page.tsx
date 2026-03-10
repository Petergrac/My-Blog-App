"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, useSignUp } from "@clerk/nextjs";

import {
  AuthDivider,
  AuthErrors,
  AuthFooterLink,
  AuthNotice,
  AuthShell,
  AuthSubmitButton,
  GitHubIcon,
  GoogleIcon,
  SocialAuthButton,
} from "@/components/auth/auth-ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getClerkErrorMessages } from "@/lib/clerk";

type SignUpView = "start" | "verify_email";

const OAUTH_CALLBACK_URL = "/sso-callback";
const AUTH_COMPLETE_URL = "/";

export default function SignUpPage() {
  const router = useRouter();
  // FIX: useAuth() lets us detect an already-signed-in user and redirect them
  // so clicking OAuth while signed in doesn't show a Clerk error message.
  const { isSignedIn } = useAuth();
  const { errors: signUpErrors, fetchStatus, signUp } = useSignUp();

  const [view, setView] = useState<SignUpView>("start");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [localErrors, setLocalErrors] = useState<string[]>([]);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const errors =
    localErrors.length > 0
      ? localErrors
      : (signUpErrors.global ?? []).map(
          (issue) => issue.longMessage || issue.message,
        );

  const clearFeedback = () => {
    setLocalErrors([]);
    setNotice(null);
  };

  const handleFailure = (error: unknown) => {
    setLocalErrors(getClerkErrorMessages(error));
    setNotice(null);
  };

  const finalizeSignUp = async () => {
    const { error } = await signUp.finalize({
      navigate: async ({
        decorateUrl,
      }: {
        decorateUrl: (url: string) => string;
      }) => {
        const destination = decorateUrl(AUTH_COMPLETE_URL);

        // FIX: More robust URL check — covers both http:// and https://
        if (
          destination.startsWith("http://") ||
          destination.startsWith("https://")
        ) {
          window.location.assign(destination);
          return;
        }

        router.replace(destination);
      },
    });

    if (error) {
      handleFailure(error);
    }
  };

  const prepareEmailVerification = async () => {
    const { error } = await signUp.verifications.sendEmailCode();

    if (error) {
      handleFailure(error);
      return;
    }

    // FIX: Use local emailAddress state — signUp.emailAddress is not reliably
    // set in Core 3 at this point in the flow.
    setNotice(`We sent a verification code to ${emailAddress}.`);
    setVerificationCode("");
    setView("verify_email");
  };

  const handleOAuthSignUp = async (
    strategy: "oauth_google" | "oauth_github",
  ) => {
    // FIX: If the user is already signed in, redirect home immediately
    // instead of triggering a Clerk error / showing an error message.
    if (isSignedIn) {
      router.replace(AUTH_COMPLETE_URL);
      return;
    }

    clearFeedback();
    setPendingAction(strategy);

    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const redirectCallbackUrl = origin
      ? `${origin}${OAUTH_CALLBACK_URL}`
      : OAUTH_CALLBACK_URL;
    const redirectUrl = origin
      ? `${origin}${AUTH_COMPLETE_URL}`
      : AUTH_COMPLETE_URL;

    const { error } = await signUp.sso({
      strategy,
      redirectCallbackUrl,
      redirectUrl,
    });

    if (error) {
      handleFailure(error);
      setPendingAction(null);
    }
  };

  // FIX: Was typed as ChangeEvent<HTMLFormElement> — must be FormEvent
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    clearFeedback();
    setPendingAction("sign-up");

    const { error } = await signUp.password({
      emailAddress,
      firstName,
      lastName,
      password,
      username,
    });

    if (error) {
      handleFailure(error);
      setPendingAction(null);
      return;
    }

    if (signUp.status === "complete") {
      await finalizeSignUp();
      setPendingAction(null);
      return;
    }

    await prepareEmailVerification();
    setPendingAction(null);
  };

  // FIX: Was typed as ChangeEvent<HTMLFormElement> — must be FormEvent
  const handleVerificationSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    clearFeedback();
    setPendingAction("verify-email");

    const { error } = await signUp.verifications.verifyEmailCode({
      code: verificationCode,
    });

    if (error) {
      handleFailure(error);
      setPendingAction(null);
      return;
    }

    if (signUp.status !== "complete") {
      setLocalErrors([
        "Your sign-up still has pending requirements. Please retry the verification flow.",
      ]);
      setPendingAction(null);
      return;
    }

    await finalizeSignUp();
    setPendingAction(null);
  };

  const handleResendVerification = async () => {
    clearFeedback();
    setPendingAction("resend-email");
    await prepareEmailVerification();
    setPendingAction(null);
  };

  const isBusy = fetchStatus === "fetching" || pendingAction !== null;

  return (
    <AuthShell
      title={
        <>
          Create a <span className="text-sky-500">Blo</span>
          <span className="text-yellow-300">og</span> account
        </>
      }
      subtitle="Welcome to bloog application"
    >
      <AuthErrors errors={errors} />
      {notice ? <AuthNotice>{notice}</AuthNotice> : null}

      {view === "start" ? (
        <>
          <div className="space-y-3">
            <SocialAuthButton
              disabled={isBusy}
              icon={<GoogleIcon />}
              loading={pendingAction === "oauth_google"}
              onClick={() => void handleOAuthSignUp("oauth_google")}
              type="button"
            >
              {pendingAction === "oauth_google"
                ? "Redirecting..."
                : "Continue with Google"}
            </SocialAuthButton>
            <SocialAuthButton
              disabled={isBusy}
              icon={<GitHubIcon />}
              loading={pendingAction === "oauth_github"}
              onClick={() => void handleOAuthSignUp("oauth_github")}
              type="button"
            >
              {pendingAction === "oauth_github"
                ? "Redirecting..."
                : "Continue with GitHub"}
            </SocialAuthButton>
          </div>

          <AuthDivider />

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="First name"
                  value={firstName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Last name"
                  value={lastName}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your username"
                value={username}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                onChange={(event) => setEmailAddress(event.target.value)}
                placeholder="Enter your email"
                type="email"
                value={emailAddress}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                type="password"
                value={password}
              />
            </div>

            <AuthSubmitButton
              loading={pendingAction === "sign-up"}
              type="submit"
            >
              Submit
            </AuthSubmitButton>
          </form>

          {/*
            FIX: <div id="clerk-captcha" /> is REQUIRED for Clerk's bot sign-up
            protection (CAPTCHA). It must be present in the DOM before
            signUp.password() is called — without it Clerk throws an error
            and no user can register.
          */}
          <div id="clerk-captcha" />

          <p className="text-xs text-muted-foreground">
            By signing up, you agree to the Terms of Service, Privacy Policy,
            and Cookie Use requirements configured for this app.
          </p>
          <AuthFooterLink
            action="Sign in"
            href="/sign-in"
            label="Already have an account?"
          />
        </>
      ) : null}

      {view === "verify_email" ? (
        <form className="space-y-4" onSubmit={handleVerificationSubmit}>
          <button
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => {
              clearFeedback();
              setView("start");
            }}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="space-y-2">
            <Label htmlFor="verification-code">Verification code</Label>
            <Input
              autoComplete="one-time-code"
              id="verification-code"
              inputMode="numeric"
              onChange={(event) => setVerificationCode(event.target.value)}
              placeholder="Enter the code"
              value={verificationCode}
            />
          </div>
          <div className="space-y-3">
            <AuthSubmitButton
              loading={pendingAction === "verify-email"}
              type="submit"
            >
              Verify email
            </AuthSubmitButton>
            <button
              className="text-sm text-sky-500 transition-colors hover:text-sky-400"
              onClick={() => void handleResendVerification()}
              type="button"
            >
              Send a new code
            </button>
          </div>
        </form>
      ) : null}
    </AuthShell>
  );
}
