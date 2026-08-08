import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// PUT - Update existing template
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const templateId = parseInt(id);

  try {
    const body = await req.json();
    const { namaTemplate, slug, deskripsi, thumbnail, schemaConfig, htmlTemplate, cssTemplate, jsTemplate, isActive } = body;

    const existing = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Template tidak ditemukan" }, { status: 404 });
    }

    const updated = await prisma.template.update({
      where: { id: templateId },
      data: {
        ...(namaTemplate && { namaTemplate }),
        ...(slug && { slug }),
        ...(deskripsi !== undefined && { deskripsi }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(schemaConfig && { schemaConfig: typeof schemaConfig === "string" ? JSON.parse(schemaConfig) : schemaConfig }),
        ...(htmlTemplate !== undefined && { htmlTemplate }),
        ...(cssTemplate !== undefined && { cssTemplate }),
        ...(jsTemplate !== undefined && { jsTemplate }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui template";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE - Delete template
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const templateId = parseInt(id);

  try {
    await prisma.template.delete({
      where: { id: templateId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menghapus template";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
