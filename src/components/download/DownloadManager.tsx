"use client";

import { useState } from "react";
import { HiOutlineLightningBolt, HiOutlineDownload, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";

interface LogData {
  id: number;
  status: string;
  zipUrl: string | null;
  fileSize: number | null;
  createdAt: string;
}

export function DownloadManager({ initialLogs }: { initialLogs: LogData[] }) {
  const [logs, setLogs] = useState<LogData[]>(initialLogs);
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        // Refresh logs from database or prepend the new success log
        const newLog: LogData = {
          id: Date.now(),
          status: "success",
          zipUrl: data.zipUrl,
          fileSize: data.fileSize,
          createdAt: new Date().toISOString(),
        };
        setLogs((prev) => [newLog, ...prev]);
      } else {
        alert(data.error || "Gagal men-generate website");
        const failedLog: LogData = {
          id: Date.now(),
          status: "failed",
          zipUrl: null,
          fileSize: null,
          createdAt: new Date().toISOString(),
        };
        setLogs((prev) => [failedLog, ...prev]);
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setGenerating(false);
    }
  }

  function formatBytes(bytes: number | null) {
    if (bytes === null) return "-";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  return (
    <div className="space-y-6">
      {/* Generate Card */}
      <div className="glass-card p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-accent-600/5 pointer-events-none" />
        <div className="relative max-w-lg mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto text-primary-400">
            <HiOutlineLightningBolt className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-[var(--font-heading)]">
              Ekspor Website Siap Pakai
            </h2>
            <p className="text-dark-400 text-sm mt-2">
              Sistem akan merender file index.html, style.css, script.js beserta aset media Anda menjadi satu paket website siap pakai dalam bentuk ZIP.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn-primary w-full py-4 text-base rounded-xl font-semibold shadow-lg"
          >
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sedang Merender & Mengompres...
              </span>
            ) : (
              <>
                <HiOutlineLightningBolt className="w-5 h-5" />
                Generate Website Sekarang
              </>
            )}
          </button>
        </div>
      </div>

      {/* History */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 font-[var(--font-heading)]">
          Riwayat Unduhan
        </h3>

        {logs.length === 0 ? (
          <div className="glass-card p-8 text-center text-dark-500">
            Belum ada riwayat generate. Silakan klik tombol di atas untuk memulai.
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-dark-800 bg-dark-900/30 text-xs text-dark-400 font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Waktu Ekspor</th>
                  <th className="px-6 py-4">Ukuran</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-850">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-dark-900/10">
                    <td className="px-6 py-4 text-sm text-dark-300">
                      {new Date(log.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-400">
                      {formatBytes(log.fileSize)}
                    </td>
                    <td className="px-6 py-4">
                      {log.status === "success" ? (
                        <span className="badge badge-success">
                          <HiOutlineCheckCircle className="w-3.5 h-3.5 mr-1" />
                          Sukses
                        </span>
                      ) : log.status === "failed" ? (
                        <span className="badge badge-danger">
                          <HiOutlineXCircle className="w-3.5 h-3.5 mr-1" />
                          Gagal
                        </span>
                      ) : (
                        <span className="badge badge-warning">
                          Proses
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {log.zipUrl && (
                        <a
                          href={log.zipUrl}
                          className="btn-primary py-1.5 px-3.5 text-xs rounded-lg inline-flex items-center gap-1 shadow-none"
                          download
                        >
                          <HiOutlineDownload className="w-3.5 h-3.5" />
                          Download ZIP
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
