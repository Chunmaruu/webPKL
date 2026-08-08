"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineChartBar,
  HiOutlineTemplate,
  HiOutlinePlusCircle,
  HiOutlineUsers,
  HiOutlineShieldCheck,
  HiOutlineGlobeAlt,
} from "react-icons/hi";

const navigation = [
  { name: "Dashboard Admin", href: "/admin/dashboard", icon: HiOutlineChartBar, desc: "Statistik & Ringkasan" },
  { name: "Kelola Template", href: "/admin/templates", icon: HiOutlineTemplate, desc: "Daftar & Status" },
  { name: "Tambah Template", href: "/admin/templates/new", icon: HiOutlinePlusCircle, desc: "Buat Template Baru" },
  { name: "Daftar Desa", href: "/admin/users", icon: HiOutlineUsers, desc: "Pengguna Terdaftar" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      position: "fixed",
      left: 0,
      top: 0,
      height: "100vh",
      width: "260px",
      background: "linear-gradient(180deg, #090d16 0%, #0f172a 100%)",
      borderRight: "1px solid rgba(148,163,184,0.1)",
      display: "flex",
      flexDirection: "column",
      zIndex: 40,
    }}>
      {/* Logo */}
      <div style={{ padding: "24px", borderBottom: "1px solid rgba(148,163,184,0.1)" }}>
        <Link href="/admin/dashboard" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 15px rgba(236,72,153,0.3)",
          }}>
            <HiOutlineShieldCheck style={{ color: "white", fontSize: "22px" }} />
          </div>
          <div>
            <span style={{ color: "white", fontWeight: 700, fontSize: "16px", display: "block", lineHeight: "1.2" }}>
              Admin Master
            </span>
            <span style={{ color: "#ec4899", fontSize: "11px", fontWeight: 600 }}>DesaWeb Control Panel</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        <p style={{ color: "#475569", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 12px", marginBottom: "10px" }}>
          Menu Master
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "10px",
                marginBottom: "4px",
                textDecoration: "none",
                transition: "all 0.2s ease",
                background: isActive ? "rgba(236,72,153,0.12)" : "transparent",
                border: isActive ? "1px solid rgba(236,72,153,0.25)" : "1px solid transparent",
              }}
            >
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: isActive ? "rgba(236,72,153,0.2)" : "rgba(148,163,184,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <item.icon style={{ width: "18px", height: "18px", color: isActive ? "#f472b6" : "#64748b" }} />
              </div>
              <div>
                <span style={{ color: isActive ? "#fbcfe8" : "#94a3b8", fontWeight: 500, fontSize: "14px", display: "block" }}>
                  {item.name}
                </span>
                <span style={{ color: isActive ? "#f472b6" : "#475569", fontSize: "11px" }}>
                  {item.desc}
                </span>
              </div>
              {isActive && (
                <div style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: "#ec4899" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Switch view */}
      <div style={{ padding: "16px", borderTop: "1px solid rgba(148,163,184,0.1)" }}>
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px",
            borderRadius: "10px",
            background: "rgba(148,163,184,0.06)",
            border: "1px solid rgba(148,163,184,0.12)",
            color: "#94a3b8",
            fontSize: "12px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <HiOutlineGlobeAlt style={{ width: "16px", height: "16px" }} />
          Ke Mode Dashboard Desa
        </Link>
      </div>
    </aside>
  );
}
