"use client";

import { logout } from "@/app/actions/auth";
import type { SessionPayload } from "@/lib/session";
import { HiOutlineLogout, HiOutlineOfficeBuilding, HiOutlineBell, HiOutlineChevronDown } from "react-icons/hi";
import { useState } from "react";

export function Header({ session }: { session: SessionPayload }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 30,
      background: "rgba(10, 17, 32, 0.85)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(148,163,184,0.08)",
      padding: "0 24px",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      {/* Left: Breadcrumb / Page info */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#10b981",
          boxShadow: "0 0 8px rgba(16,185,129,0.6)",
        }} />
        <span style={{ color: "#94a3b8", fontSize: "13px" }}>
          Platform Website Desa
        </span>
      </div>

      {/* Right: User info */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Notification bell placeholder */}
        <button style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: "rgba(148,163,184,0.06)",
          border: "1px solid rgba(148,163,184,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}>
          <HiOutlineBell style={{ width: "18px", height: "18px", color: "#64748b" }} />
        </button>

        {/* Desa chip */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.15)",
          borderRadius: "10px",
        }}>
          <HiOutlineOfficeBuilding style={{ width: "14px", height: "14px", color: "#10b981" }} />
          <span style={{ color: "#6ee7b7", fontSize: "13px", fontWeight: 500, maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {session.namaDesa}
          </span>
        </div>

        {/* Avatar + Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 10px",
              borderRadius: "10px",
              background: "rgba(148,163,184,0.06)",
              border: "1px solid rgba(148,163,184,0.1)",
              cursor: "pointer",
            }}
          >
            <div style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #059669, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <span style={{ color: "white", fontWeight: 700, fontSize: "12px" }}>
                {session.namaDesa.charAt(0).toUpperCase()}
              </span>
            </div>
            <div style={{ textAlign: "left" }}>
              <span style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: 600, display: "block", lineHeight: 1.2 }}>
                Admin
              </span>
              <span style={{ color: "#64748b", fontSize: "11px" }}>{session.email.split("@")[0]}</span>
            </div>
            <HiOutlineChevronDown style={{ width: "14px", height: "14px", color: "#64748b" }} />
          </button>

          {showDropdown && (
            <div style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 8px)",
              background: "#0f172a",
              border: "1px solid rgba(148,163,184,0.15)",
              borderRadius: "12px",
              padding: "8px",
              minWidth: "180px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              zIndex: 50,
            }}>
              <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(148,163,184,0.08)", marginBottom: "4px" }}>
                <p style={{ color: "#94a3b8", fontSize: "11px" }}>Masuk sebagai</p>
                <p style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.email}</p>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#ef4444",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  <HiOutlineLogout style={{ width: "15px", height: "15px" }} />
                  Keluar
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
