import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { generateWebsite } from "@/lib/generator";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's website
  const website = await prisma.websiteDesa.findFirst({
    where: { userId: session.userId },
    include: { template: true },
  });

  if (!website) {
    return NextResponse.json(
      { error: "Anda belum membuat website. Pilih template terlebih dahulu." },
      { status: 400 }
    );
  }

  // Create generate log
  const log = await prisma.generateLog.create({
    data: {
      websiteId: website.id,
      status: "processing",
    },
  });

  try {
    console.log("[Generate] Starting generation for website", website.id, "template:", website.template.slug);

    const result = await generateWebsite({
      templateSlug: website.template.slug,
      dataKonten: (website.dataKonten as Record<string, Record<string, unknown>>) || {},
      userId: session.userId,
      dbHtml: website.template.htmlTemplate,
      dbCss: website.template.cssTemplate,
      dbJs: website.template.jsTemplate,
    });

    console.log("[Generate] Success! ZIP created at:", result.zipUrl, "size:", result.fileSize);

    // Update log with success
    await prisma.generateLog.update({
      where: { id: log.id },
      data: {
        status: "success",
        zipUrl: result.zipUrl,
        fileSize: result.fileSize,
      },
    });

    return NextResponse.json({
      success: true,
      zipUrl: result.zipUrl,
      fileSize: result.fileSize,
    });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    const errStack = error instanceof Error ? error.stack : "";
    console.error("[Generate] Error:", errMessage);
    console.error("[Generate] Stack:", errStack);

    // Update log with failure
    await prisma.generateLog.update({
      where: { id: log.id },
      data: { status: "failed" },
    });

    return NextResponse.json(
      { error: `Gagal men-generate website: ${errMessage}` },
      { status: 500 }
    );
  }
}
