import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// POST - Create or replace website
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { templateId } = await req.json();

  if (!templateId) {
    return NextResponse.json(
      { error: "Template ID wajib dipilih" },
      { status: 400 }
    );
  }

  // Check template exists
  const template = await prisma.template.findUnique({
    where: { id: templateId },
  });

  if (!template) {
    return NextResponse.json(
      { error: "Template tidak ditemukan" },
      { status: 404 }
    );
  }

  // Delete existing website for this user (if any)
  await prisma.websiteDesa.deleteMany({
    where: { userId: session.userId },
  });

  // Create new website
  const website = await prisma.websiteDesa.create({
    data: {
      userId: session.userId,
      templateId: templateId,
      dataKonten: {},
      status: "draft",
    },
  });

  return NextResponse.json({ id: website.id }, { status: 201 });
}

// GET - Get user's website
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const website = await prisma.websiteDesa.findFirst({
    where: { userId: session.userId },
    include: {
      template: true,
    },
  });

  if (!website) {
    return NextResponse.json({ error: "Belum ada website" }, { status: 404 });
  }

  return NextResponse.json(website);
}
