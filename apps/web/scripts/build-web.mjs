// Roda depois do `expo export -p web`. Reorganiza dist/ pra LP morar em "/" e o app em "/app":
//   dist/index.html      (app gerado pelo Expo) -> dist/app/index.html
//   landing/index.html                            -> dist/index.html
//   landing/{styles.css,main.js,data.js}          -> dist/lp/
// Os assets do app usam caminho absoluto (/_expo/...), entao continuam funcionando em /app.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const landing = join(root, "landing");

const appHtml = join(dist, "index.html");
if (!existsSync(appHtml)) {
  console.error("[build-web] dist/index.html nao encontrado. Rode `expo export -p web` antes.");
  process.exit(1);
}

mkdirSync(join(dist, "app"), { recursive: true });
renameSync(appHtml, join(dist, "app", "index.html"));

// og:url/og:image precisam de URL absoluta (previa de link no WhatsApp/Instagram).
// SITE_URL tem prioridade; senao usa o dominio de producao que a Vercel expoe no build.
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = (process.env.SITE_URL || (vercelHost ? `https://${vercelHost}` : "")).replace(/\/$/, "");
if (!siteUrl) {
  console.warn("[build-web] SITE_URL nao definido: og:image fica com caminho relativo.");
}
const lpHtml = readFileSync(join(landing, "index.html"), "utf8").replaceAll("__SITE_URL__", siteUrl);
writeFileSync(join(dist, "index.html"), lpHtml);
mkdirSync(join(dist, "lp"), { recursive: true });
for (const file of readdirSync(landing)) {
  if (file !== "index.html") cpSync(join(landing, file), join(dist, "lp", file), { recursive: true });
}

console.log("[build-web] LP em dist/index.html, app em dist/app/index.html");
