import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "out");

function walkFiles(currentDir, collected = []) {
  for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
    const fullPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      walkFiles(fullPath, collected);
      continue;
    }

    collected.push(fullPath);
  }

  return collected;
}

function createAliasFile(sourcePath) {
  const relativePath = path.relative(outDir, sourcePath);
  const segments = relativePath.split(path.sep);
  const specialIndex = segments.findIndex((segment) => segment.startsWith("__next."));

  if (specialIndex === -1) {
    return;
  }

  const aliasBaseDir = path.join(outDir, ...segments.slice(0, specialIndex));
  const aliasName = segments.slice(specialIndex).join(".");
  const aliasPath = path.join(aliasBaseDir, aliasName);

  if (aliasPath === sourcePath) {
    return;
  }

  fs.copyFileSync(sourcePath, aliasPath);
}

if (fs.existsSync(outDir)) {
  const files = walkFiles(outDir).filter((filePath) => filePath.endsWith(".txt"));

  for (const filePath of files) {
    createAliasFile(filePath);
  }
}
