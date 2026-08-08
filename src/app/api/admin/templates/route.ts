import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// GET - List all templates (including non-active ones for Super Admin)
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const templates = await prisma.template.findMany({
    orderBy: { id: "asc" },
  });

  return NextResponse.json(templates);
}

// POST - Create a new template dynamically
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { namaTemplate, slug, deskripsi, thumbnail, schemaConfig, htmlTemplate, cssTemplate, jsTemplate } = body;

    if (!namaTemplate || !slug || !schemaConfig) {
      return NextResponse.json(
        { error: "Nama template, slug, dan schemaConfig wajib diisi." },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.template.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug template sudah digunakan. Gunakan slug lain." },
        { status: 400 }
      );
    }

    const template = await prisma.template.create({
      data: {
        namaTemplate,
        slug,
        deskripsi,
        thumbnail,
        schemaConfig: typeof schemaConfig === "string" ? JSON.parse(schemaConfig) : schemaConfig,
        htmlTemplate,
        cssTemplate,
        jsTemplate,
        isActive: true,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal membuat template";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
