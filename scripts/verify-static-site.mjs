import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, extname, resolve } from "node:path";

const site = resolve(process.argv[2] ?? "site");
const errors = [];
const expectedNavigation = new Map([
  ["Treatments", "./treatments.html"],
  ["Pain", "./pain.html"],
  ["Programs", "./packages.html"],
  ["Team", "./about.html"],
  ["The Cha Method", "./method.html"],
  ["Evidence", "./research.html"],
  ["Pricing", "./pricing.html"],
  ["Book a session", "./book.html"],
]);

function fail(file, message) {
  errors.push(`${file}: ${message}`);
}

function visibleText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|#160);/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function requiredText(file, html, text) {
  if (!visibleText(html).includes(text)) fail(file, `missing required text: ${text}`);
}

function contentImageCount(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
  return [...main.matchAll(/<img\b/gi)].length;
}

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
if (htmlFiles.length !== 36) fail(site, `expected exactly 36 HTML files, found ${htmlFiles.length}`);
if (!htmlFiles.some((file) => file === resolve(site, "index.html"))) {
  fail(site, "missing index.html");
}

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const name = basename(file);

  for (const match of html.matchAll(/\b(?:href|src|poster|action|formaction)\s*=\s*(["'])(.*?)\1/gi)) {
    verifyReference(file, match[2]);
  }

  if (!/href=["'](?:\.\/)?preview\.css["']/i.test(html)) fail(file, "missing preview.css");
  if (!/src=["'](?:\.\/)?preview\.js["']/i.test(html)) fail(file, "missing preview.js");
  const legacyScripts = [...html.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => match[1])
    .filter((source) => !/(?:^|\/)preview\.js(?:[?#]|$)/i.test(source));
  if (legacyScripts.length) fail(file, `legacy production scripts must be removed: ${legacyScripts.join(", ")}`);
  if (!/<nav\b[^>]*aria-label=["']Primary navigation["']/i.test(html)) fail(file, "missing primary navigation");
  if (!/<button\b[^>]*class=["'][^"']*menu-toggle/i.test(html)) fail(file, "missing mobile menu button");
  if (!/<footer\b/i.test(html)) fail(file, "missing footer element");
  if (/draft-badge/i.test(html)) fail(file, "draft badge must not be published");
  if (/\b(?:href|src|poster)=["']\/static\//i.test(html)) fail(file, "contains a root-relative /static URL");

  const nav = html.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/i)?.[1] ?? "";
  const navLinks = new Map(
    [...nav.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
      .map((match) => [visibleText(match[2]), match[1]]),
  );
  if (!/<a\b[^>]*href=["']\.\/index\.html["'][^>]*class=["'][^"']*nav-logo/i.test(nav)) {
    fail(file, "wordmark must link to ./index.html");
  }
  for (const [label, href] of expectedNavigation) {
    if (navLinks.get(label) !== href) fail(file, `navigation ${label} must link to ${href}`);
  }

  requiredText(file, html, "Start your care journey today.");
  requiredText(file, html, "Cha Physical Therapy");
  requiredText(file, html, "16 W 32nd St, Suite 1007, NoMad, New York 10001");
  requiredText(file, html, "Monday-Friday, 9am-7pm");
  requiredText(file, html, "(646) 718-6201");
  requiredText(file, html, "© 2026");
  if (/(?:212[- )]643[- ]9326|646[- )]979[- ]9769|16469799769)/i.test(html)) {
    fail(file, "contains a stale phone number");
  }
  if (!/href=["']tel:\+16467186201["']/i.test(html)) fail(file, "missing live telephone link");
  if ((html.match(/href=["']https:\/\/www\.chaphysicaltherapy\.com\/privacy-policy["']/gi) ?? []).length < 2) {
    fail(file, "Privacy and HIPAA must both link to the verified live policy");
  }

  const noImagePages = new Set([
    "manual-therapy.html",
    "post-surgical.html",
    "hypermobility.html",
    "postural-restoration.html",
    "plantar-fasciitis.html",
    "pain-management.html",
  ]);
  if (noImagePages.has(name) && contentImageCount(html) > 0) fail(file, "supplemental content image must be removed");
  if (["schroth.html", "pelvic-floor.html"].includes(name) && contentImageCount(html) > 1) {
    fail(file, "must publish at most one content image");
  }
}

for (const file of files.filter((file) => extname(file) === ".css")) {
  const css = readFileSync(file, "utf8");
  for (const match of css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)) {
    verifyReference(file, match[2]);
  }
}

const indexFile = resolve(site, "index.html");
const index = readFileSync(indexFile, "utf8");
for (const oldCopy of ["Complete website preview", "Every page. One system."]) {
  if (visibleText(index).includes(oldCopy)) fail(indexFile, `old directory copy remains: ${oldCopy}`);
}
const homeSequence = [
  "Move through the world at ease.",
  "Naturally. Scientifically.",
  "Your body. Hands and breath.",
  "Care supported by what works.",
  "Explore your treatment area.",
  "Three paths into the same method.",
  "Simple, clear care.",
  "Care people remember.",
  "Start your care journey today.",
];
let previousHomeSection = -1;
for (const heading of homeSequence) {
  const position = visibleText(index).indexOf(heading);
  if (position < 0) fail(indexFile, `missing homepage section: ${heading}`);
  else if (position <= previousHomeSection) fail(indexFile, `homepage section is out of order: ${heading}`);
  previousHomeSection = Math.max(previousHomeSection, position);
}
for (const person of ["Vien Le Wood", "Nicolas Eccles", "Bruna Amajones"]) requiredText(indexFile, index, person);
if (!/href=["']https:\/\/www\.google\.com\/search\?q=Cha\+Physical\+Therapy\+16\+W\+32nd\+St\+New\+York\+reviews["']/i.test(index)) {
  fail(indexFile, "homepage review summary must use the identity-specific live Google destination");
}

const pageTextChecks = new Map([
  ["about.html", ["PT, DPT. Schroth C2 (Level 2) certified, 2011.", "One method. One standard."]],
  ["acupuncture.html", ["Advanced acupuncture, modernized."]],
  ["schroth.html", ["Every Schroth case at the clinic is led by a Level 2 Schroth-certified clinician."]],
  ["scoliosis.html", ["Every Schroth case at the clinic is led by a Level 2 Schroth-certified clinician."]],
  ["manual-therapy.html", ["Leave different."]],
  ["pricing.html", ["$300", "$250", "Good Faith Estimate"]],
]);
for (const [name, texts] of pageTextChecks) {
  const file = resolve(site, name);
  const html = readFileSync(file, "utf8");
  for (const text of texts) requiredText(file, html, text);
}
for (const name of ["about.html", "schroth.html", "scoliosis.html"]) {
  const file = resolve(site, name);
  if (/Hunter College/i.test(readFileSync(file, "utf8"))) fail(file, "Hunter College reference must be removed");
}
if (/By the evidence\.?/i.test(visibleText(readFileSync(resolve(site, "research.html"), "utf8")))) {
  fail(resolve(site, "research.html"), "By the evidence must be removed");
}
if (/Dr\. Park/i.test(visibleText(readFileSync(resolve(site, "botox.html"), "utf8")))) {
  fail(resolve(site, "botox.html"), "Dr. Park biography must be removed");
}

const cssFile = resolve(site, "preview.css");
const css = readFileSync(cssFile, "utf8");
if (!/footer\s*{[^}]*background(?:-color)?\s*:\s*var\(--preview-white\)/is.test(css)) {
  fail(cssFile, "shared footer must use --preview-white");
}
if (!/\.media-fade-enabled\s+main\s+(?:img|video)/i.test(css)) fail(cssFile, "media hiding must be JavaScript-gated");
if (!/@media\s*\(prefers-reduced-motion:\s*reduce\)/i.test(css)) fail(cssFile, "missing reduced-motion rules");

const scriptFile = resolve(site, "preview.js");
const script = readFileSync(scriptFile, "utf8");
for (const marker of ["preventDefault", "media-fade-enabled", "naturalWidth", ".decode(", "is-media-error", "aria-expanded"]) {
  if (!script.includes(marker)) fail(scriptFile, `missing shared behavior marker: ${marker}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Verified ${htmlFiles.length} HTML files and ${files.length} published files.`);
