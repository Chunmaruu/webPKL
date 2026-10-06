import type { Metadata } from "next";
import "./globals.css";
import ScrollToTopOnLoad from "@/components/ScrollToTopOnLoad";

export const metadata: Metadata = {
  title: "DesaWeb — Platform Pembuatan Website Desa",
  description:
    "Buat website desa resmi secara mandiri tanpa keahlian coding. Pilih template, isi konten, dan download website siap pakai.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        <ScrollToTopOnLoad />
        {children}
      </body>
    </html>
  );
}
