# BLSSNVJ21 Discharge Summary

A browser-based discharge summary editor published as a static GitHub Pages site.

**Live site:** https://shreebalaji767.github.io/Discharge-Summary/

## Overview

- Built with HTML5, CSS3 and vanilla JavaScript.
- Hosted as a static site on GitHub Pages.
- No Flask/Python server, backend, database, patient-data API, subscription or paid service is required at runtime.
- Drafts are stored in the browser's local storage on the current device and browser profile.
- Responsive interface for phones, tablets and desktop screens.
- Progressive Web App (PWA) install support and an offline application shell after the first successful load.
- A4 print layout; use the browser's Print command to print or save a PDF.

## Features

- Editable patient details and admission information.
- Editable discharge type.
- Nine standard clinical sections when creating a new summary.
- Add custom sections, edit their titles and content, reorder, collapse/expand or delete them.
- Expand All / Collapse All controls and a live section count.
- Create a new blank summary without deleting saved drafts.
- Fictional random-data generator for testing the editor.
- Manual Save and Restore Last Draft.
- Named Save Draft and Open Draft workflows.
- Unsaved-change indicator.
- Keyboard shortcuts: Ctrl/Cmd+S to save and Ctrl/Cmd+P to print.
- Install App button with browser-specific installation guidance.
- PWA update notification and app shortcuts.
- Print-only text rendering and A4 page styling.

## Privacy and data storage

The application does not send clinical form contents to a server. Drafts are stored locally by the browser; they are not automatically synchronized between devices or browsers.

**Local storage is not encrypted medical-record storage.** Anyone with access to the same browser profile may be able to access its saved drafts. Clearing browser site data, changing browser profiles or using another device can make those drafts unavailable. Keep separate, secure records according to your organization's policies.

Use fictional data for testing and only enter real patient information when you are authorized to do so. This tool is a document-drafting utility, not a certified EMR/HIS or a substitute for clinical review.

### Moving from the previous Render site

The old Render deployment and this GitHub Pages site have different website origins. Browsers isolate local storage by origin, so drafts saved on the Render URL do not automatically appear on GitHub Pages. Keep access to the old site until any required information has been safely transferred using an available application workflow. Do not assume that a browser migration or deployment copies patient drafts.

## Deployment

The production site is published from the repository's `main` branch using GitHub Actions:

1. Open the repository's **Settings → Pages**.
2. Confirm **Build and deployment → Source** is set to **GitHub Actions**.
3. Push changes to `main`; the Pages workflow publishes the repository's static files.
4. Check the **Actions** tab. The Pages workflow must complete successfully before the new version is available.

The site is hosted at the project URL above, so internal asset references must remain relative to the repository path (for example, `./static/style.css`). Do not use root-absolute paths such as `/static/style.css`, which point to the domain root rather than this project.

## Troubleshooting

### The site or assets return 404

- Confirm the Pages workflow completed successfully for the latest commit.
- Confirm the Pages source is **GitHub Actions** and the deployment URL is the project URL shown above.
- Check the failed request in browser DevTools → **Network**. The request URL and response identify whether the missing resource is the page itself or an individual asset.
- Check that the requested file exists in the repository and that its path and letter casing match exactly. GitHub Pages paths are case-sensitive.
- If the page was recently deployed, retry in a private/incognito window to rule out stale browser cache.

### The app looks outdated or does not update offline

The service worker may still have an older cached application shell. First connect to the internet and reload the site. If it remains stale, clear the site's stored data/cache in the browser's site settings, then reload while online. Clearing site data can also delete locally saved drafts, so preserve any important information first.

### The app does not install

PWA installation depends on browser support and secure-context requirements. Open the site over HTTPS, use a supported browser, and check its browser menu for an install option. The browser may not show an install prompt on every visit.

## Local preview

This is a static site. You can preview it from the repository root with any static file server. For example, if Python is installed:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. Python is only a local preview server; it is not part of the deployed application. Service workers require localhost or HTTPS.

## Project structure

```text
index.html                 # GitHub Pages entry point
sw.js                      # Root-scoped, project-path-aware service worker
static/
  style.css                # Application styles and print layout
  js/
    core.js                # Core application logic
    app.js                 # User interface and interactions
  manifest.webmanifest     # PWA manifest
  icons/
    icon.svg               # Application icon
.github/workflows/
  ci.yml                   # Static asset and JavaScript checks
  pages.yml                # GitHub Pages deployment workflow
```

Legacy Flask/Python files are retained for reference and are not required by the GitHub Pages deployment.
