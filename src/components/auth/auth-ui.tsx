import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="bg-muted flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-md border-border bg-background/95 shadow-xl backdrop-blur">
        <CardHeader className="space-y-3 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to home
          </Link>
          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl md:text-4xl">{title}</CardTitle>
            {subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </div>
  );
}

export function AuthDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      <span>{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export function AuthErrors({ errors }: { errors: string[] }) {
  if (!errors.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <ul className="space-y-1">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
}

export function AuthNotice({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-muted/70 px-4 py-3 text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export function SocialAuthButton({
  icon,
  children,
  loading,
  className,
  ...props
}: ComponentProps<"button"> & {
  icon: ReactNode;
  loading?: boolean;
}) {
  return (
    <button
      className={cn(
        "anim flex h-11 w-full items-center justify-center gap-3 rounded-full border border-input bg-background px-4 text-sm font-medium text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      <span>{children}</span>
    </button>
  );
}

export function AuthFooterLink({
  href,
  label,
  action,
}: {
  href: string;
  label: string;
  action: string;
}) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {label}{" "}
      <Link href={href} className="font-semibold text-sky-500 hover:text-sky-400">
        {action}
      </Link>
    </p>
  );
}

export function AuthSubmitButton({
  loading,
  children,
  ...props
}: ComponentProps<typeof Button> & {
  loading?: boolean;
}) {
  return (
    <Button className="h-11 w-full rounded-full" disabled={loading || props.disabled} {...props}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  );
}

export function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 48 48"
      aria-hidden
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303A12 12 0 0 1 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12a11.93 11.93 0 0 1 7.961 3.039l5.657-5.657A19.91 19.91 0 0 0 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691 12.877 19.51A11.97 11.97 0 0 1 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657A19.92 19.92 0 0 0 24 4 19.98 19.98 0 0 0 6.306 14.691"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.93 11.93 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.1 12.1 0 0 1-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"
      />
    </svg>
  );
}

export function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .5a12 12 0 0 0-3.792 23.387c.6.111.82-.261.82-.58v-2.02c-3.338.726-4.042-1.61-4.042-1.61a3.18 3.18 0 0 0-1.334-1.757c-1.09-.744.083-.729.083-.729a2.523 2.523 0 0 1 1.842 1.24 2.558 2.558 0 0 0 3.496.998 2.559 2.559 0 0 1 .763-1.604c-2.665-.303-5.467-1.333-5.467-5.933a4.64 4.64 0 0 1 1.235-3.218 4.31 4.31 0 0 1 .117-3.176s1.008-.323 3.3 1.23a11.39 11.39 0 0 1 6.006 0c2.29-1.553 3.296-1.23 3.296-1.23a4.31 4.31 0 0 1 .12 3.176 4.63 4.63 0 0 1 1.234 3.218c0 4.612-2.807 5.626-5.48 5.922a2.865 2.865 0 0 1 .816 2.222v3.293c0 .321.216.696.825.578A12 12 0 0 0 12 .5" />
    </svg>
  );
}
