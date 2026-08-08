import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

/**
 * Simple template renderer (duplicate logic from generator for preview)
 */
function renderTemplate(
  template: string,
  data: Record<string, Record<string, unknown>>
): string {
  let result = template;

  result = result.replace(
    /\{\{#if\s+([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_, fieldPath: string, content: string) => {
      const value = getNestedValue(data, fieldPath);
      if (value && value !== "" && (!Array.isArray(value) || value.length > 0)) {
        return content;
      }
      return "";
    }
  );

  result = result.replace(
    /\{\{#each\s+([\w.]+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
    (_, fieldPath: string, content: string) => {
      const value = getNestedValue(data, fieldPath);
      if (Array.isArray(value)) {
        return value.map((item) => content.replace(/\{\{this\}\}/g, String(item))).join("");
      }
      return "";
    }
  );

  result = result.replace(
    /\{\{([\w.]+)\}\}/g,
    (_, fieldPath: string) => {
      const value = getNestedValue(data, fieldPath);
      if (value !== undefined && value !== null) {
        if (
          typeof value === "string" &&
          !value.startsWith("http") &&
          !value.startsWith("/") &&
          !value.startsWith("#")
        ) {
          return String(value).replace(/\n/g, "<br>");
        }
        return String(value);
      }
      return "";
    }
  );

  return result;
}

function getNestedValue(obj: Record<string, unknown>, pathStr: string): unknown {
  return pathStr.split(".").reduce((current: unknown, key: string) => {
    if (current && typeof current === "object" && key in (current as Record<string, unknown>)) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const websiteId = parseInt(id);

  const website = await prisma.websiteDesa.findFirst({
    where: { id: websiteId, userId: session.userId },
    include: { template: true },
  });

  if (!website) {
    return new NextResponse("Not found", { status: 404 });
  }

  let htmlTemplate = website.template.htmlTemplate || "";
  let cssTemplate = website.template.cssTemplate || "";
  let jsFile = website.template.jsTemplate || "";

  if (!htmlTemplate || !cssTemplate) {
    const templateDir = path.join(
      process.cwd(),
      "src",
      "templates",
      website.template.slug
    );
    try {
      if (!htmlTemplate) htmlTemplate = await fs.readFile(path.join(templateDir, "index.html"), "utf-8");
      if (!cssTemplate) cssTemplate = await fs.readFile(path.join(templateDir, "style.css"), "utf-8");
      if (!jsFile) jsFile = await fs.readFile(path.join(templateDir, "script.js"), "utf-8");
    } catch {
      // Fallback ignore missing disk files
    }
  }

  const dataKonten =
    (website.dataKonten as Record<string, Record<string, unknown>>) || {};

  let renderedHtml = renderTemplate(htmlTemplate, dataKonten);
  const renderedCss = renderTemplate(cssTemplate, dataKonten);

  // Inline CSS and JS for preview
  renderedHtml = renderedHtml.replace(
    '<link rel="stylesheet" href="style.css">',
    `<style>${renderedCss}</style>`
  );
  renderedHtml = renderedHtml.replace(
    '<script src="script.js"></script>',
    `<script>${jsFile}</script>`
  );

  return new NextResponse(renderedHtml, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
