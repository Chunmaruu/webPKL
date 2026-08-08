import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DownloadManager } from "@/components/download/DownloadManager";

export default async function DownloadPage() {
  const session = await requireAuth();

  const website = await prisma.websiteDesa.findFirst({
    where: { userId: session.userId },
    include: {
      template: true,
      generateLogs: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!website) {
    redirect("/templates");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white font-[var(--font-heading)] mb-2">
          Generate & Download Website
        </h1>
        <p className="text-dark-400">
          Ekspor website Anda menjadi file ZIP statis yang siap diupload ke hosting Anda.
        </p>
      </div>

      <DownloadManager
        initialLogs={website.generateLogs.map((log) => ({
          id: log.id,
          status: log.status,
          zipUrl: log.zipUrl,
          fileSize: log.fileSize,
          createdAt: log.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
