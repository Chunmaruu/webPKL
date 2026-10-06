import fs from "fs/promises";
import path from "path";
import { createWriteStream } from "fs";
import { ZipArchive } from "archiver";
import { injectScrollReset } from "./scrollReset";

interface GenerateOptions {
  templateSlug: string;
  dataKonten: Record<string, Record<string, unknown>>;
  userId: number;
  dbHtml?: string | null;
  dbCss?: string | null;
  dbJs?: string | null;
}

/**
 * Simple template engine that replaces handlebars-style placeholders
 * with actual data from user content.
 */
function renderTemplate(
  template: string,
  data: Record<string, Record<string, unknown>>
): string {
  let result = template;

  // Handle {{#if field}} ... {{/if}} conditionals
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

  // Handle {{#each field}} ... {{/each}} loops
  result = result.replace(
    /\{\{#each\s+([\w.]+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
    (_, fieldPath: string, content: string) => {
      const value = getNestedValue(data, fieldPath);
      if (Array.isArray(value)) {
        return value
          .map((item) => {
            return content.replace(/\{\{this\}\}/g, String(item));
          })
          .join("");
      }
      return "";
    }
  );

  // Handle simple {{section.field}} placeholders
  result = result.replace(
    /\{\{([\w.]+)\}\}/g,
    (_, fieldPath: string) => {
      const value = getNestedValue(data, fieldPath);
      if (value !== undefined && value !== null) {
        // Escape HTML for text content but not for URLs/paths
        if (
          typeof value === "string" &&
          !value.startsWith("http") &&
          !value.startsWith("/") &&
          !value.startsWith("#")
        ) {
          return escapeHtml(value);
        }
        return String(value);
      }
      return "";
    }
  );

  return result;
}

function getNestedValue(
  obj: Record<string, unknown>,
  pathStr: string
): unknown {
  return pathStr.split(".").reduce((current: unknown, key: string) => {
    if (current && typeof current === "object" && key in (current as Record<string, unknown>)) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>");
}

/**
 * Generate a static website from template + user data and package as ZIP.
 */
export async function generateWebsite(
  options: GenerateOptions
): Promise<{ zipPath: string; zipUrl: string; fileSize: number }> {
  const { templateSlug, dataKonten, userId, dbHtml, dbCss, dbJs } = options;

  let htmlTemplate = dbHtml || "";
  let cssTemplate = dbCss || "";
  let jsFile = dbJs || "";

  if (!htmlTemplate || !cssTemplate) {
    const templateDir = path.join(
      process.cwd(),
      "src",
      "templates",
      templateSlug
    );
    try {
      if (!htmlTemplate) htmlTemplate = await fs.readFile(path.join(templateDir, "index.html"), "utf-8");
      if (!cssTemplate) cssTemplate = await fs.readFile(path.join(templateDir, "style.css"), "utf-8");
      if (!jsFile) jsFile = await fs.readFile(path.join(templateDir, "script.js"), "utf-8");
    } catch {
      // Ignore if disk files missing
    }
  }

  // Render templates with user data
  let renderedHtml = renderTemplate(htmlTemplate, dataKonten);
  const renderedCss = renderTemplate(cssTemplate, dataKonten);

  // Collect uploaded images
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    String(userId)
  );
  let uploadedFiles: string[] = [];
  try {
    uploadedFiles = await fs.readdir(uploadDir);
  } catch {
    // No uploads directory yet - that's fine
  }

  // Fix image paths: /uploads/{userId}/file.jpg -> images/file.jpg
  renderedHtml = renderedHtml.replace(
    /\/uploads\/\d+\//g,
    "images/"
  );

  // Selalu kembali ke atas saat halaman di-refresh
  renderedHtml = injectScrollReset(renderedHtml);

  // Prepare output directory
  const timestamp = Date.now();
  const outputDir = path.join(
    process.cwd(),
    "public",
    "generated",
    String(userId)
  );
  await fs.mkdir(outputDir, { recursive: true });

  const zipFilename = `website-desa-${timestamp}.zip`;
  const zipPath = path.join(outputDir, zipFilename);
  const zipUrl = `/generated/${userId}/${zipFilename}`;

  // Create ZIP archive using archiver v8 ZipArchive class
  return new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath);
    const archive = new ZipArchive({
      zlib: { level: 9 },
    });

    output.on("close", () => {
      resolve({
        zipPath,
        zipUrl,
        fileSize: archive.pointer(),
      });
    });

    output.on("error", (err: Error) => reject(err));
    archive.on("error", (err: Error) => reject(err));

    archive.pipe(output);

    // Add rendered files
    archive.append(renderedHtml, { name: "index.html" });
    archive.append(renderedCss, { name: "style.css" });
    archive.append(jsFile, { name: "script.js" });

    // Add uploaded images
    for (const file of uploadedFiles) {
      const filePath = path.join(uploadDir, file);
      archive.file(filePath, { name: `images/${file}` });
    }

    archive.finalize();
  });
}
