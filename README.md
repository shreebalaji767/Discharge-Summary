# BLSSNVJ21 Discharge Summary

A browser-only discharge summary editor published as a static GitHub Pages site.

**Live site:** https://shreebalaji767.github.io/Discharge-Summary/

## Static architecture
- HTML5, CSS3 and vanilla JavaScript only.
- GitHub Pages hosting; no Flask runtime, Python server, database, patient-data API or paid service is needed.
- Patient information and drafts stay in the browser's local storage.
- PWA install support and an offline application shell after the first successful online load.
- Responsive layout for phones, tablets, laptops and desktop screens.
- A4 print stylesheet; use the browser's Print / PDF action to save a PDF.

## Features retained
- Editable patient and admission fields.
- Editable discharge type.
- Nine standard clinical sections on a new summary.
- Add unlimited custom sections, edit titles/content, reorder, collapse/expand and delete sections.
- Expand All / Collapse All and live section count.
- New Blank Summary without deleting saved drafts.
- Fictional Random Data generator.
- Manual Save and Restore Last Draft.
- Named Save Draft / Open Draft workflows.
- Unsaved-change status and Ctrl/Cmd+S / Ctrl/Cmd+P shortcuts.
- Install App button with browser-specific installation guidance.
- PWA update notification and app shortcuts.
- Print-only text rendering and A4 page styling.

## Data and privacy
This application does not send clinical form contents to a server. Browser storage is local to the browser profile and device; it is not encrypted medical-record storage. Anyone with access to that browser profile may be able to access saved drafts. Use fictional or appropriately authorized information only. This is a drafting utility, not a production EMR/HIS.

**Important migration note:** GitHub Pages and the previous Render deployment use different website origins. Browsers isolate localStorage by origin, so drafts saved on the old Render URL will not automatically appear on the GitHub Pages URL. Keep the old deployment available until you have manually copied any records you need; the existing editor's local-only storage does not provide a cross-origin migration mechanism.

## Local preview
Because this is a static site, you can serve the repository root with any static file server. For example, with Python installed:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. Python is only a local preview server; it is not part of the deployed application. Service workers require localhost or HTTPS.

## Project structure
```text
index.html                 # GitHub Pages entry point
sw.js                      # Root-scoped, project-path-aware service worker
static/
  style.css
  js/core.js
  js/app.js
  manifest.webmanifest
  icons/icon.svg
.github/workflows/
  ci.yml                   # Static asset and JavaScript checks
  pages.yml                # GitHub Pages deployment
```

Legacy Flask files are retained in the repository for reference but are not used by GitHub Pages.
