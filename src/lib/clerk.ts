import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

export const clerkAppearance = {
  variables: {
    colorPrimary: "var(--chart-2)",
    colorBackground: "var(--card)",
    colorInputBackground: "var(--background)",
    colorInputText: "var(--foreground)",
    colorText: "var(--foreground)",
    colorTextSecondary: "var(--muted-foreground)",
    colorDanger: "var(--destructive)",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-geist-sans)",
  },
  elements: {
    card: "border border-border bg-card text-card-foreground shadow-xl",
    modalBackdrop: "bg-black/50 backdrop-blur-sm",
    modalContent: "border border-border bg-card text-card-foreground shadow-2xl",
    modalCloseButton:
      "text-muted-foreground transition hover:bg-accent hover:text-accent-foreground",
    headerTitle: "text-foreground",
    headerSubtitle: "text-muted-foreground",
    formHeaderTitle: "text-foreground",
    formHeaderSubtitle: "text-muted-foreground",
    formFieldLabel: "text-foreground",
    formFieldAction: "text-sky-500 hover:text-sky-400",
    formButtonPrimary:
      "bg-sky-500 text-black shadow-none hover:bg-sky-400 font-semibold",
    formButtonReset:
      "border border-input bg-background text-foreground shadow-none hover:bg-accent",
    formFieldInput:
      "border border-input bg-background text-foreground shadow-none",
    formFieldInputShowPasswordButton:
      "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
    formFieldErrorText: "text-destructive",
    formResendCodeLink: "text-sky-500 hover:text-sky-400",
    otpCodeFieldInput:
      "border border-input bg-background text-foreground shadow-none",
    otpCodeFieldInputContainer: "border-border",
    socialButtonsBlockButton:
      "border border-input bg-background text-foreground shadow-none hover:bg-accent",
    socialButtonsBlockButtonText: "font-medium",
    footerActionLink: "text-sky-500 hover:text-sky-400",
    dividerLine: "bg-border",
    dividerText: "text-muted-foreground",
    userButtonPopoverCard:
      "border border-border bg-popover text-popover-foreground shadow-xl",
    userButtonPopoverMain: "bg-popover text-popover-foreground",
    userButtonPopoverActions: "border-t border-border",
    userButtonPopoverActionButton:
      "text-popover-foreground hover:bg-accent hover:text-accent-foreground",
    userButtonPopoverActionButtonText: "font-medium",
    userButtonPopoverFooter: "hidden",
  },
} as const;

export const clerkModalAppearance = clerkAppearance;

export function getClerkErrorMessages(error: unknown): string[] {
  if (isClerkAPIResponseError(error)) {
    return error.errors.map((issue) => issue.longMessage || issue.message);
  }

  if (error instanceof Error) {
    return [error.message];
  }

  return ["Something went wrong. Please try again."];
}
