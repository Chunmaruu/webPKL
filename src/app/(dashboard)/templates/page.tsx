import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { TemplateGallery } from "@/components/templates/TemplateGallery";

export default async function TemplatesPage() {
  const session = await requireAuth();

  const templates = await prisma.template.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
  });

  const existingWebsite = await prisma.websiteDesa.findFirst({
    where: { userId: session.userId },
  });

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white font-[var(--font-heading)] mb-2">
          Pilih Template
        </h1>
        <p className="text-dark-400">
          Pilih template yang sesuai untuk website desa Anda. Setiap template bisa dikustomisasi.
        </p>
      </div>

      <TemplateGallery
        templates={templates.map((t) => ({
          id: t.id,
          namaTemplate: t.namaTemplate,
          slug: t.slug,
          deskripsi: t.deskripsi || "",
        }))}
        existingWebsiteId={existingWebsite?.id || null}
        userId={session.userId}
      />
    </div>
  );
}
