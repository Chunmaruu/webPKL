"use client";

import { useActionState, useState } from "react";
import { adminLogin, type AuthState } from "@/app/actions/auth";
import Link from "next/link";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineShieldCheck, HiOutlineArrowLeft } from "react-icons/hi";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    adminLogin,
    undefined
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function fillSuperAdmin() {
    setEmail("admin@desaweb.id");
    setPassword("admin123");
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #070a12 0%, #111827 50%, #070a12 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      position: "relative",
    }}>
      {/* Ambient background glow */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: `radial-gradient(circle at 50% 30%, rgba(236,72,153,0.1) 0%, transparent 60%),
          radial-gradient(circle at 80% 80%, rgba(139,92,246,0.08) 0%, transparent 60%)`,
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: "440px", position: "relative", zIndex: 1 }}>
        {/* Back Link */}
        <div style={{ marginBottom: "20px" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#94a3b8",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            <HiOutlineArrowLeft style={{ fontSize: "14px" }} /> Kembali ke Beranda
          </Link>
        </div>

        {/* Logo & Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(236,72,153,0.35)",
            marginBottom: "16px",
          }}>
            <HiOutlineShieldCheck style={{ color: "white", fontSize: "30px" }} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "white", margin: "0 0 6px" }}>
            Portal Admin Master
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
            Masuk ke Panel Kontrol Platform DesaWeb
          </p>
        </div>

        {/* Demo Credentials Card */}
        <div style={{
          background: "rgba(236,72,153,0.08)",
          border: "1px solid rgba(236,72,153,0.25)",
          borderRadius: "14px",
          padding: "14px 18px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <p style={{ color: "#f472b6", fontWeight: 700, fontSize: "12px", margin: "0 0 2px" }}>
              🔑 Akun Demo Admin Master
            </p>
            <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0, fontFamily: "monospace" }}>
              admin@desaweb.id / admin123
            </p>
          </div>
          <button
            type="button"
            onClick={fillSuperAdmin}
            style={{
              padding: "6px 12px",
              background: "rgba(236,72,153,0.2)",
              border: "1px solid rgba(236,72,153,0.4)",
              borderRadius: "8px",
              color: "#fbcfe8",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Isi Otomatis
          </button>
        </div>

        {/* Form Card */}
        <div style={{
          background: "rgba(15,23,42,0.75)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(148,163,184,0.12)",
          borderRadius: "20px",
          padding: "32px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        }}>
          <form action={action} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {state?.message && (
              <div style={{
                padding: "12px 16px",
                borderRadius: "10px",
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#f87171",
                fontSize: "13px",
              }}>
                {state.message}
              </div>
            )}

            <div>
              <label style={{ display: "block", color: "#e2e8f0", fontWeight: 600, fontSize: "13px", marginBottom: "8px" }}>
                Email Admin Master
              </label>
              <div style={{ position: "relative" }}>
                <HiOutlineMail style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: "#64748b" }} />
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@desaweb.id"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px 12px 42px",
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(148,163,184,0.15)",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              {state?.errors?.email && (
                <p style={{ color: "#f87171", fontSize: "12px", marginTop: "6px" }}>{state.errors.email[0]}</p>
              )}
            </div>

            <div>
              <label style={{ display: "block", color: "#e2e8f0", fontWeight: 600, fontSize: "13px", marginBottom: "8px" }}>
                Password Admin Master
              </label>
              <div style={{ position: "relative" }}>
                <HiOutlineLockClosed style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: "#64748b" }} />
                <input
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px 12px 42px",
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(148,163,184,0.15)",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              {state?.errors?.password && (
                <p style={{ color: "#f87171", fontSize: "12px", marginTop: "6px" }}>{state.errors.password[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={pending}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                color: "white",
                fontSize: "15px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(236,72,153,0.35)",
              }}
            >
              {pending ? "Memverifikasi Kredensial..." : "Masuk ke Panel Control Master"}
            </button>
          </form>

          <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(148,163,184,0.1)", textAlign: "center" }}>
            <p style={{ color: "#64748b", fontSize: "12px", margin: 0 }}>
              Login untuk Pengurus Desa?{" "}
              <Link href="/login" style={{ color: "#34d399", fontWeight: 600, textDecoration: "none" }}>
                Login Desa di Sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
