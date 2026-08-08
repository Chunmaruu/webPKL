import { requireSuperAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  await requireSuperAdmin();

  const users = await prisma.user.findMany({
    where: { role: "ADMIN_DESA" },
    orderBy: { createdAt: "desc" },
    include: {
      websites: {
        include: {
          template: true,
          generateLogs: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "40px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "white", margin: "0 0 6px" }}>
          Daftar Desa Terdaftar ({users.length})
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
          Seluruh akun pengelola desa yang telah mendaftar di platform DesaWeb.
        </p>
      </div>

      <div style={{
        background: "rgba(15,23,42,0.6)",
        border: "1px solid rgba(148,163,184,0.1)",
        borderRadius: "20px",
        overflow: "hidden",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(148,163,184,0.1)", background: "rgba(255,255,255,0.02)" }}>
              <th style={{ padding: "16px 24px", color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Desa / Lokasi</th>
              <th style={{ padding: "16px 24px", color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Email Kontak</th>
              <th style={{ padding: "16px 24px", color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Template Dipilih</th>
              <th style={{ padding: "16px 24px", color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Terakhir Export</th>
              <th style={{ padding: "16px 24px", color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Tanggal Daftar</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const website = u.websites[0];
              const lastLog = website?.generateLogs[0];
              return (
                <tr key={u.id} style={{ borderBottom: "1px solid rgba(148,163,184,0.05)" }}>
                  <td style={{ padding: "16px 24px" }}>
                    <p style={{ color: "white", fontWeight: 700, fontSize: "14px", margin: "0 0 2px" }}>{u.namaDesa}</p>
                    <p style={{ color: "#64748b", fontSize: "12px", margin: 0 }}>Kec. {u.kecamatan}, Kab. {u.kabupaten}</p>
                  </td>
                  <td style={{ padding: "16px 24px", color: "#94a3b8", fontSize: "13px" }}>
                    {u.email}
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    {website ? (
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 600,
                        background: "rgba(16,185,129,0.12)",
                        color: "#34d399",
                        border: "1px solid rgba(16,185,129,0.25)",
                      }}>
                        {website.template.namaTemplate}
                      </span>
                    ) : (
                      <span style={{ color: "#64748b", fontSize: "12px" }}>Belum memilih</span>
                    )}
                  </td>
                  <td style={{ padding: "16px 24px", color: "#94a3b8", fontSize: "12px" }}>
                    {lastLog ? new Date(lastLog.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}
                  </td>
                  <td style={{ padding: "16px 24px", color: "#64748b", fontSize: "12px" }}>
                    {new Date(u.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
