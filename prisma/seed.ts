import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding templates & Super Admin...");

  // Seed Super Admin
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@desaweb.id" },
    update: {
      role: "SUPER_ADMIN",
    },
    create: {
      namaDesa: "Pusat Admin Platform",
      kecamatan: "Pusat",
      kabupaten: "Pusat",
      email: "admin@desaweb.id",
      password: adminPasswordHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log("Super Admin seeded:", adminUser.email);

  // Seed Templates
  const templatesData = [
    {
      namaTemplate: "Klasik",
      slug: "template-klasik",
      deskripsi: "Desain klasik, formal, dan profesional. Cocok untuk website desa pemerintahan.",
      thumbnail: "/images/template-klasik.jpg",
    },
    {
      namaTemplate: "Modern",
      slug: "template-modern",
      deskripsi: "Desain modern, clean, dan minimalis dengan split hero layout.",
      thumbnail: "/images/template-modern.jpg",
    },
    {
      namaTemplate: "Wisata",
      slug: "template-wisata",
      deskripsi: "Desain vibrant dengan parallax hero dan wave separator untuk desa wisata.",
      thumbnail: "/images/template-wisata.jpg",
    },
  ];

  for (const t of templatesData) {
    const templateDir = path.join(process.cwd(), "src", "templates", t.slug);
    
    const schemaRaw = await fs.readFile(path.join(templateDir, "config.schema.json"), "utf-8");
    const schemaConfig = JSON.parse(schemaRaw);

    let htmlTemplate = "";
    let cssTemplate = "";
    let jsTemplate = "";

    try {
      htmlTemplate = await fs.readFile(path.join(templateDir, "index.html"), "utf-8");
      cssTemplate = await fs.readFile(path.join(templateDir, "style.css"), "utf-8");
      jsTemplate = await fs.readFile(path.join(templateDir, "script.js"), "utf-8");
    } catch (e) {
      console.warn(`Could not read HTML/CSS/JS files for ${t.slug}`);
    }

    await prisma.template.upsert({
      where: { slug: t.slug },
      update: {
        namaTemplate: t.namaTemplate,
        deskripsi: t.deskripsi,
        schemaConfig: schemaConfig,
        htmlTemplate,
        cssTemplate,
        jsTemplate,
      },
      create: {
        namaTemplate: t.namaTemplate,
        slug: t.slug,
        deskripsi: t.deskripsi,
        schemaConfig: schemaConfig,
        htmlTemplate,
        cssTemplate,
        jsTemplate,
        isActive: true,
      },
    });
  }

  console.log("Templates seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
