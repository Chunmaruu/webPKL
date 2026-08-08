import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// PUT - Update website content
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const websiteId = parseInt(id);

  const website = await prisma.websiteDesa.findFirst({
    where: { id: websiteId, userId: session.userId },
  });

  if (!website) {
    return NextResponse.json(
      { error: "Website tidak ditemukan" },
      { status: 404 }
    );
  }

  const { dataKonten } = await req.json();

  const updated = await prisma.websiteDesa.update({
    where: { id: websiteId },
    data: { dataKonten },
  });

  return NextResponse.json(updated);
}

// GET - Get specific website
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const websiteId = parseInt(id);

  const website = await prisma.websiteDesa.findFirst({
    where: { id: websiteId, userId: session.userId },
    include: { template: true },
  });

  if (!website) {
    return NextResponse.json(
      { error: "Website tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json(website);
}
