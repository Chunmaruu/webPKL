import { requireAuth } from "@/lib/session";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  // If user is SUPER_ADMIN, redirect to Admin Master Dashboard
  if (session.role === "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #060d1a 0%, #0a1628 50%, #060d1a 100%)",
      display: "flex",
    }}>
      {/* Background mesh pattern */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: `radial-gradient(circle at 20% 20%, rgba(16,185,129,0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(59,130,246,0.04) 0%, transparent 50%)`,
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <Sidebar />
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        marginLeft: "256px",
        position: "relative",
        zIndex: 1,
      }}>
        <Header session={session} />
        <main style={{ flex: 1, padding: "28px 32px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
