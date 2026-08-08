"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiOutlineSave, HiOutlineArrowLeft } from "react-icons/hi";

interface AdminTemplateFormProps {
  mode: "create" | "edit";
  initialData?: {
    id?: number;
    namaTemplate: string;
    slug: string;
    deskripsi: string;
    schemaConfig: string;
    htmlTemplate: string;
    cssTemplate: string;
    jsTemplate: string;
    isActive: boolean;
  };
}

const defaultSchemaSample = JSON.stringify(
  {
    name: "Template Custom",
    description: "Deskripsi template custom...",
    sections: {
      hero: {
        label: "Hero / Banner Utama",
        fields: {
          judul: { type: "text", label: "Judul Utama", required: true },
          subjudul: { type: "text", label: "Sub Judul" },
          background: { type: "image", label: "Gambar Background Hero" }
        }
      },
      profil: {
        label: "Profil Desa",
        fields: {
          deskripsi: { type: "textarea", label: "Deskripsi Desa", required: true },
          visi: { type: "textarea", label: "Visi" },
          misi: { type: "textarea", label: "Misi" }
        }
      },
      kontak: {
        label: "Kontak",
        fields: {
          alamat: { type: "textarea", label: "Alamat Lengkap" },
          telepon: { type: "text", label: "Telepon" },
          email: { type: "text", label: "Email" }
        }
      },
      warna: {
        label: "Warna",
        fields: {
          primary: { type: "color", label: "Warna Utama", default: "#ec4899" }
        }
      }
    }
  },
  null,
  2
);

const defaultHtmlSample = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>{{hero.judul}}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>{{hero.judul}}</h1>
  <p>{{hero.subjudul}}</p>
  <div class="profil">
    <p>{{profil.deskripsi}}</p>
  </div>
  <script src="script.js"></script>
