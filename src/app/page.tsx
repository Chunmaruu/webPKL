import Link from "next/link";
import {
  HiOutlineTemplate,
  HiOutlinePencilAlt,
  HiOutlineDownload,
  HiOutlineEye,
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
} from "react-icons/hi";

const features = [
  {
    icon: HiOutlineTemplate,
    title: "Pilih Template",
    description:
      "Tersedia beragam template profesional yang dirancang khusus untuk website desa.",
  },
  {
    icon: HiOutlinePencilAlt,
    title: "Edit Konten",
    description:
      "Isi data desa, upload foto, dan sesuaikan tampilan melalui wizard yang mudah digunakan.",
  },
  {
    icon: HiOutlineEye,
    title: "Preview Real-time",
    description:
      "Lihat perubahan secara langsung sebelum mengunduh website Anda.",
  },
  {
    icon: HiOutlineDownload,
    title: "Download & Deploy",
    description:
      "Download website dalam format ZIP dan upload ke hosting atau domain desa.id Anda.",
  },
  {
    icon: HiOutlineShieldCheck,
    title: "Aman & Terisolasi",
    description:
      "Setiap desa memiliki akun terpisah. Data Anda aman dan tidak bisa diakses desa lain.",
  },
  {
    icon: HiOutlineLightningBolt,
    title: "Cepat & Ringan",
    description:
      "Website statis yang dihasilkan sangat cepat dan ringan, cocok untuk koneksi internet desa.",
  },
];

const templates = [
  {
    name: "Klasik",
    description: "Desain formal dan profesional",
    gradient: "from-emerald-800 to-emerald-600",
  },
  {
    name: "Modern",
    description: "Desain clean dan minimalis",
    gradient: "from-blue-800 to-blue-600",
  },
  {
    name: "Wisata",
    description: "Desain vibrant untuk desa wisata",
    gradient: "from-orange-800 to-teal-600",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen gradient-hero">
      {/* Mesh gradient overlay */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg font-[var(--font-heading)]">
              D
            </span>
          </div>
          <span className="text-xl font-bold text-white font-[var(--font-heading)]">
            DesaWeb
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="btn-secondary text-sm px-5 py-2.5"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="btn-primary text-sm px-5 py-2.5"
          >
            Daftar Gratis
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8">
            <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            <span className="text-primary-300 text-sm font-medium">
              Platform Website Desa Indonesia
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 font-[var(--font-heading)] leading-tight">
            Buat Website Desa{" "}
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Tanpa Coding
            </span>
          </h1>

          <p className="text-xl text-dark-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Pilih template, isi konten, dan dapatkan website profesional untuk
            desa Anda dalam hitungan menit. Tidak perlu keahlian teknis.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="btn-primary text-base px-8 py-4 rounded-2xl animate-pulse-glow"
            >
              Mulai Buat Website
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="#templates"
              className="btn-secondary text-base px-8 py-4 rounded-2xl"
            >
              Lihat Template
            </Link>
          </div>
        </div>

        {/* Floating elements decoration */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary-500/10 blur-xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-accent-500/10 blur-xl animate-float"
          style={{ animationDelay: "1s" }}
        />
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[var(--font-heading)]">
            Cara Kerjanya
          </h2>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            Empat langkah sederhana untuk memiliki website desa profesional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-6 hover:border-primary-500/30 transition-all duration-300 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 font-[var(--font-heading)]">
                {feature.title}
              </h3>
              <p className="text-dark-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Templates Preview Section */}
      <section
        id="templates"
        className="relative z-10 max-w-7xl mx-auto px-6 py-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[var(--font-heading)]">
            Template Siap Pakai
          </h2>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            Desain profesional yang dirancang khusus untuk kebutuhan website desa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <div
              key={template.name}
              className="template-card glass-card overflow-hidden group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div
                className={`h-48 bg-gradient-to-br ${template.gradient} flex items-center justify-center`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-3">
                    <HiOutlineTemplate className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-white/80 text-sm font-medium">
                    Preview Template
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-white font-semibold text-lg mb-1 font-[var(--font-heading)]">
                  {template.name}
                </h3>
                <p className="text-dark-400 text-sm">{template.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <div className="glass-card p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-accent-600/10" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[var(--font-heading)]">
              Siap Membuat Website Desa?
            </h2>
            <p className="text-dark-300 text-lg mb-8 max-w-lg mx-auto">
              Daftar sekarang dan mulai buat website profesional untuk desa Anda
              dalam hitungan menit.
            </p>
            <Link
              href="/register"
              className="btn-primary text-base px-10 py-4 rounded-2xl"
            >
              Daftar Gratis Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-dark-800 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-dark-400 text-sm">
              © 2024 DesaWeb. Platform Pembuatan Website Desa.
            </span>
          </div>
          <div className="text-dark-500 text-sm">
            Dibuat untuk desa-desa Indonesia 🇮🇩
          </div>
        </div>
      </footer>
    </div>
  );
}
