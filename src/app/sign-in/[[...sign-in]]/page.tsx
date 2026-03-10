"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, useSignIn } from "@clerk/nextjs";

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

type SignInView =
  | "start"
  | "password"
  | "email_code"
  | "forgot_password"
  | "reset_password_code"
  | "reset_password"
  | "second_factor";

type FirstFactorStrategy =
  | "password"
  | "email_code"
  | "reset_password_email_code";
type SecondFactorStrategy =
  | "email_code"
  | "phone_code"
  | "totp"
  | "backup_code";

const SECOND_FACTOR_LABELS: Record<SecondFactorStrategy, string> = {
  email_code: "Email code",
  phone_code: "SMS code",
  totp: "Authenticator code",
  backup_code: "Backup code",
};

const OAUTH_CALLBACK_URL = "/sso-callback";
const AUTH_COMPLETE_URL = "/";

export default function SignInPage() {
  const router = useRouter();
  // FIX: useAuth() lets us detect an already-signed-in user and redirect them
  const { isSignedIn } = useAuth();
  // FIX: Core 3 — `errors` and `fetchStatus` are top-level return values
  const { errors: signInErrors, fetchStatus, signIn } = useSignIn();

  const [view, setView] = useState<SignInView>("start");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secondFactorCode, setSecondFactorCode] = useState("");
  const [firstFactorStrategy, setFirstFactorStrategy] =
    useState<FirstFactorStrategy | null>(null);
  const [secondFactorStrategy, setSecondFactorStrategy] =
    useState<SecondFactorStrategy | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [localErrors, setLocalErrors] = useState<string[]>([]);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  // FIX: Use local identifier state as the source of truth. signIn.identifier
  // is not reliably present in Core 3 before a create() call completes.
  const safeIdentifier = identifier;

  const supportedFirstFactors = signIn.supportedFirstFactors ?? [];
  const supportedSecondFactors = (signIn.supportedSecondFactors ?? []).filter(
    (factor): factor is typeof factor & { strategy: SecondFactorStrategy } =>
      factor.strategy === "email_code" ||
      factor.strategy === "phone_code" ||
      factor.strategy === "totp" ||
      factor.strategy === "backup_code",
  );
  const canUsePassword = supportedFirstFactors.some(
    (factor) => factor.strategy === "password",
  );
  const canUseEmailCode = supportedFirstFactors.some(
    (factor) => factor.strategy === "email_code",
  );

  // FIX: Core 3 errors structure — `signInErrors.global` is the array of global errors
  const errors =
    localErrors.length > 0
      ? localErrors
      : (signInErrors.global ?? []).map(
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

  const finalizeSignIn = async () => {
    const { error } = await signIn.finalize({
      navigate: async ({
        decorateUrl,
      }: {
        decorateUrl: (url: string) => string;
      }) => {
        const destination = decorateUrl(AUTH_COMPLETE_URL);

        // FIX: Handle both absolute and relative URLs robustly
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

  const handleSignInState = async () => {
    if (signIn.status === "complete") {
      await finalizeSignIn();
      return;
    }

    if (signIn.status === "needs_new_password") {
      setView("reset_password");
      return;
    }

    if (signIn.status === "needs_second_factor") {
      await prepareSecondFactor();
      return;
    }

    if (signIn.status === "needs_first_factor") {
      if (firstFactorStrategy === "email_code") {
        setView("email_code");
        return;
      }

      if (firstFactorStrategy === "reset_password_email_code") {
        setView("reset_password_code");
        return;
      }

      if (canUsePassword) {
        setFirstFactorStrategy("password");
        setView("password");
        return;
      }

      if (canUseEmailCode) {
        await sendEmailCode();
      }
    }
  };

  const prepareSecondFactor = async () => {
    if (!supportedSecondFactors.length) {
      setLocalErrors([
        "This account requires a second factor that this custom flow does not handle yet.",
      ]);
      return;
    }

    const preferred =
      supportedSecondFactors.find((factor) => factor.strategy === "email_code")
        ?.strategy || supportedSecondFactors[0].strategy;

    setSecondFactorStrategy(preferred);
    setSecondFactorCode("");
    setView("second_factor");

    if (preferred === "email_code") {
      const { error } = await signIn.mfa.sendEmailCode();

      if (error) {
        handleFailure(error);
        return;
      }

      setNotice(`We sent a code to ${safeIdentifier}.`);
      return;
    }

    if (preferred === "phone_code") {
      const { error } = await signIn.mfa.sendPhoneCode();

      if (error) {
        handleFailure(error);
        return;
      }

      setNotice("We sent a code to your phone.");
      return;
    }

    setNotice(null);
  };

  const handleOAuthSignIn = async (
    strategy: "oauth_google" | "oauth_github",
  ) => {
    // FIX: If the user is already signed in, just redirect them home instead
    // of showing an error message or trying to re-authenticate.
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

    const { error } = await signIn.sso({
      strategy,
      redirectCallbackUrl,
      redirectUrl,
    });

    if (error) {
      handleFailure(error);
      setPendingAction(null);
    }
  };

  // FIX: Form submit handlers must use FormEvent, not ChangeEvent<HTMLFormElement>
  const handleStartSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    clearFeedback();

    if (!identifier.trim()) {
      setLocalErrors(["Enter your email address to continue."]);
      return;
    }

    setPendingAction("identifier");

    const { error } = await signIn.create({ identifier });

    if (error) {
      handleFailure(error);
      setPendingAction(null);
      return;
    }

    setPassword("");
    setEmailCode("");
    setFirstFactorStrategy(null);
    await handleSignInState();
    setPendingAction(null);
  };

  const sendEmailCode = async () => {
    clearFeedback();
    setPendingAction("send-email-code");

    // FIX: Always pass the emailAddress — signIn.identifier is unreliable in Core 3
    const { error } = await signIn.emailCode.sendCode({
      emailAddress: identifier.trim(),
    });

    if (error) {
      handleFailure(error);
      setPendingAction(null);
      return;
    }

    setFirstFactorStrategy("email_code");
    setEmailCode("");
    setNotice(`We sent a code to ${safeIdentifier}.`);
    setView("email_code");
    setPendingAction(null);
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    clearFeedback();
    setPendingAction("password");

    const { error } = await signIn.password({ password });

    if (error) {
      handleFailure(error);
      setPendingAction(null);
      return;
    }

    await handleSignInState();
    setPendingAction(null);
  };

  const handleEmailCodeSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    clearFeedback();
    setPendingAction("email-code");

    const { error } = await signIn.emailCode.verifyCode({ code: emailCode });

    if (error) {
      handleFailure(error);
      setPendingAction(null);
      return;
    }

    await handleSignInState();
    setPendingAction(null);
  };

  const sendResetPasswordCode = async () => {
    clearFeedback();
    setPendingAction("reset-password-send");

    // FIX: In Core 3, if there is no active sign-in attempt we create one first.
    // signIn.status being undefined/null means no attempt has been initiated.
    if (!signIn.status) {
      const { error: createError } = await signIn.create({
        identifier: identifier.trim(),
      });

      if (createError) {
        handleFailure(createError);
        setPendingAction(null);
        return;
      }
    }

    const { error } = await signIn.resetPasswordEmailCode.sendCode();

    if (error) {
      handleFailure(error);
      setPendingAction(null);
      return;
    }

    setFirstFactorStrategy("reset_password_email_code");
    setResetCode("");
    setNotice(`We sent a reset code to ${safeIdentifier}.`);
    setView("reset_password_code");
    setPendingAction(null);
  };

  const handleResetCodeSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    clearFeedback();
    setPendingAction("reset-password-code");

    const { error } = await signIn.resetPasswordEmailCode.verifyCode({
      code: resetCode,
    });

    if (error) {
      handleFailure(error);
      setPendingAction(null);
      return;
    }

    await handleSignInState();
    setPendingAction(null);
  };

  const handleResetPasswordSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    clearFeedback();

    if (newPassword !== confirmPassword) {
      setLocalErrors(["The passwords do not match."]);
      return;
    }

    setPendingAction("reset-password");

    const { error } = await signIn.resetPasswordEmailCode.submitPassword({
      password: newPassword,
    });

    if (error) {
      handleFailure(error);
      setPendingAction(null);
      return;
    }

    await handleSignInState();
    setPendingAction(null);
  };

  const handleSecondFactorSelection = async (
    strategy: SecondFactorStrategy,
  ) => {
    clearFeedback();
    setPendingAction(`second-factor-${strategy}`);
    setSecondFactorStrategy(strategy);
    setSecondFactorCode("");

    if (strategy === "email_code") {
      const { error } = await signIn.mfa.sendEmailCode();

      if (error) {
        handleFailure(error);
        setPendingAction(null);
        return;
      }

      setNotice(`We sent a code to ${safeIdentifier}.`);
    } else if (strategy === "phone_code") {
      const { error } = await signIn.mfa.sendPhoneCode();

      if (error) {
        handleFailure(error);
        setPendingAction(null);
        return;
      }

      setNotice("We sent a code to your phone.");
    } else {
      setNotice(null);
    }

    setPendingAction(null);
  };

  const handleSecondFactorSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!secondFactorStrategy) {
      return;
    }

    clearFeedback();
    setPendingAction("second-factor-submit");

    const result =
      secondFactorStrategy === "email_code"
        ? await signIn.mfa.verifyEmailCode({ code: secondFactorCode })
        : secondFactorStrategy === "phone_code"
          ? await signIn.mfa.verifyPhoneCode({ code: secondFactorCode })
          : secondFactorStrategy === "totp"
            ? await signIn.mfa.verifyTOTP({ code: secondFactorCode })
            : await signIn.mfa.verifyBackupCode({ code: secondFactorCode });

    if (result.error) {
      handleFailure(result.error);
      setPendingAction(null);
      return;
    }

    await handleSignInState();
    setPendingAction(null);
  };

  const isBusy = fetchStatus === "fetching" || pendingAction !== null;

  return (
    <AuthShell
      title={
        <>
          Log in to <span className="text-amber-500">Blo</span>
          <span className="text-fuchsia-500">og</span>
        </>
      }
      subtitle="Welcome to Bloog Application!"
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
              onClick={() => void handleOAuthSignIn("oauth_google")}
              type="button"
            >
              {pendingAction === "oauth_google"
                ? "Redirecting..."
                : "Sign in with Google"}
            </SocialAuthButton>
            <SocialAuthButton
              disabled={isBusy}
              icon={<GitHubIcon />}
              loading={pendingAction === "oauth_github"}
              onClick={() => void handleOAuthSignIn("oauth_github")}
              type="button"
            >
              {pendingAction === "oauth_github"
                ? "Redirecting..."
                : "Sign in with GitHub"}
            </SocialAuthButton>
          </div>

          <AuthDivider />

          <form className="space-y-4" onSubmit={handleStartSubmit}>
            <div className="space-y-2">
              <Label htmlFor="identifier">Email</Label>
              <Input
                id="identifier"
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="Enter your email"
                type="email"
                value={identifier}
              />
            </div>
            <AuthSubmitButton
              loading={pendingAction === "identifier"}
              type="submit"
            >
              Continue
            </AuthSubmitButton>
          </form>

          {/*
            FIX: The <div id="clerk-captcha" /> placeholder is required for
            Clerk's bot sign-up protection (CAPTCHA) to render correctly.
            It must be present in the DOM before signIn.create() is called.
            Without it, Clerk throws an error and sign-in is blocked.
          */}
          <div id="clerk-captcha" />

          <AuthFooterLink
            action="Sign up"
            href="/sign-up"
            label="Need an account?"
          />
        </>
      ) : null}

      {view === "password" ? (
        <form className="space-y-4" onSubmit={handlePasswordSubmit}>
          <button
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => {
              clearFeedback();
              setView("start");
              setPassword("");
              // FIX: signIn.reset() does not exist in Core 3.
              // Resetting local state is sufficient; a new signIn.create()
              // call on the next submission will start a fresh attempt.
            }}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <AuthNotice>
            Continue as{" "}
            <span className="font-semibold text-foreground">
              {safeIdentifier}
            </span>
          </AuthNotice>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              type="password"
              value={password}
            />
          </div>
          <div className="space-y-3">
            <AuthSubmitButton
              loading={pendingAction === "password"}
              type="submit"
            >
              Continue
            </AuthSubmitButton>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              {canUseEmailCode ? (
                <button
                  className="text-sky-500 transition-colors hover:text-sky-400"
                  onClick={() => void sendEmailCode()}
                  type="button"
                >
                  Use an email code instead
                </button>
              ) : null}
              <button
                className="text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => {
                  clearFeedback();
                  setView("forgot_password");
                }}
                type="button"
              >
                Forgot password?
              </button>
            </div>
          </div>
        </form>
      ) : null}

      {view === "email_code" ? (
        <form className="space-y-4" onSubmit={handleEmailCodeSubmit}>
          <button
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => {
              clearFeedback();
              setView(canUsePassword ? "password" : "start");
              setEmailCode("");
            }}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="space-y-2">
            <Label htmlFor="email-code">Email code</Label>
            <Input
              autoComplete="one-time-code"
              id="email-code"
              inputMode="numeric"
              onChange={(event) => setEmailCode(event.target.value)}
              placeholder="Enter the code"
              value={emailCode}
            />
          </div>
          <div className="space-y-3">
            <AuthSubmitButton
              loading={pendingAction === "email-code"}
              type="submit"
            >
              Verify and continue
            </AuthSubmitButton>
            <button
              className="text-sm text-sky-500 transition-colors hover:text-sky-400"
              onClick={() => void sendEmailCode()}
              type="button"
            >
              Send a new code
            </button>
          </div>
        </form>
      ) : null}

      {view === "forgot_password" ? (
        <div className="space-y-4">
          <button
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => {
              clearFeedback();
              setView("password");
            }}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <AuthNotice>
            We&apos;ll email a reset code to{" "}
            <span className="font-semibold text-foreground">
              {identifier || "your email"}
            </span>
            .
          </AuthNotice>
          <AuthSubmitButton
            loading={pendingAction === "reset-password-send"}
            onClick={() => void sendResetPasswordCode()}
            type="button"
          >
            Send reset code
          </AuthSubmitButton>
        </div>
      ) : null}

      {view === "reset_password_code" ? (
        <form className="space-y-4" onSubmit={handleResetCodeSubmit}>
          <button
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => {
              clearFeedback();
              setView("forgot_password");
            }}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="space-y-2">
            <Label htmlFor="reset-code">Reset code</Label>
            <Input
              autoComplete="one-time-code"
              id="reset-code"
              inputMode="numeric"
              onChange={(event) => setResetCode(event.target.value)}
              placeholder="Enter the code"
              value={resetCode}
            />
          </div>
          <div className="space-y-3">
            <AuthSubmitButton
              loading={pendingAction === "reset-password-code"}
              type="submit"
            >
              Continue
            </AuthSubmitButton>
            <button
              className="text-sm text-sky-500 transition-colors hover:text-sky-400"
              onClick={() => void sendResetPasswordCode()}
              type="button"
            >
              Send a new code
            </button>
          </div>
        </form>
      ) : null}

      {view === "reset_password" ? (
        <form className="space-y-4" onSubmit={handleResetPasswordSubmit}>
          <button
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => {
              clearFeedback();
              setView("reset_password_code");
            }}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Enter your new password"
              type="password"
              value={newPassword}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm your password"
              type="password"
              value={confirmPassword}
            />
          </div>
          <AuthSubmitButton
            loading={pendingAction === "reset-password"}
            type="submit"
          >
            Reset password
          </AuthSubmitButton>
        </form>
      ) : null}

      {view === "second_factor" ? (
        <form className="space-y-4" onSubmit={handleSecondFactorSubmit}>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Complete your second verification step to finish signing in.
            </p>
            {supportedSecondFactors.length > 1 ? (
              <div className="flex flex-wrap gap-2">
                {supportedSecondFactors.map((factor) => (
                  <button
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      secondFactorStrategy === factor.strategy
                        ? "border-sky-500 bg-sky-500/10 text-sky-500"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                    key={factor.strategy}
                    onClick={() =>
                      void handleSecondFactorSelection(factor.strategy)
                    }
                    type="button"
                  >
                    {SECOND_FACTOR_LABELS[factor.strategy]}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="second-factor-code">
              {secondFactorStrategy
                ? SECOND_FACTOR_LABELS[secondFactorStrategy]
                : "Verification code"}
            </Label>
            <Input
              autoComplete="one-time-code"
              id="second-factor-code"
              inputMode={
                secondFactorStrategy === "backup_code" ? "text" : "numeric"
              }
              onChange={(event) => setSecondFactorCode(event.target.value)}
              placeholder={
                secondFactorStrategy === "backup_code"
                  ? "Enter your backup code"
                  : "Enter the code"
              }
              value={secondFactorCode}
            />
          </div>
          <AuthSubmitButton
            loading={pendingAction === "second-factor-submit"}
            type="submit"
          >
            Finish sign in
          </AuthSubmitButton>
        </form>
      ) : null}
    </AuthShell>
  );
}
