"use client";

import { useState } from "react";
import Link from "next/link";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineCheck, HiOutlineX } from "react-icons/hi";

interface TemplateItem {
  id: number;
  namaTemplate: string;
  slug: string;
  deskripsi: string;
  isActive: boolean;
  createdAt: string;
}

export function AdminTemplateTable({ initialTemplates }: { initialTemplates: TemplateItem[] }) {
  const [templates, setTemplates] = useState<TemplateItem[]>(initialTemplates);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  async function toggleActive(id: number, currentStatus: boolean) {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res.ok) {
        setTemplates(prev => prev.map(t => t.id === id ? { ...t, isActive: !currentStatus } : t));
      } else {
        alert("Gagal mengubah status template");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(id: number, nama: string) {
    if (!confirm(`Apakah Anda yakin ingin menghapus template "${nama}"?`)) return;

    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/templates/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTemplates(prev => prev.filter(t => t.id !== id));
      } else {
        alert("Gagal menghapus template");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div style={{
      background: "rgba(15,23,42,0.6)",
      border: "1px solid rgba(148,163,184,0.1)",
      borderRadius: "20px",
      overflow: "hidden",
    }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(148,163,184,0.1)", background: "rgba(255,255,255,0.02)" }}>
            <th style={{ padding: "16px 24px", color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>ID & Nama</th>
            <th style={{ padding: "16px 24px", color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Slug</th>
            <th style={{ padding: "16px 24px", color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Deskripsi</th>
            <th style={{ padding: "16px 24px", color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>Status</th>
            <th style={{ padding: "16px 24px", color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", textAlign: "right" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((tpl) => (
            <tr key={tpl.id} style={{ borderBottom: "1px solid rgba(148,163,184,0.05)" }}>
              <td style={{ padding: "16px 24px" }}>
                <span style={{ color: "#ec4899", fontWeight: 700, fontSize: "12px", marginRight: "8px" }}>#{tpl.id}</span>
                <span style={{ color: "white", fontWeight: 700, fontSize: "14px" }}>{tpl.namaTemplate}</span>
              </td>
              <td style={{ padding: "16px 24px", color: "#34d399", fontFamily: "monospace", fontSize: "13px" }}>
                {tpl.slug}
              </td>
              <td style={{ padding: "16px 24px", color: "#94a3b8", fontSize: "13px", maxWidth: "300px" }}>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {tpl.deskripsi || "-"}
                </div>
              </td>
              <td style={{ padding: "16px 24px" }}>
                <button
                  onClick={() => toggleActive(tpl.id, tpl.isActive)}
                  disabled={loadingId === tpl.id}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    background: tpl.isActive ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                    color: tpl.isActive ? "#34d399" : "#f87171",
                    border: `1px solid ${tpl.isActive ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
                  }}
                >
                  {tpl.isActive ? <HiOutlineCheck style={{ fontSize: "14px" }} /> : <HiOutlineX style={{ fontSize: "14px" }} />}
                  {tpl.isActive ? "Aktif" : "Non-Aktif"}
                </button>
              </td>
              <td style={{ padding: "16px 24px", textAlign: "right" }}>
                <div style={{ display: "inline-flex", gap: "8px" }}>
                  <Link
                    href={`/admin/templates/${tpl.id}/edit`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      background: "rgba(139,92,246,0.12)",
                      border: "1px solid rgba(139,92,246,0.25)",
                      color: "#c084fc",
                      fontSize: "12px",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    <HiOutlinePencil style={{ fontSize: "14px" }} /> Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(tpl.id, tpl.namaTemplate)}
                    disabled={loadingId === tpl.id}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      color: "#f87171",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <HiOutlineTrash style={{ fontSize: "14px" }} /> Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
