import { requireSuperAdmin } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSuperAdmin();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #070a12 0%, #0d1322 50%, #070a12 100%)",
      display: "flex",
    }}>
      {/* Ambient background glow */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: `radial-gradient(circle at 10% 10%, rgba(236,72,153,0.06) 0%, transparent 40%),
          radial-gradient(circle at 90% 90%, rgba(139,92,246,0.06) 0%, transparent 40%)`,
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <AdminSidebar />
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        marginLeft: "260px",
        position: "relative",
        zIndex: 1,
      }}>
        <AdminHeader session={session} />
        <main style={{ flex: 1, padding: "28px 36px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
