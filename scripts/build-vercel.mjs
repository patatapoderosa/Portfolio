import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
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
