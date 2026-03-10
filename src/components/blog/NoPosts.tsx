import Link from "next/link";
import { FileText, Plus } from "lucide-react";

const NoPosts = () => {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <div className="rounded-full border border-border bg-muted/40 p-4 text-muted-foreground">
        <FileText className="h-8 w-8" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          No posts yet
        </p>
        <h2 className="text-3xl font-semibold text-foreground">
          Start your first story
        </h2>
        <p className="text-sm text-muted-foreground">
          Your feed is empty right now. Publish a post to show it here and start
          building your audience.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/new"
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create your first post
        </Link>
        <Link
          href="/user-profile"
          className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          Manage account
        </Link>
      </div>

      <div className="w-full rounded-lg border border-border bg-muted/20 p-5 text-left text-sm text-muted-foreground">
        <p className="text-sm font-semibold text-foreground">
          Not an author yet?
        </p>
        <p className="mt-1">
          Switch your role to <span className="font-semibold">author</span> to
          start publishing.
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-5">
          <li>Open your profile menu.</li>
          <li>Select <span className="font-medium">Manage Account</span>.</li>
          <li>
            Under <span className="font-medium">Role</span>, change{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">user</code>{" "}
            to{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">author</code>
            .
          </li>
          <li>Save changes and return here.</li>
        </ol>
      </div>
    </section>
  );
};

export default NoPosts;
