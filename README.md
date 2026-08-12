# Cha design preview

Static Cha Physical Therapy design pages prepared for GitHub Pages. The deployable website is in `site/`; it has no build step or runtime dependencies.

## Preview locally

```bash
python3 -m http.server 8000 -d site
```

Open `http://127.0.0.1:8000/`.

## Verify

```bash
node scripts/verify-static-site.mjs
```

The verifier checks that `site/index.html` exists, internal URLs are safe under a GitHub Pages project path, and every local link and asset resolves.

## Deploy

1. Create a GitHub repository and push this repository's `main` branch.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. The **Deploy static site to Pages** workflow publishes `site/` after every push to `main`. It can also be run manually from the Actions tab.
