"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineTemplate,
  HiOutlinePencilAlt,
  HiOutlineEye,
  HiOutlineDownload,
  HiOutlineSparkles,
} from "react-icons/hi";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HiOutlineHome, desc: "Ringkasan" },
  { name: "Template", href: "/templates", icon: HiOutlineTemplate, desc: "Pilih desain" },
  { name: "Editor", href: "/editor", icon: HiOutlinePencilAlt, desc: "Isi konten" },
  { name: "Preview", href: "/preview", icon: HiOutlineEye, desc: "Lihat tampilan" },
  { name: "Download", href: "/download", icon: HiOutlineDownload, desc: "Ekspor ZIP" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      position: "fixed",
      left: 0,
      top: 0,
      height: "100vh",
      width: "256px",
      background: "linear-gradient(180deg, #0f172a 0%, #0c1a2e 100%)",
      borderRight: "1px solid rgba(148,163,184,0.08)",
      display: "flex",
      flexDirection: "column",
      zIndex: 40,
    }}>
      {/* Logo */}
      <div style={{ padding: "24px", borderBottom: "1px solid rgba(148,163,184,0.08)" }}>
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #059669, #10b981)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 15px rgba(16,185,129,0.3)",
          }}>
            <span style={{ color: "white", fontWeight: 800, fontSize: "18px" }}>D</span>
          </div>
          <div>
            <span style={{ color: "white", fontWeight: 700, fontSize: "16px", display: "block", lineHeight: "1.2" }}>
              DesaWeb
            </span>
            <span style={{ color: "#64748b", fontSize: "11px" }}>Website Builder</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        <p style={{ color: "#475569", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 12px", marginBottom: "8px" }}>
          Menu
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
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
                background: isActive ? "rgba(16,185,129,0.12)" : "transparent",
                border: isActive ? "1px solid rgba(16,185,129,0.2)" : "1px solid transparent",
              }}
            >
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: isActive ? "rgba(16,185,129,0.15)" : "rgba(148,163,184,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <item.icon style={{ width: "18px", height: "18px", color: isActive ? "#34d399" : "#64748b" }} />
              </div>
              <div>
                <span style={{ color: isActive ? "#a7f3d0" : "#94a3b8", fontWeight: 500, fontSize: "14px", display: "block" }}>
                  {item.name}
                </span>
                <span style={{ color: isActive ? "#6ee7b7" : "#475569", fontSize: "11px" }}>
                  {item.desc}
                </span>
              </div>
              {isActive && (
                <div style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Pro Card */}
      <div style={{ padding: "16px", borderTop: "1px solid rgba(148,163,184,0.08)" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(59,130,246,0.08))",
          border: "1px solid rgba(16,185,129,0.2)",
          borderRadius: "12px",
          padding: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <HiOutlineSparkles style={{ color: "#34d399", width: "16px", height: "16px" }} />
            <span style={{ color: "#a7f3d0", fontWeight: 600, fontSize: "13px" }}>Tips</span>
          </div>
          <p style={{ color: "#64748b", fontSize: "12px", lineHeight: "1.6" }}>
            Ikuti wizard Editor 5 langkah untuk membuat website desa yang profesional.
          </p>
          <Link href="/editor" style={{
            display: "block",
            marginTop: "12px",
            padding: "6px 12px",
            background: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.25)",
            borderRadius: "8px",
            textAlign: "center",
            color: "#34d399",
            fontSize: "12px",
            fontWeight: 600,
            textDecoration: "none",
            transition: "all 0.2s",
          }}>
            Mulai Edit →
          </Link>
        </div>
      </div>
    </aside>
  );
}
