import {
  AdminLoginSearchParams,
  useAdminLoginPage,
} from "./use-admin-login-page";
import { LuxuryButton, LuxuryInput } from "@taotask/modules/backoffice/react/components/ui";

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
    <main className="min-h-screen bg-luxury-bg-primary flex items-center justify-center">
      <div className="w-full max-w-md px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-luxury-text-primary mb-2">
            Accès administration
          </h1>
          <div className="h-1 w-16 bg-luxury-gold" />
        </div>

        <p className="text-luxury-text-secondary mb-2">
          Entrez vos identifiants pour accéder à l'administration.
        </p>
        <p className="text-sm text-luxury-text-secondary/70 mb-6">
          Identifiants définis dans <code className="text-luxury-gold-muted">.env.local</code> (mot de passe minimum 8 caractères).
        </p>

        {hasError ? (
          <div className="mb-6 bg-luxury-rose/20 border border-luxury-rose text-luxury-text-primary px-4 py-3 rounded-lg">
            Mot de passe invalide.
          </div>
        ) : null}

        <form action={authenticate} className="space-y-4">
          <input type="hidden" name="next" value={nextPath} />

          <LuxuryInput
            label="Email"
            name="email"
            type="email"
            autoComplete="username"
            required
          />

          <LuxuryInput
            label="Mot de passe"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />

          <div className="pt-4">
            <LuxuryButton type="submit" className="w-full">
              Se connecter
            </LuxuryButton>
          </div>
        </form>
      </div>
    </main>
  );
}
