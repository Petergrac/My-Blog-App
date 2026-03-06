import { ClerkProvider as ClerkNextJSProvider } from "@clerk/nextjs";

import { clerkAppearance } from "@/lib/clerk";

type ClerkProviderProps = React.ComponentProps<typeof ClerkNextJSProvider>;

export function ClerkProvider({
  children,
  appearance,
  ...props
}: ClerkProviderProps) {
  return (
    <ClerkNextJSProvider
      appearance={{
        ...clerkAppearance,
        ...appearance,
        elements: {
          ...clerkAppearance.elements,
          ...appearance?.elements,
        },
        variables: {
          ...clerkAppearance.variables,
          ...appearance?.variables,
        },
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      {...props}
    >
      {children}
    </ClerkNextJSProvider>
  );
}