</body>
</html>`;

const defaultCssSample = `:root {
  --primary: {{warna.primary}};
}
body {
  font-family: sans-serif;
  color: #333;
}
h1 { color: var(--primary); }`;

const defaultJsSample = `console.log("Template loaded successfully!");`;

export function AdminTemplateForm({ mode, initialData }: AdminTemplateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "schema" | "html" | "css" | "js">("info");

  const [namaTemplate, setNamaTemplate] = useState(initialData?.namaTemplate || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || "");
  const [schemaConfig, setSchemaConfig] = useState(initialData?.schemaConfig || defaultSchemaSample);
  const [htmlTemplate, setHtmlTemplate] = useState(initialData?.htmlTemplate || defaultHtmlSample);
  const [cssTemplate, setCssTemplate] = useState(initialData?.cssTemplate || defaultCssSample);
  const [jsTemplate, setJsTemplate] = useState(initialData?.jsTemplate || defaultJsSample);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!namaTemplate || !slug) {
      alert("Nama template dan slug wajib diisi!");
      return;
    }

    // Validate JSON schema
    try {
      JSON.parse(schemaConfig);
    } catch {
      alert("Format Schema Config JSON tidak valid! Periksa sintaks JSON Anda.");
      return;
    }

    setLoading(true);

    try {
      const url = mode === "create" ? "/api/admin/templates" : `/api/admin/templates/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaTemplate,
          slug,
          deskripsi,
          schemaConfig,
          htmlTemplate,
          cssTemplate,
          jsTemplate,
          isActive,
        }),
      });

      if (res.ok) {
        alert(mode === "create" ? "Template berhasil dibuat!" : "Template berhasil diperbarui!");
        router.push("/admin/templates");
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || "Gagal menyimpan template");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  function handleAutoSlug(val: string) {
    setNamaTemplate(val);
    if (mode === "create") {
      setSlug("template-" + val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: "8px",
        background: "rgba(15,23,42,0.6)",
        border: "1px solid rgba(148,163,184,0.1)",
        padding: "6px",
        borderRadius: "14px",
      }}>
        {[
          { key: "info", label: "📋 Informasi Umum" },
          { key: "schema", label: "⚙️ Schema JSON Form" },
          { key: "html", label: "📄 HTML Template" },
          { key: "css", label: "🎨 CSS Style" },
          { key: "js", label: "⚡ JS Script" },
        ].map((tab) => (
          <button
            type="button"
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              background: activeTab === tab.key ? "rgba(236,72,153,0.18)" : "transparent",
              color: activeTab === tab.key ? "#f472b6" : "#94a3b8",
              border: activeTab === tab.key ? "1px solid rgba(236,72,153,0.3)" : "1px solid transparent",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Info */}
      {activeTab === "info" && (
        <div style={{
          background: "rgba(15,23,42,0.6)",
          border: "1px solid rgba(148,163,184,0.1)",
          borderRadius: "16px",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}>
          <div>
            <label style={{ display: "block", color: "white", fontWeight: 600, fontSize: "14px", marginBottom: "8px" }}>
              Nama Template *
            </label>
            <input
              type="text"
              value={namaTemplate}
              onChange={(e) => handleAutoSlug(e.target.value)}
              placeholder="Contoh: Klasik Minimalis"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(148,163,184,0.15)",
                borderRadius: "10px",
                color: "white",
                fontSize: "14px",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "white", fontWeight: 600, fontSize: "14px", marginBottom: "8px" }}>
              Slug Unik *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="template-klasik-minimalis"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(148,163,184,0.15)",
                borderRadius: "10px",
                color: "#34d399",
                fontFamily: "monospace",
                fontSize: "14px",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "white", fontWeight: 600, fontSize: "14px", marginBottom: "8px" }}>
              Deskripsi Singkat Template
            </label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={3}
              placeholder="Jelaskan karakteristik dan kesesuaian template ini..."
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(148,163,184,0.15)",
                borderRadius: "10px",
                color: "white",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "#ec4899", cursor: "pointer" }}
            />
            <label htmlFor="isActive" style={{ color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
              Aktifkan template ini (dapat langsung dipilih oleh desa)
            </label>
          </div>
        </div>
      )}

      {/* Tab 2: Schema JSON */}
      {activeTab === "schema" && (
        <div style={{
          background: "rgba(15,23,42,0.6)",
          border: "1px solid rgba(148,163,184,0.1)",
          borderRadius: "16px",
          padding: "24px",
        }}>
          <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "12px" }}>
            Schema JSON menentukan bagian (sections) dan bidang input (fields) pada form wizard editor desa.
          </p>
          <textarea
            value={schemaConfig}
            onChange={(e) => setSchemaConfig(e.target.value)}
            rows={18}
            style={{
              width: "100%",
              padding: "16px",
              background: "#080c14",
              border: "1px solid rgba(148,163,184,0.15)",
              borderRadius: "10px",
              color: "#34d399",
              fontFamily: "Consolas, Monaco, monospace",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          />
        </div>
      )}

      {/* Tab 3: HTML */}
      {activeTab === "html" && (
        <div style={{
          background: "rgba(15,23,42,0.6)",
          border: "1px solid rgba(148,163,184,0.1)",
          borderRadius: "16px",
          padding: "24px",
        }}>
          <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "12px" }}>
            Gunakan placeholder seperti <code style={{ color: "#f472b6" }}>{"{{hero.judul}}"}</code>, <code style={{ color: "#f472b6" }}>{"{{profil.deskripsi}}"}</code>, <code style={{ color: "#f472b6" }}>{"{{#if field}}...{{/if}}"}</code>.
          </p>
          <textarea
            value={htmlTemplate}
            onChange={(e) => setHtmlTemplate(e.target.value)}
            rows={18}
            style={{
              width: "100%",
              padding: "16px",
              background: "#080c14",
              border: "1px solid rgba(148,163,184,0.15)",
              borderRadius: "10px",
              color: "#e2e8f0",
              fontFamily: "Consolas, Monaco, monospace",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          />
        </div>
      )}

      {/* Tab 4: CSS */}
      {activeTab === "css" && (
        <div style={{
          background: "rgba(15,23,42,0.6)",
          border: "1px solid rgba(148,163,184,0.1)",
          borderRadius: "16px",
          padding: "24px",
        }}>
          <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "12px" }}>
            CSS style untuk template ini. Anda bisa menggunakan <code style={{ color: "#f472b6" }}>{"{{warna.primary}}"}</code>.
          </p>
          <textarea
            value={cssTemplate}
            onChange={(e) => setCssTemplate(e.target.value)}
            rows={18}
            style={{
              width: "100%",
              padding: "16px",
              background: "#080c14",
              border: "1px solid rgba(148,163,184,0.15)",
              borderRadius: "10px",
              color: "#93c5fd",
              fontFamily: "Consolas, Monaco, monospace",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          />
        </div>
      )}

      {/* Tab 5: JS */}
      {activeTab === "js" && (
        <div style={{
          background: "rgba(15,23,42,0.6)",
          border: "1px solid rgba(148,163,184,0.1)",
          borderRadius: "16px",
          padding: "24px",
        }}>
          <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "12px" }}>
            JavaScript interaktif (scroll effect, galeri lightbox, dsb).
          </p>
          <textarea
            value={jsTemplate}
            onChange={(e) => setJsTemplate(e.target.value)}
            rows={18}
            style={{
              width: "100%",
              padding: "16px",
              background: "#080c14",
              border: "1px solid rgba(148,163,184,0.15)",
              borderRadius: "10px",
              color: "#fde047",
              fontFamily: "Consolas, Monaco, monospace",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          />
        </div>
      )}

      {/* Submit Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link
          href="/admin/templates"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            borderRadius: "10px",
            background: "rgba(148,163,184,0.08)",
            border: "1px solid rgba(148,163,184,0.15)",
            color: "#94a3b8",
            fontSize: "13px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <HiOutlineArrowLeft style={{ fontSize: "16px" }} /> Batal
        </Link>

        <button
          type="submit"
          disabled={loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 32px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
            color: "white",
            fontSize: "14px",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(236,72,153,0.3)",
          }}
        >
          <HiOutlineSave style={{ fontSize: "18px" }} />
          {loading ? "Menyimpan..." : mode === "create" ? "Simpan & Publikasikan Template" : "Perbarui Template"}
        </button>
      </div>
    </form>
  );
}
