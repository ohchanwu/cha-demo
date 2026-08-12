import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";

const site = resolve(process.argv[2] ?? "site");
const errors = [];

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : path;
  });
}

function verifyReference(source, reference) {
  const value = reference.trim();
  if (!value || value.startsWith("#") || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(value)) return;
  if (value.startsWith("/")) {
    errors.push(`${source}: root-relative URL will miss a GitHub Pages project path: ${value}`);
    return;
  }

  const target = resolve(dirname(source), decodeURI(value.split(/[?#]/, 1)[0]));
  if (!target.startsWith(`${site}/`) && target !== site) {
    errors.push(`${source}: local URL escapes the published site: ${value}`);
    return;
  }

  const resolvedTarget = existsSync(target) && statSync(target).isDirectory()
    ? resolve(target, "index.html")
    : target;
  if (!existsSync(resolvedTarget)) errors.push(`${source}: missing local target: ${value}`);
}

if (!existsSync(site)) {
  console.error(`Missing static site directory: ${site}`);
  process.exit(1);
}

const files = filesUnder(site);
const htmlFiles = files.filter((file) => extname(file) === ".html");
if (!htmlFiles.some((file) => file === resolve(site, "index.html"))) {
  errors.push(`${site}: missing index.html`);
}

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(/\b(?:href|src|poster|action|formaction)\s*=\s*(["'])(.*?)\1/gi)) {
    verifyReference(file, match[2]);
  }
}

for (const file of files.filter((file) => extname(file) === ".css")) {
  const css = readFileSync(file, "utf8");
  for (const match of css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)) {
    verifyReference(file, match[2]);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Verified ${htmlFiles.length} HTML files and ${files.length} published files.`);
