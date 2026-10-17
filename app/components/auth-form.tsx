"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

type AuthFormProps = {
  mode: "login" | "register";
  callbackUrl: string;
};

export function AuthForm({ mode, callbackUrl }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const result = isRegister
        ? await authClient.register({
            name: String(formData.get("name") ?? ""),
            email,
            password,
          })
        : await authClient.login({ email, password });

      if (result.error) {
        setError(
          result.error.status === 429
            ? "Too many attempts. Please wait before trying again."
            : isRegister
              ? "Unable to create an account with those details."
              : "Unable to sign in with those credentials.",
        );
        return;
      }

      router.replace(callbackUrl);
      router.refresh();
    } catch {
      setError("Authentication is temporarily unavailable. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-5 py-12 dark:bg-zinc-950">
      <section className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <Link className="text-sm font-medium text-emerald-700 dark:text-emerald-400" href="/">
          PetCare
        </Link>
        <h1 className="mt-6 text-2xl font-semibold text-zinc-950 dark:text-white">
          {isRegister ? "Create your account" : "Sign in to PetCare"}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          {isRegister
            ? "Set up an account to continue."
            : "Use your email and password to continue."}
        </p>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          {isRegister && (
            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Name
              <input
                autoComplete="name"
                className="mt-2 block h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-950 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                maxLength={80}
                name="name"
                required
              />
            </label>
          )}
          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Email
            <input
              autoComplete="email"
              className="mt-2 block h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-950 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              maxLength={254}
              name="email"
              required
              type="email"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Password
            <input
              autoComplete={isRegister ? "new-password" : "current-password"}
              className="mt-2 block h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-950 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              maxLength={128}
              minLength={12}
              name="password"
              required
              type="password"
            />
          </label>
          {error && (
            <p className="text-sm text-red-700 dark:text-red-300" role="alert">
              {error}
            </p>
          )}
          <button
            className="flex h-11 w-full items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60"
            disabled={pending}
            type="submit"
          >
            {pending ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-300">
          {isRegister ? "Already registered? " : "New to PetCare? "}
          <Link
            className="font-medium text-emerald-700 underline underline-offset-4 dark:text-emerald-400"
            href={`${isRegister ? "/login" : "/register"}?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          >
            {isRegister ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </section>
    </main>
  );
}