import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { EditorWizard } from "@/components/editor/EditorWizard";
import fs from "fs/promises";
import path from "path";

export default async function EditorPage() {
  const session = await requireAuth();

  const website = await prisma.websiteDesa.findFirst({
    where: { userId: session.userId },
    include: { template: true },
  });

  if (!website) {
    redirect("/templates");
  }

  // Load template schema
  const schemaPath = path.join(
    process.cwd(),
    "src",
    "templates",
    website.template.slug,
    "config.schema.json"
  );
  const schemaRaw = await fs.readFile(schemaPath, "utf-8");
  const schema = JSON.parse(schemaRaw);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white font-[var(--font-heading)] mb-1">
          Editor Website
        </h1>
        <p className="text-dark-400 text-sm">
          Template: <span className="text-primary-400">{website.template.namaTemplate}</span> • Isi konten website desa Anda
        </p>
      </div>

      <EditorWizard
        websiteId={website.id}
        schema={schema}
        initialData={
          (website.dataKonten as Record<string, Record<string, string>>) || {}
        }
      />
    </div>
  );
}
