"use client";

import { useActionState } from "react";
import { login, type AuthState } from "@/app/actions/auth";
import Link from "next/link";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineShieldCheck } from "react-icons/hi";

export default function LoginPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    login,
    undefined
  );

  return (
    <div className="min-h-screen gradient-hero gradient-mesh flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl font-[var(--font-heading)]">
                D
              </span>
            </div>
            <span className="text-2xl font-bold text-white font-[var(--font-heading)]">
              DesaWeb
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white font-[var(--font-heading)]">
            Login Admin Desa
          </h1>
          <p className="text-dark-400 mt-2 text-sm">
            Masuk ke dashboard pengelola desa Anda
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          <form action={action} className="space-y-5">
            {state?.message && (
              <div className="p-3 rounded-lg bg-danger-500/10 border border-danger-500/20 text-danger-500 text-sm">
                {state.message}
              </div>
            )}

            <div>
              <label htmlFor="email" className="input-label">
                Email Desa
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@desa.id"
                  className="input-field pl-10"
                  required
                />
              </div>
              {state?.errors?.email && (
                <p className="text-danger-500 text-xs mt-1.5">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="input-field pl-10"
                  required
                />
              </div>
              {state?.errors?.password && (
                <p className="text-danger-500 text-xs mt-1.5">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="btn-primary w-full py-3.5 text-base rounded-xl"
            >
              {pending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Memproses...
                </span>
              ) : (
                "Masuk ke Dashboard Desa"
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-dark-400 text-sm">
              Belum punya akun desa?{" "}
              <Link
                href="/register"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Daftar sekarang
              </Link>
            </p>

            <div className="pt-3 border-t border-dark-800/60">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 font-medium transition-colors"
              >
                <HiOutlineShieldCheck className="w-4 h-4" />
                Portal Login Admin Master →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
