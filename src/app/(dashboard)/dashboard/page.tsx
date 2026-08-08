import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await requireAuth();

  const website = await prisma.websiteDesa.findFirst({
    where: { userId: session.userId },
    include: {
      template: true,
      generateLogs: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  const hasWebsite = !!website;
  const templateName = website?.template?.namaTemplate || null;
  const templateSlug = website?.template?.slug || null;
  const generateCount = website?.generateLogs?.length || 0;

  const steps = [
    {
      no: 1,
      title: "Pilih Template",
      desc: "Pilih desain website yang sesuai",
      icon: "🎨",
      href: "/templates",
      done: hasWebsite,
      color: "#10b981",
    },
    {
      no: 2,
      title: "Isi Konten",
      desc: "Lengkapi profil dan galeri desa",
      icon: "✏️",
      href: "/editor",
      done: hasWebsite && generateCount === 0 ? false : generateCount > 0,
      color: "#3b82f6",
    },
    {
      no: 3,
      title: "Preview Website",
      desc: "Lihat tampilan sebelum download",
      icon: "👁️",
      href: "/preview",
      done: false,
      color: "#8b5cf6",
    },
    {
      no: 4,
      title: "Download ZIP",
      desc: "Ekspor & upload ke hosting",
      icon: "📦",
      href: "/download",
      done: generateCount > 0,
      color: "#f59e0b",
    },
  ];

  const quickActions = [
    {
      title: "Pilih Template",
      desc: hasWebsite ? `Saat ini: ${templateName}` : "Mulai dari sini",
      icon: "🎨",
      href: "/templates",
      accent: "#10b981",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.2)",
    },
    {
      title: "Edit Konten",
      desc: hasWebsite ? "Perbarui teks & foto" : "Pilih template dulu",
      icon: "✏️",
      href: hasWebsite ? "/editor" : "/templates",
      accent: "#3b82f6",
      bg: "rgba(59,130,246,0.08)",
      border: "rgba(59,130,246,0.2)",
    },
    {
      title: "Preview",
      desc: hasWebsite ? "Lihat tampilan website" : "Belum ada website",
      icon: "👁️",
      href: hasWebsite ? "/preview" : "#",
      accent: "#8b5cf6",
      bg: "rgba(139,92,246,0.08)",
      border: "rgba(139,92,246,0.2)",
      disabled: !hasWebsite,
    },
    {
      title: "Download",
      desc: hasWebsite ? "Ekspor file ZIP" : "Belum ada website",
      icon: "📦",
      href: hasWebsite ? "/download" : "#",
      accent: "#f59e0b",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.2)",
      disabled: !hasWebsite,
    },
  ];

  const templatePreview: Record<string, { emoji: string; color: string; tagline: string }> = {
    "template-klasik": { emoji: "🏛️", color: "#059669", tagline: "Formal & Profesional" },
    "template-modern": { emoji: "✨", color: "#3b82f6", tagline: "Modern & Minimalis" },
    "template-wisata": { emoji: "🌿", color: "#f59e0b", tagline: "Vibrant & Atraktif" },
  };
  const tplInfo = templateSlug ? templatePreview[templateSlug] : null;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "8px 0 40px" }}>

      {/* ─── Welcome Banner ─── */}
      <div style={{
        position: "relative",
        borderRadius: "20px",
        padding: "36px 40px",
        marginBottom: "28px",
        overflow: "hidden",
        background: "linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(12,26,46,0.95) 100%)",
        border: "1px solid rgba(148,163,184,0.1)",
      }}>
        {/* Decorative glow */}
        <div style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-80px",
          left: "40px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "20px",
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.25)",
              }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
                <span style={{ color: "#6ee7b7", fontSize: "12px", fontWeight: 600 }}>Sistem Aktif</span>
              </div>
            </div>
            <h1 style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "white",
              margin: "0 0 10px",
              lineHeight: 1.2,
            }}>
              Selamat datang, <span style={{ color: "#34d399" }}>{session.namaDesa}</span>! 👋
            </h1>
            <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>
              {hasWebsite
                ? `Website desa Anda menggunakan template "${templateName}". Lanjutkan edit atau download kapan saja.`
                : "Anda belum punya website desa. Mulai dengan memilih template — gratis & mudah!"}
            </p>
          </div>

          {hasWebsite && tplInfo ? (
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${tplInfo.color}30`,
              borderRadius: "16px",
              padding: "20px 24px",
              minWidth: "180px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>{tplInfo.emoji}</div>
              <p style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>Template Aktif</p>
              <p style={{ color: "white", fontWeight: 700, fontSize: "15px", margin: "0 0 4px" }}>{templateName}</p>
              <p style={{ color: tplInfo.color, fontSize: "12px", margin: 0 }}>{tplInfo.tagline}</p>
            </div>
          ) : (
            <Link href="/templates" style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 28px",
              background: "linear-gradient(135deg, #059669, #10b981)",
              borderRadius: "12px",
              color: "white",
              fontWeight: 700,
              fontSize: "14px",
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
              whiteSpace: "nowrap",
            }}>
              🚀 Mulai Sekarang
            </Link>
          )}
        </div>
      </div>

      {/* ─── Stats Row ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {[
          {
            label: "Template",
            value: templateName || "Belum dipilih",
            icon: "🎨",
            color: "#10b981",
            bg: "rgba(16,185,129,0.08)",
          },
          {
            label: "Status Website",
            value: hasWebsite
              ? (website.status === "draft" ? "Draft" : "Published")
              : "Belum dibuat",
            icon: hasWebsite ? "✅" : "⏳",
            color: hasWebsite ? "#10b981" : "#f59e0b",
            bg: hasWebsite ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)",
          },
          {
            label: "Total Generate",
            value: `${generateCount} kali`,
            icon: "📦",
            color: "#3b82f6",
            bg: "rgba(59,130,246,0.08)",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: stat.bg,
              border: `1px solid ${stat.color}25`,
              borderRadius: "16px",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              flexShrink: 0,
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 4px" }}>{stat.label}</p>
              <p style={{ color: "white", fontWeight: 700, fontSize: "16px", margin: 0 }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── 4-Step Progress ─── */}
      <div style={{
        background: "rgba(15,23,42,0.6)",
        border: "1px solid rgba(148,163,184,0.08)",
        borderRadius: "20px",
        padding: "28px",
        marginBottom: "28px",
      }}>
        <h2 style={{ color: "white", fontWeight: 700, fontSize: "16px", margin: "0 0 20px" }}>
          Langkah Pembuatan Website
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {steps.map((step, idx) => (
            <div key={idx} style={{ position: "relative" }}>
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div style={{
                  position: "absolute",
                  top: "22px",
                  left: "calc(50% + 22px)",
                  right: "calc(-50% + 22px)",
                  height: "2px",
                  background: step.done ? step.color : "rgba(148,163,184,0.1)",
                  zIndex: 0,
                }} />
              )}
              <Link href={step.href} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ textAlign: "center", position: "relative" }}>
                  <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    margin: "0 auto 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    background: step.done
                      ? `${step.color}20`
                      : "rgba(148,163,184,0.06)",
                    border: `2px solid ${step.done ? step.color : "rgba(148,163,184,0.1)"}`,
                    position: "relative",
                    zIndex: 1,
                    boxShadow: step.done ? `0 0 16px ${step.color}30` : "none",
                  }}>
                    {step.done ? "✓" : step.icon}
                  </div>
                  <p style={{ color: step.done ? "#e2e8f0" : "#94a3b8", fontWeight: 600, fontSize: "13px", margin: "0 0 4px" }}>
                    {step.title}
                  </p>
                  <p style={{ color: "#475569", fontSize: "11px", margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Quick Actions ─── */}
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ color: "white", fontWeight: 700, fontSize: "16px", margin: "0 0 16px" }}>
          Aksi Cepat
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              style={{
                display: "block",
                background: action.disabled ? "rgba(255,255,255,0.02)" : action.bg,
                border: `1px solid ${action.disabled ? "rgba(148,163,184,0.06)" : action.border}`,
                borderRadius: "16px",
                padding: "20px",
                textDecoration: "none",
                opacity: action.disabled ? 0.45 : 1,
                cursor: action.disabled ? "not-allowed" : "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>{action.icon}</div>
              <p style={{ color: "white", fontWeight: 600, fontSize: "14px", margin: "0 0 4px" }}>
                {action.title}
              </p>
              <p style={{ color: "#64748b", fontSize: "12px", margin: 0 }}>
                {action.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── Recent Generate Logs ─── */}
      {generateCount > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ color: "white", fontWeight: 700, fontSize: "16px", margin: 0 }}>
              Riwayat Generate Terakhir
            </h2>
            <Link href="/download" style={{ color: "#10b981", fontSize: "13px", textDecoration: "none" }}>
              Lihat semua →
            </Link>
          </div>
          <div style={{
            background: "rgba(15,23,42,0.6)",
            border: "1px solid rgba(148,163,184,0.08)",
            borderRadius: "16px",
            overflow: "hidden",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", borderBottom: "1px solid rgba(148,163,184,0.08)" }}>
              {["Tanggal & Waktu", "Status", "Aksi"].map((th) => (
                <div key={th} style={{ padding: "12px 20px", color: "#475569", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {th}
                </div>
              ))}
            </div>
            {website!.generateLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 120px 120px",
                  borderBottom: "1px solid rgba(148,163,184,0.04)",
                  alignItems: "center",
                }}
              >
                <div style={{ padding: "14px 20px", color: "#94a3b8", fontSize: "13px" }}>
                  {new Date(log.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div style={{ padding: "14px 20px" }}>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: 600,
                    background: log.status === "success" ? "rgba(16,185,129,0.12)" : log.status === "failed" ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                    color: log.status === "success" ? "#34d399" : log.status === "failed" ? "#f87171" : "#fbbf24",
                    border: `1px solid ${log.status === "success" ? "rgba(16,185,129,0.25)" : log.status === "failed" ? "rgba(239,68,68,0.25)" : "rgba(245,158,11,0.25)"}`,
                  }}>
                    {log.status === "success" ? "✓ Sukses" : log.status === "failed" ? "✗ Gagal" : "⏳ Proses"}
                  </span>
                </div>
                <div style={{ padding: "14px 20px" }}>
                  {log.zipUrl && (
                    <a
                      href={log.zipUrl}
                      download
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "5px 12px",
                        background: "rgba(16,185,129,0.1)",
                        border: "1px solid rgba(16,185,129,0.2)",
                        borderRadius: "8px",
                        color: "#34d399",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      📥 ZIP
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
