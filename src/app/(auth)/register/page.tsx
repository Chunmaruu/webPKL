"use client";

import { useActionState } from "react";
import { register, type AuthState } from "@/app/actions/auth";
import Link from "next/link";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
} from "react-icons/hi";

export default function RegisterPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    register,
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
            Daftarkan Desa Anda
          </h1>
          <p className="text-dark-400 mt-2">
            Buat akun untuk mulai membuat website desa
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          <form action={action} className="space-y-4">
            {state?.message && (
              <div className="p-3 rounded-lg bg-danger-500/10 border border-danger-500/20 text-danger-500 text-sm">
                {state.message}
              </div>
            )}

            <div>
              <label htmlFor="namaDesa" className="input-label">
                Nama Desa
              </label>
              <div className="relative">
                <HiOutlineOfficeBuilding className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  id="namaDesa"
                  name="namaDesa"
                  type="text"
                  placeholder="Contoh: Desa Sukamaju"
                  className="input-field pl-10"
                  required
                />
              </div>
              {state?.errors?.namaDesa && (
                <p className="text-danger-500 text-xs mt-1.5">
                  {state.errors.namaDesa[0]}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="kecamatan" className="input-label">
                  Kecamatan
                </label>
                <div className="relative">
                  <HiOutlineLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    id="kecamatan"
                    name="kecamatan"
                    type="text"
                    placeholder="Kecamatan"
                    className="input-field pl-10"
                    required
                  />
                </div>
                {state?.errors?.kecamatan && (
                  <p className="text-danger-500 text-xs mt-1.5">
                    {state.errors.kecamatan[0]}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="kabupaten" className="input-label">
                  Kabupaten
                </label>
                <input
                  id="kabupaten"
                  name="kabupaten"
                  type="text"
                  placeholder="Kabupaten"
                  className="input-field"
                  required
                />
                {state?.errors?.kabupaten && (
                  <p className="text-danger-500 text-xs mt-1.5">
                    {state.errors.kabupaten[0]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="input-label">
                Email Admin
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
                  placeholder="Minimal 6 karakter"
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
              className="btn-primary w-full py-3.5 text-base rounded-xl mt-2"
            >
              {pending ? (
                <span className="flex items-center gap-2">
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
                  Mendaftarkan...
                </span>
              ) : (
                "Daftar Sekarang"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-400 text-sm">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
