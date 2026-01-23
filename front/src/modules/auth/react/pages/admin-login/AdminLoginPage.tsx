import {
  AdminLoginSearchParams,
  useAdminLoginPage,
} from "./use-admin-login-page";

export async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<AdminLoginSearchParams>;
}) {
  const resolvedSearchParams = searchParams
    ? await searchParams
    : undefined;
  const { authenticate, hasError, nextPath } = useAdminLoginPage({
    searchParams: resolvedSearchParams,
  });

  return (
    <div className="mx-auto flex min-h-[calc(100vh-var(--footer-height))] max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border border-luxury-gold-border bg-luxury-bg-primary/90 px-6 py-8">
        <h1 className="text-2xl font-serif text-luxury-text-primary">
          Espace d&apos;administration
        </h1>
        <div className="mt-3 rounded-md border border-luxury-gold-border/60 bg-luxury-bg-primary/60 px-3 py-2 text-xs text-luxury-text-secondary">
          <p>
            Identifiants démo : <code>demo@admin.local</code> /{" "}
            <code>S3cur3!T0rch!91Aq</code>
          </p>
        </div>

        {hasError ? (
          <p className="mt-4 rounded-md border border-luxury-rose/60 bg-luxury-rose/10 px-3 py-2 text-sm text-luxury-text-primary">
            Mot de passe invalide.
          </p>
        ) : null}

        <form action={authenticate} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={nextPath} />
          <label className="block text-sm font-medium text-luxury-gold-muted uppercase tracking-wider">
            Email
            <input
              className="mt-2 w-full rounded-md border border-luxury-gold-border bg-luxury-bg-primary px-3 py-2 text-luxury-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/40"
              name="email"
              type="email"
              autoComplete="username"
              defaultValue="demo@admin.local"
              required
            />
          </label>
          <label className="block text-sm font-medium text-luxury-gold-muted uppercase tracking-wider">
            Mot de passe
            <input
              className="mt-2 w-full rounded-md border border-luxury-gold-border bg-luxury-bg-primary px-3 py-2 text-luxury-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/40"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <button
            className="w-full rounded-md bg-luxury-gold px-4 py-2 text-sm font-semibold text-luxury-bg-primary hover:bg-luxury-gold/90 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
            type="submit"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
