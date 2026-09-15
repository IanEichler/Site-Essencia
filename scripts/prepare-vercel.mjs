import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = resolve(process.env.SITE_OUTPUT_DIR || join(projectRoot, "dist"));
const productionHost = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
const currentOrigin = "https://essencia-entre-mentes.theodoroeporto.chatgpt.site";

if (!existsSync(join(outputDirectory, "index.html"))) {
  throw new Error(`Arquivo principal não encontrado em ${outputDirectory}`);
}

if (!productionHost) {
  console.log("Site estático pronto. Mantendo a URL canônica atual.");
  process.exit(0);
}

const origin = productionHost.startsWith("http")
  ? productionHost.replace(/\/$/, "")
  : `https://${productionHost.replace(/\/$/, "")}`;

for (const file of ["index.html", "robots.txt", "sitemap.xml"]) {
  const filePath = join(outputDirectory, file);
  if (!existsSync(filePath)) continue;
  const content = readFileSync(filePath, "utf8");
  writeFileSync(filePath, content.replaceAll(currentOrigin, origin));
}

console.log(`Metadados preparados para ${origin}`);
