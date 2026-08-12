import { Link } from "@tanstack/react-router";
import { VertexLogo } from "@/components/VertexLogo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 hairline-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <VertexLogo className="h-6 w-auto" />
          <span className="font-display text-lg font-semibold tracking-tight">Vertex</span>
        </Link>
        <nav className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <Link to="/" hash="teams" className="hidden hover:text-foreground sm:block">
            Teams
          </Link>
          <Link to="/events" className="hover:text-foreground">
            Events
          </Link>
          <Link to="/join" className="hover:text-foreground">
            Join
          </Link>
          <Link
            to="/auth"
            className="border border-hairline px-3 py-1.5 hover:border-silver hover:text-foreground"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="hairline-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3">
          <VertexLogo className="h-8 w-auto" />
          <div>
            <div className="font-display text-xl font-semibold">Vertex</div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Technical Club · Est. 2026
            </div>
          </div>
        </div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} Vertex
        </div>
      </div>
    </footer>
  );
}
