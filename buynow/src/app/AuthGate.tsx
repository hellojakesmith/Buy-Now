import { FormEvent, useEffect, useState } from "react";
import App from "./App";
import { authRequest, contextFromAuth, getCurrentAuth, logout, saveStoredContext, type AuthResponse } from "./lib/api";

type Mode = "login" | "register";

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120) || "workspace";
}

export default function AuthGate() {
  const [auth, setAuth] = useState<AuthResponse | null>(null);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void getCurrentAuth()
      .then((current) => {
        if (cancelled) return;
        if (current) {
          saveStoredContext(contextFromAuth(current));
          setAuth(current);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unable to verify your session");
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (mode === "register" && workspaceName && !workspaceSlug) setWorkspaceSlug(slugify(workspaceName));
  }, [mode, workspaceName, workspaceSlug]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await authRequest<AuthResponse>(mode === "login" ? "/auth/login" : "/auth/register", {
        method: "POST",
        body: JSON.stringify(mode === "login" ? { email, password } : {
          workspaceName,
          workspaceSlug: workspaceSlug || slugify(workspaceName),
          name,
          email,
          password,
        }),
      });
      saveStoredContext(contextFromAuth(response));
      setAuth(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC] text-sm font-semibold text-[#6B7280]">Checking your session…</div>;
  }

  if (auth) {
    return (
      <App
        onLogout={async () => {
          await logout();
          setAuth(null);
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F8FC] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <section className="w-full rounded-[28px] border border-[#EEF0F5] bg-white p-6 shadow-[0_20px_60px_rgba(17,24,39,0.08)] sm:p-8">
          <div className="mb-7">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0325D9]">Buy Now</div>
            <h1 className="mt-2 text-[28px] font-black tracking-tight text-[#111111]">{mode === "login" ? "Welcome back" : "Create your workspace"}</h1>
            <p className="mt-2 text-[14px] leading-6 text-[#6B7280]">{mode === "login" ? "Sign in to manage your leads, pages, products, and sales." : "Create your business workspace and start capturing leads."}</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <>
                <Field label="Your name" value={name} onChange={setName} autoComplete="name" required />
                <Field label="Business name" value={workspaceName} onChange={(value) => { setWorkspaceName(value); if (!workspaceSlug || workspaceSlug === slugify(workspaceName)) setWorkspaceSlug(slugify(value)); }} autoComplete="organization" required />
                <Field label="Workspace URL" value={workspaceSlug} onChange={setWorkspaceSlug} prefix="/" required />
              </>
            )}
            <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
            <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={mode === "register" ? 12 : 1} />

            {error && <div role="alert" className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] leading-5 text-[#B91C1C]">{error}</div>}

            <button disabled={submitting} className="w-full rounded-2xl bg-[#0325D9] px-4 py-3.5 text-[14px] font-bold text-white shadow-[0_10px_24px_rgba(3,37,217,0.2)] disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? "Please wait…" : mode === "login" ? "Sign in" : "Create workspace"}
            </button>
          </form>

          <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }} className="mt-5 w-full text-center text-[13px] font-semibold text-[#0325D9]">
            {mode === "login" ? "New here? Create a workspace" : "Already have an account? Sign in"}
          </button>

          {mode === "register" && <p className="mt-4 text-center text-[11px] leading-5 text-[#9CA3AF]">Passwords must be at least 12 characters. Your session is stored in a secure HttpOnly cookie.</p>}
        </section>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, type = "text", autoComplete, required, minLength, prefix }: { label: string; value: string; onChange: (value: string) => void; type?: string; autoComplete?: string; required?: boolean; minLength?: number; prefix?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-bold text-[#374151]">{label}</span>
      <div className="flex items-center rounded-2xl border border-[#E5E7EB] bg-white px-3 focus-within:border-[#0325D9] focus-within:ring-2 focus-within:ring-[#0325D9]/10">
        {prefix && <span className="text-[14px] text-[#9CA3AF]">{prefix}</span>}
        <input className="min-w-0 flex-1 bg-transparent px-1 py-3 text-[14px] text-[#111111] outline-none" type={type} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} required={required} minLength={minLength} />
      </div>
    </label>
  );
}
