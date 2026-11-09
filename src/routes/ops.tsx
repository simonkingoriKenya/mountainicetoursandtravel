import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/ops")({
  head: () => ({
    meta: [
      { title: "Operations temporarily unavailable | MountainIceMikes" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: OperationsPausedPage,
});

function OperationsPausedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-16 text-foreground">
      <section className="w-full max-w-xl border border-border bg-card p-8 sm:p-12">
        <ShieldAlert aria-hidden="true" className="text-accent" size={28} />
        <p className="mt-7 text-[10px] uppercase tracking-widest text-muted-foreground">
          MountainIceMikes · Staff operations
        </p>
        <h1 className="editorial-type mt-3 text-3xl font-semibold">Operations are paused.</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          The staff portal is unavailable while its backend moves to Cloudflare. No staff records or
          documents are accessible here.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 text-xs uppercase text-primary hover:text-accent"
        >
          <ArrowLeft size={14} />
          Return to the website
        </Link>
      </section>
    </main>
  );
}
