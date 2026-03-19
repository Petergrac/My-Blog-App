export const authAppearance = {
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
  elements: {},
} as const;

export const authModalAppearance = authAppearance;

export function getAuthErrorMessages(error: unknown): string[] {
  if (error instanceof Error) {
    return [error.message];
  }

  return ["Something went wrong. Please try again."];
}
