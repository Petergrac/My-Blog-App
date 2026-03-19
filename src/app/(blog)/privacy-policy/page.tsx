import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background">
      <section className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 md:px-6">
        <div className="space-y-3">
          <Badge variant="outline">Legal</Badge>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: March 19, 2026
          </p>
          <p className="text-muted-foreground">
            Your privacy matters. This policy explains what we collect, why we
            collect it, and how you can control your information when you use
            Bloog.
          </p>
        </div>

        <Separator />

        <div className="grid gap-6">
          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle>Information we collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                We collect information you provide directly, such as your name,
                username, email address, and profile details. If you connect a
                third-party sign-in (like Google), we receive basic profile
                information to create your account.
              </p>
              <p>
                We also collect usage data like pages you view, features you
                use, and interactions (likes and comments) to help improve the
                product.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle>How we use your information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>We use your information to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Provide, personalize, and maintain your account.</li>
                <li>Publish your content and display your author profile.</li>
                <li>Protect the community from spam, abuse, or fraud.</li>
                <li>Communicate important updates about the service.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle>Sharing and disclosure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                We do not sell your personal data. We may share data with
                service providers (like hosting or analytics) who help us run
                Bloog. We may also disclose information if required to comply
                with the law.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle>Cookies and analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                We use cookies and similar technologies to keep you signed in,
                remember your preferences, and understand how Bloog is used.
                You can control cookies through your browser settings.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle>Data retention and security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                We retain your information for as long as your account is
                active, or as needed to provide the service. We use reasonable
                safeguards to protect your information, but no system is 100%
                secure.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle>Your choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                You can update your profile information in your account
                settings. Depending on your location, you may also have
                additional rights to access or delete your data.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle>Contact us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Questions about privacy? Reach out at{" "}
                <a className="text-sky-500 hover:text-sky-400" href="mailto:support@bloog.com">
                  support@bloog.com
                </a>
                .
              </p>
              <p>
                Looking for the terms?{" "}
                <Link className="text-sky-500 hover:text-sky-400" href="/terms-of-service">
                  Read the Terms of Service
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
