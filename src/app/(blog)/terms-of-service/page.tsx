import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsOfServicePage() {
  return (
    <div className="bg-background">
      <section className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 md:px-6">
        <div className="space-y-3">
          <Badge variant="outline">Legal</Badge>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: March 19, 2026
          </p>
          <p className="text-muted-foreground">
            By using Bloog, you agree to these terms. Please read them
            carefully. If you do not agree, do not use the service.
          </p>
        </div>

        <Separator />

        <div className="grid gap-6">
          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle>Account eligibility and security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                You are responsible for the activity on your account and for
                keeping your login details secure. Notify us immediately if you
                suspect unauthorized access.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle>User content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                You retain ownership of the content you post. By publishing
                content on Bloog, you grant us a license to display and
                distribute it within the service.
              </p>
              <p>
                You are responsible for ensuring your content does not violate
                any laws or third-party rights.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle>Acceptable use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>When using Bloog, you agree not to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Post unlawful, harmful, or abusive content.</li>
                <li>Impersonate others or misrepresent your identity.</li>
                <li>Attempt to disrupt, exploit, or reverse engineer Bloog.</li>
                <li>Use automated systems to scrape or overload the service.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                We may suspend or terminate access to Bloog if you violate
                these terms or if required to protect the community. You may
                stop using the service at any time.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle>Disclaimers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Bloog is provided on an "as is" basis. We make no guarantees
                about uptime, availability, or the accuracy of user-generated
                content.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle>Changes to these terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                We may update these terms from time to time. If we make
                material changes, we will provide notice through the service.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Questions about these terms? Email{" "}
                <a className="text-sky-500 hover:text-sky-400" href="mailto:support@bloog.com">
                  support@bloog.com
                </a>
                .
              </p>
              <p>
                Looking for privacy details?{" "}
                <Link className="text-sky-500 hover:text-sky-400" href="/privacy-policy">
                  Read the Privacy Policy
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
