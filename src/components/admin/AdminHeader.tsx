"use client";

import { logout } from "@/app/actions/auth";
import type { SessionPayload } from "@/lib/session";
import { HiOutlineLogout, HiOutlineShieldCheck } from "react-icons/hi";

export function AdminHeader({ session }: { session: SessionPayload }) {
  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 30,
      background: "rgba(9, 13, 22, 0.9)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(148,163,184,0.1)",
      padding: "0 28px",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 12px",
          borderRadius: "20px",
          background: "rgba(236,72,153,0.15)",
          border: "1px solid rgba(236,72,153,0.3)",
        }}>
          <HiOutlineShieldCheck style={{ color: "#ec4899", width: "14px", height: "14px" }} />
          <span style={{ color: "#f472b6", fontSize: "12px", fontWeight: 700 }}>SUPER ADMIN MODE</span>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ textAlign: "right" }}>
          <span style={{ color: "white", fontSize: "13px", fontWeight: 600, display: "block" }}>
            {session.email}
          </span>
          <span style={{ color: "#ec4899", fontSize: "11px", fontWeight: 500 }}>Administrator Utama</span>
        </div>

        <form action={logout}>
          <button
            type="submit"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "10px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#f87171",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <HiOutlineLogout style={{ width: "16px", height: "16px" }} />
            Keluar
          </button>
        </form>
      </div>
    </header>
  );
}
