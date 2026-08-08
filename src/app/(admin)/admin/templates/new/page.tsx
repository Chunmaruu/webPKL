import { requireSuperAdmin } from "@/lib/session";
import { AdminTemplateForm } from "@/components/admin/AdminTemplateForm";

export default async function NewTemplatePage() {
  await requireSuperAdmin();

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", paddingBottom: "40px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "white", margin: "0 0 6px" }}>
          Tambah Template Baru ✨
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
          Buat dan publikasikan template website desa baru secara dinamis ke platform.
        </p>
      </div>

      <AdminTemplateForm mode="create" />
    </div>
  );
}
