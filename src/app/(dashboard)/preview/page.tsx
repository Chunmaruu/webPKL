import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PreviewIframe } from "@/components/preview/PreviewIframe";
import { HiOutlinePencilAlt, HiOutlineDownload } from "react-icons/hi";

export default async function PreviewPage() {
  const session = await requireAuth();

  const website = await prisma.websiteDesa.findFirst({
    where: { userId: session.userId },
    include: { template: true },
  });

  if (!website) {
    redirect("/templates");
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-heading)]">
            Preview Website
          </h1>
          <p className="text-dark-400 text-sm">
            Tampilan real-time website desa Anda.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/editor" className="btn-secondary py-2.5 px-4 text-sm">
            <HiOutlinePencilAlt className="w-4 h-4" />
            Edit Konten
          </Link>
          <Link href="/download" className="btn-primary py-2.5 px-4 text-sm">
            <HiOutlineDownload className="w-4 h-4" />
            Download ZIP
          </Link>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden p-4">
        <PreviewIframe websiteId={website.id} />
      </div>
    </div>
  );
}
