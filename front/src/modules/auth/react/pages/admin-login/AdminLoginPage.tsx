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
      <h1 className="text-2xl font-semibold text-slate-900">
        Accès administration
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Entrez le mot de passe pour accéder à l'administration.
      </p>
      <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
        <p>
          Identifiants démo : <code>demo@admin.local</code> /{" "}
          <code>S3cur3!T0rch!91Aq</code>
        </p>
      </div>

      {hasError ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Mot de passe invalide.
        </p>
      ) : null}

      <form action={authenticate} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={nextPath} />
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 shadow-sm"
            name="email"
            type="email"
            autoComplete="username"
            defaultValue="demo@admin.local"
            required
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Mot de passe
          <input
            className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 shadow-sm"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        <button
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          type="submit"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
