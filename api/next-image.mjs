import { createReadStream, existsSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

const imageCacheDir = resolve(process.cwd(), "mirror", "www.itsjay.us", "_next");

function contentTypeForPath(filePath) {
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  return "image/png";
}

function encodedCandidates(urlValue) {
  const values = new Set();
  if (!urlValue) return [];

  values.add(urlValue);
  values.add(decodeURIComponent(urlValue));
  values.add(encodeURIComponent(urlValue));
  values.add(encodeURIComponent(decodeURIComponent(urlValue)));

  return Array.from(values);
}

export default function handler(request, response) {
  const parsedUrl = new URL(request.url, `https://${request.headers.host || "localhost"}`);
  const requestedUrl = parsedUrl.searchParams.get("url");
  const requestedWidth = parsedUrl.searchParams.get("w");
  const requestedQuality = parsedUrl.searchParams.get("q") || "75";

  const widths = [requestedWidth, "1200", "1080", "828", "1920", "2048", "750", "640", "3840"]
    .filter(Boolean)
    .filter((value, index, all) => all.indexOf(value) === index);

  const possibleNames = [];
  for (const candidateUrl of encodedCandidates(requestedUrl)) {
    for (const width of widths) {
      possibleNames.push(`image?url=${candidateUrl}&w=${width}&q=${requestedQuality}`);
    }
  }

  const fileName = possibleNames.find((candidate) => {
    const fullPath = resolve(imageCacheDir, candidate);
    return existsSync(fullPath) && statSync(fullPath).isFile();
  });

  if (!fileName) {
    response.statusCode = 404;
    response.end("Image not found");
    return;
  }

  const filePath = resolve(imageCacheDir, fileName);
  response.setHeader("Content-Type", contentTypeForPath(fileName));
  response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  createReadStream(filePath).pipe(response);
}
