import { requireSuperAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  HiOutlineTemplate,
  HiOutlineUsers,
  HiOutlineDownload,
  HiOutlinePlusCircle,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi";

export default async function AdminDashboardPage() {
  await requireSuperAdmin();

  // Platform statistics
  const totalUsers = await prisma.user.count({
    where: { role: "ADMIN_DESA" },
  });

  const totalTemplates = await prisma.template.count();
  const activeTemplates = await prisma.template.count({
    where: { isActive: true },
  });

  const totalWebsites = await prisma.websiteDesa.count();
  const totalGenerates = await prisma.generateLog.count({
    where: { status: "success" },
  });

  // Recent users
  const recentUsers = await prisma.user.findMany({
    where: { role: "ADMIN_DESA" },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      websites: {
        include: { template: true },
      },
    },
  });

  // Recent templates
  const templates = await prisma.template.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "40px" }}>
      {/* Welcome Banner */}
      <div style={{
        position: "relative",
        borderRadius: "20px",
        padding: "32px 36px",
        marginBottom: "28px",
        overflow: "hidden",
        background: "linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(139,92,246,0.12) 100%)",
        border: "1px solid rgba(236,72,153,0.25)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: 800, color: "white", margin: "0 0 8px" }}>
              Panel Kontrol Master 👑
            </h1>
            <p style={{ color: "#cbd5e1", fontSize: "14px", margin: 0 }}>
              Kelola template website desa, pantau aktivitas pembuatan website desa, dan kontrol seluruh sistem platform.
            </p>
          </div>
          <Link
            href="/admin/templates/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
              borderRadius: "12px",
              color: "white",
              fontWeight: 700,
              fontSize: "14px",
              textDecoration: "none",
              boxShadow: "0 8px 20px rgba(236,72,153,0.35)",
            }}
          >
            <HiOutlinePlusCircle style={{ fontSize: "18px" }} />
            Tambah Template Baru
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          {
            label: "Total Desa Terdaftar",
            value: `${totalUsers} Desa`,
            icon: HiOutlineUsers,
            color: "#ec4899",
            bg: "rgba(236,72,153,0.1)",
          },
          {
            label: "Total Template",
            value: `${activeTemplates} Aktif / ${totalTemplates} Total`,
            icon: HiOutlineTemplate,
            color: "#8b5cf6",
            bg: "rgba(139,92,246,0.1)",
          },
          {
            label: "Website Dibuat",
            value: `${totalWebsites} Website`,
            icon: HiOutlineCheckCircle,
            color: "#10b981",
            bg: "rgba(16,185,129,0.1)",
          },
          {
            label: "Total Ekspor ZIP",
            value: `${totalGenerates} kali`,
            icon: HiOutlineDownload,
            color: "#3b82f6",
            bg: "rgba(59,130,246,0.1)",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: stat.bg,
              border: `1px solid ${stat.color}30`,
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <stat.icon style={{ width: "22px", height: "22px", color: stat.color }} />
            </div>
            <div>
              <p style={{ color: "#64748b", fontSize: "11px", margin: "0 0 4px", fontWeight: 600, textTransform: "uppercase" }}>{stat.label}</p>
              <p style={{ color: "white", fontWeight: 700, fontSize: "15px", margin: 0 }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid 2 Columns: Templates Overview & Recent Users */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
        
        {/* Templates List */}
        <div style={{
          background: "rgba(15,23,42,0.6)",
          border: "1px solid rgba(148,163,184,0.1)",
          borderRadius: "20px",
          padding: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ color: "white", fontWeight: 700, fontSize: "16px", margin: 0 }}>
              Daftar Template Website
            </h2>
            <Link href="/admin/templates" style={{ color: "#ec4899", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
              Kelola Semua →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(148,163,184,0.08)",
                  borderRadius: "12px",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "white", fontWeight: 700, fontSize: "14px" }}>{tpl.namaTemplate}</span>
                    <span style={{
                      fontSize: "10px",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      fontWeight: 600,
                      background: tpl.isActive ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                      color: tpl.isActive ? "#34d399" : "#f87171",
                      border: `1px solid ${tpl.isActive ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                    }}>
                      {tpl.isActive ? "Aktif" : "Non-Aktif"}
                    </span>
                  </div>
                  <p style={{ color: "#64748b", fontSize: "12px", margin: "4px 0 0" }}>{tpl.slug}</p>
                </div>

                <Link
                  href={`/admin/templates/${tpl.id}/edit`}
                  style={{
                    padding: "6px 14px",
                    background: "rgba(236,72,153,0.1)",
                    border: "1px solid rgba(236,72,153,0.25)",
                    borderRadius: "8px",
                    color: "#f472b6",
                    fontSize: "12px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Edit Kode & Schema
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registered Villages */}
        <div style={{
          background: "rgba(15,23,42,0.6)",
          border: "1px solid rgba(148,163,184,0.1)",
          borderRadius: "20px",
          padding: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ color: "white", fontWeight: 700, fontSize: "16px", margin: 0 }}>
              Desa Terdaftar Terbaru
            </h2>
            <Link href="/admin/users" style={{ color: "#8b5cf6", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
              Lihat Semua →
            </Link>
          </div>

          {recentUsers.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
              Belum ada desa yang terdaftar.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentUsers.map((u) => {
                const website = u.websites[0];
                return (
                  <div
                    key={u.id}
                    style={{
                      padding: "14px 16px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(148,163,184,0.08)",
                      borderRadius: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ color: "white", fontWeight: 600, fontSize: "14px" }}>{u.namaDesa}</span>
                      <span style={{ color: "#64748b", fontSize: "11px" }}>{u.kecamatan}, {u.kabupaten}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "6px" }}>
                      <span style={{ color: "#94a3b8", fontSize: "12px" }}>{u.email}</span>
                      <span style={{
                        fontSize: "11px",
                        color: website ? "#34d399" : "#f59e0b",
                      }}>
                        {website ? `Template: ${website.template.namaTemplate}` : "Belum pilih template"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
