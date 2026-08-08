import { requireSuperAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AdminTemplateForm } from "@/components/admin/AdminTemplateForm";

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSuperAdmin();

  const { id } = await params;
  const templateId = parseInt(id);

  const template = await prisma.template.findUnique({
    where: { id: templateId },
  });

  if (!template) {
    notFound();
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", paddingBottom: "40px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "white", margin: "0 0 6px" }}>
          Edit Template #{template.id}: {template.namaTemplate}
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
          Ubah kode HTML, CSS, JS, dan skema form wizard untuk template ini.
        </p>
      </div>

      <AdminTemplateForm
        mode="edit"
        initialData={{
          id: template.id,
          namaTemplate: template.namaTemplate,
          slug: template.slug,
          deskripsi: template.deskripsi || "",
          schemaConfig: JSON.stringify(template.schemaConfig, null, 2),
          htmlTemplate: template.htmlTemplate || "",
          cssTemplate: template.cssTemplate || "",
          jsTemplate: template.jsTemplate || "",
          isActive: template.isActive,
        }}
      />
    </div>
  );
}
