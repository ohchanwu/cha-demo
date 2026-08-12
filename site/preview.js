(() => {
  const pages = new Set([
    "about", "acupuncture", "book", "botox", "dr-cha", "elbow-pain",
    "hip-pain", "hypermobility", "in-person-care", "knee-pain",
    "low-back-pain", "manual-therapy", "method", "neck-pain", "our-space",
    "packages", "pain", "pain-management", "pelvic-floor", "pelvic-pain",
    "plantar-fasciitis", "post-surgical", "postpartum", "postural-restoration",
    "pricing", "providers", "research", "schroth", "sciatica", "scoliosis",
    "shoulder-pain", "tmj", "treatments", "visit", "who-we-treat"
  ]);

  const aliases = {
    "team": "about",
    "programs": "packages",
    "evidence": "research",
    "cha-method": "method",
    "pelvic_floor": "pelvic-floor"
  };

  const scriptUrl = document.currentScript && document.currentScript.src
    ? new URL(document.currentScript.src)
    : new URL("./preview.js", document.location.href);
  const previewRoot = new URL("./", scriptUrl);
  const homeUrl = new URL("./index.html", previewRoot);

  const localPageUrl = (slug, hash = "") => {
    const url = new URL(`${slug}.html`, previewRoot);
    url.hash = hash;
    return url.href;
  };

  const routeFor = (rawHref) => {
    if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) {
      return null;
    }

    let path = "";
    let hash = "";

    if (rawHref.startsWith("/")) {
      const hashIndex = rawHref.indexOf("#");
      path = (hashIndex >= 0 ? rawHref.slice(0, hashIndex) : rawHref).split("?")[0];
      hash = hashIndex >= 0 ? rawHref.slice(hashIndex) : "";
    } else {
      try {
        const url = new URL(rawHref, "https://www.chaphysicaltherapy.com/");
        if (!/^(www\.)?chaphysicaltherapy\.com$/i.test(url.hostname)) return null;
        path = url.pathname;
        hash = url.hash;
      } catch {
        return null;
      }
    }

    path = path.replace(/\/+$/, "") || "/";
    if (path === "/" || path === "/v2") return homeUrl.href + hash;

    let slug = path.replace(/^\/v2\//, "").replace(/^\//, "").replace(/\.html$/, "");
    slug = aliases[slug] || slug;
    return pages.has(slug) ? localPageUrl(slug, hash) : null;
  };

  document.querySelectorAll("a[href]").forEach((link) => {
    if (link.relList.contains("external")) return;
    const rawHref = link.getAttribute("href");
    const localHref = routeFor(rawHref);
    if (!localHref) return;
    link.dataset.liveHref = rawHref;
    link.href = localHref;
  });

  const currentSlug = document.location.pathname.split("/").pop().replace(/\.html$/, "");
  document.querySelectorAll(".nav-links a[href]").forEach((link) => {
    const targetSlug = new URL(link.href).pathname.split("/").pop().replace(/\.html$/, "");
    if (targetSlug === currentSlug) link.setAttribute("aria-current", "page");
  });

  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      let note = form.querySelector(".preview-form-note");
      if (!note) {
        note = document.createElement("p");
        note.className = "preview-form-note";
        form.appendChild(note);
      }
      note.textContent = "Preview only. Nothing was submitted.";
    }, true);
  });

  if (!document.title.includes("Design preview")) {
    document.title = `${document.title.replace(/\s[-|]\sCha Physical Therapy.*$/i, "")} | Design preview`;
  }
})();
