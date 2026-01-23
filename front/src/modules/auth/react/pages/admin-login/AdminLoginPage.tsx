import {
  AdminLoginSearchParams,
  useAdminLoginPage,
} from "./use-admin-login-page";
import { LuxuryInput } from "@taotask/modules/backoffice/react/components/ui/LuxuryInput";
import { LuxuryButton } from "@taotask/modules/backoffice/react/components/ui/LuxuryButton";
import { LuxuryCard } from "@taotask/modules/backoffice/react/components/ui/LuxuryCard";

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
    <main className="min-h-screen bg-luxury-bg-primary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-luxury-text-primary mb-2">
            Espace Administration
          </h1>
          <div className="h-1 w-24 bg-luxury-gold mx-auto" />
        </div>

        <LuxuryCard>
          <div className="p-2">
            <div className="mb-6 rounded-lg border border-luxury-gold-border/60 bg-luxury-bg-primary/60 px-4 py-3">
              <p className="text-sm text-luxury-gold-muted uppercase tracking-wider mb-1">
                Identifiants demo
              </p>
              <p className="text-luxury-text-secondary text-sm">
                <code className="text-luxury-gold">demo@admin.local</code>
                {" / "}
                <code className="text-luxury-gold">S3cur3!T0rch!91Aq</code>
              </p>
            </div>

            {hasError && (
              <div className="mb-6 bg-luxury-rose/20 border border-luxury-rose text-luxury-text-primary px-4 py-3 rounded-lg">
                Identifiants invalides. Veuillez reessayer.
              </div>
            )}

            <form action={authenticate} className="space-y-6">
              <input type="hidden" name="next" value={nextPath} />

              <LuxuryInput
                label="Email"
                name="email"
                type="email"
                autoComplete="username"
                defaultValue="demo@admin.local"
                placeholder="votre@email.com"
                required
              />

              <LuxuryInput
                label="Mot de passe"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Votre mot de passe"
                required
              />

              <LuxuryButton type="submit" className="w-full">
                Se connecter
              </LuxuryButton>
            </form>
          </div>
        </LuxuryCard>

        <p className="text-center mt-8 text-luxury-text-secondary text-sm">
          Acces reserve aux administrateurs
        </p>
      </div>
    </main>
  );
}
