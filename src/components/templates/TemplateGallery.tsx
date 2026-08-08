"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineTemplate,
  HiOutlineCheck,
  HiOutlineExclamation,
} from "react-icons/hi";

interface TemplateData {
  id: number;
  namaTemplate: string;
  slug: string;
  deskripsi: string;
}

const templateStyles: Record<string, { gradient: string; icon: string }> = {
  "template-klasik": {
    gradient: "from-emerald-800 to-emerald-600",
    icon: "🏛️",
  },
  "template-modern": {
    gradient: "from-blue-800 to-blue-600",
    icon: "✨",
  },
  "template-wisata": {
    gradient: "from-orange-700 to-teal-600",
    icon: "🌿",
  },
};

export function TemplateGallery({
  templates,
  existingWebsiteId,
  userId,
}: {
  templates: TemplateData[];
  existingWebsiteId: number | null;
  userId: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<TemplateData | null>(
    null
  );

  async function handleSelectTemplate(template: TemplateData) {
    if (existingWebsiteId) {
      setPendingTemplate(template);
      setShowConfirm(true);
      return;
    }

    await createWebsite(template.id);
  }

  async function createWebsite(templateId: number) {
    setLoading(true);
    setSelectedId(templateId);

    try {
      const res = await fetch("/api/website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      });

      if (res.ok) {
        router.push("/editor");
      } else {
        const data = await res.json();
        alert(data.error || "Gagal membuat website");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
      setSelectedId(null);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => {
          const style = templateStyles[template.slug] || {
            gradient: "from-gray-700 to-gray-500",
            icon: "📄",
          };
          return (
            <div
              key={template.id}
              className="template-card glass-card overflow-hidden group"
            >
              {/* Preview Area */}
              <div
                className={`h-48 bg-gradient-to-br ${style.gradient} flex items-center justify-center relative`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">{style.icon}</span>
                  </div>
                  <span className="text-white/80 text-sm font-medium">
                    Preview
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <HiOutlineTemplate className="w-12 h-12 text-white/80" />
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-white font-semibold text-lg mb-1 font-[var(--font-heading)]">
                  {template.namaTemplate}
                </h3>
                <p className="text-dark-400 text-sm mb-4 line-clamp-2">
                  {template.deskripsi}
                </p>
                <button
                  onClick={() => handleSelectTemplate(template)}
                  disabled={loading && selectedId === template.id}
                  className="btn-primary w-full py-2.5 text-sm"
                >
                  {loading && selectedId === template.id ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    <>
                      <HiOutlineCheck className="w-4 h-4" />
                      Gunakan Template
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card p-8 max-w-md w-full mx-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-warning-500/10 flex items-center justify-center mx-auto mb-4">
              <HiOutlineExclamation className="w-6 h-6 text-warning-500" />
            </div>
            <h3 className="text-white text-lg font-bold text-center mb-2">
              Ganti Template?
            </h3>
            <p className="text-dark-400 text-sm text-center mb-6">
              Anda sudah memiliki website. Mengganti template akan{" "}
              <strong className="text-white">menghapus data konten</strong> yang
              sudah diisi sebelumnya. Lanjutkan?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setPendingTemplate(null);
                }}
                className="btn-secondary flex-1 py-2.5"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  if (pendingTemplate) {
                    createWebsite(pendingTemplate.id);
                  }
                }}
                className="btn-danger flex-1 py-2.5"
              >
                Ya, Ganti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
