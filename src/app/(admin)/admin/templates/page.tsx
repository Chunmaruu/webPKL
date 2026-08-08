import { requireSuperAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AdminTemplateTable } from "@/components/admin/AdminTemplateTable";
import { HiOutlinePlusCircle } from "react-icons/hi";

export default async function AdminTemplatesPage() {
  await requireSuperAdmin();

  const templates = await prisma.template.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "40px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "white", margin: "0 0 6px" }}>
            Kelola Template Website
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
            Daftar seluruh template website desa yang dapat dipilih oleh pengguna desa.
          </p>
        </div>

        <Link
          href="/admin/templates/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
            borderRadius: "10px",
            color: "white",
            fontWeight: 700,
            fontSize: "13px",
            textDecoration: "none",
            boxShadow: "0 4px 15px rgba(236,72,153,0.3)",
          }}
        >
          <HiOutlinePlusCircle style={{ fontSize: "16px" }} />
          Tambah Template Baru
        </Link>
      </div>

      {/* Table Component */}
      <AdminTemplateTable initialTemplates={templates.map(t => ({
        id: t.id,
        namaTemplate: t.namaTemplate,
        slug: t.slug,
        deskripsi: t.deskripsi || "",
        isActive: t.isActive,
        createdAt: t.createdAt.toISOString(),
      }))} />
    </div>
  );
}
