import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";

const rootDir = process.cwd();
const sourceDir = resolve(rootDir, "mirror", "www.itsjay.us");
const distDir = resolve(rootDir, "dist");

if (!existsSync(sourceDir)) {
  throw new Error(`Mirror source not found: ${sourceDir}`);
}

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });
cpSync(sourceDir, distDir, { recursive: true });

const imageOutputDir = resolve(distDir, "_image-assets");
mkdirSync(imageOutputDir, { recursive: true });

function walkFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = resolve(directory, entry.name);
    if (entry.isDirectory()) return walkFiles(absolutePath);
    return absolutePath;
  });
}

function decodeHtmlUrl(value) {
  return value.replaceAll("&amp;", "&");
}

function extensionForImageUrl(value) {
  const urlValue = new URLSearchParams(value.split("?")[1] || "").get("url") || "";
  const cleanUrl = decodeURIComponent(urlValue).split("?")[0].toLowerCase();
  if (cleanUrl.endsWith(".jpg") || cleanUrl.endsWith(".jpeg")) return ".jpg";
  if (cleanUrl.endsWith(".webp")) return ".webp";
  if (cleanUrl.endsWith(".gif")) return ".gif";
  return ".png";
}

function staticImageForReference(reference) {
  const decodedReference = decodeHtmlUrl(reference)
    .replace(/^(\.\.\/)+/, "")
    .replace(/^\//, "")
    .replace("_next/image%3F", "_next/image?");
  const percentNormalizedReference = decodedReference.replaceAll("%25", "%");
  const query = decodedReference.split("?")[1] || "";
  const params = new URLSearchParams(query);
  const sourceUrl = params.get("url");
  const width = params.getAll("w").at(-1);
  const quality = params.getAll("q").at(-1);
  const normalizedImageUrl =
    sourceUrl && sourceUrl.startsWith("%2F")
      ? sourceUrl
      : sourceUrl && sourceUrl.startsWith("/")
        ? encodeURIComponent(sourceUrl)
        : sourceUrl;
  const preferredWidths = normalizedImageUrl && width && quality
    ? ["1200", "1080", "828", "1920", "2048", "750", "640", width, "3840"]
    : [];
  const normalizedReferences = preferredWidths.map(
    (candidateWidth) => `_next/image?url=${normalizedImageUrl}&w=${candidateWidth}&q=${quality}`
  );
  const normalizedReference = normalizedReferences[0] || decodedReference;
  const sourceImage = [
    ...normalizedReferences,
    percentNormalizedReference,
    percentNormalizedReference.replace("%3F", "?"),
    decodedReference
  ]
    .map((candidate) => resolve(sourceDir, candidate))
    .find((candidate) => existsSync(candidate) && statSync(candidate).isFile());

  if (!sourceImage) {
    return reference;
  }

  const hash = createHash("sha1").update(sourceImage).digest("hex").slice(0, 16);
  const outputName = `${hash}${extensionForImageUrl(normalizedReference)}`;
  const outputPath = resolve(imageOutputDir, outputName);
  copyFileSync(sourceImage, outputPath);
  return `/_image-assets/${outputName}`;
}

for (const htmlFile of walkFiles(distDir).filter((file) => file.endsWith(".html"))) {
  const original = readFileSync(htmlFile, "utf8");
  const withoutSrcSets = original.replace(/\s+srcSet="[^"]*"/g, "");
  const rewritten = withoutSrcSets.replace(
    /(?:\.\.\/|\/)?_next\/image%3Furl=[^"',\s<>)]+?(?:&amp;|&)w=\d+(?:&amp;|&)q=\d+/g,
    (match) => staticImageForReference(match)
  );

  if (rewritten !== original) {
    writeFileSync(htmlFile, rewritten);
  }
}

for (const nextFile of readdirSync(resolve(distDir, "_next"), { withFileTypes: true })) {
  if (nextFile.isFile() && nextFile.name.startsWith("image?")) {
    rmSync(resolve(distDir, "_next", nextFile.name), { force: true });
  }
}

rmSync(resolve(distDir, "videos", "lab"), { recursive: true, force: true });

const requiredFiles = [
  "index.html",
  "work.html",
  join("styles", "page-transition.css"),
  join("scripts", "page-transition.js")
];

for (const relativePath of requiredFiles) {
  const absolutePath = resolve(distDir, relativePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Build output is missing required file: ${relativePath}`);
  }
}

console.log(`Vercel bundle ready in ${distDir}`);
