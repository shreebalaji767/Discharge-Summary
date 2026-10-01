# BLSSNVJ21 Discharge Summary

A modern, browser-first discharge summary editor for training and administrative drafting.

## Current version
**v3.2 — Render deployment and production hardening (2026-10)**

## Features
- Responsive desktop, tablet and mobile interface
- Progressive Web App (PWA) manifest and service worker
- Offline shell/cache support after the first successful load
- Browser tab favicon/logo using BLSSNVJ21 branding
- Comprehensive SEO metadata, canonical URL, hreflang, Open Graph, Twitter/X metadata and Schema.org structured data
- BLSSNVJ21 branding consistently exposed in title, metadata, manifest and structured data
- Editable patient/admission fields
- Editable clinical section titles and content
- Add unlimited custom sections
- Move sections up/down
- Delete sections
- Blank summary reset without deleting the previously saved browser draft
- Fictional random-data generator
- Print / PDF with A4 print CSS
- Manual browser save only (no automatic saving)
- Visible PWA Install App button with native prompt + browser-specific install guidance
- Dedicated install guidance dialog for Chrome, Edge, Android and iOS
- PWA launch handling for existing app windows
- PWA cache v10 with safe versioned cleanup and explicit update activation
- Section DOM observer keeps reorder/add/delete/collapse controls synchronized after every render
- PWA update notification when a new service-worker version is available
- Expand All / Collapse All clinical sections
- Live clinical section count
- Unsaved-change status across patient, discharge and clinical fields
- Restore last browser draft
- Named draft save/open
- No database
- No server-side patient-data API
- No clinical data is intentionally sent to a server by the editor

## Storage model
This version uses browser storage only (`localStorage`) with an explicit manual-save model. Version 3 can read the previous v2 saved draft format without automatically writing it.

Drafts are stored in the browser profile on the device being used. Browser storage is not encrypted medical-record storage. Anyone with access to the same browser profile/device may potentially access saved data.

The Flask application serves the editor page and static assets; it does not provide a database or clinical-data persistence API.

## Run locally on Windows
```text
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:5000`.

For PWA installation and service-worker features, use a secure HTTPS deployment or localhost.

## Manual storage workflow
1. Enter or edit the summary.
2. Nothing is saved automatically while typing, printing, restoring, loading random data, leaving the page, or switching tabs.
3. Use **Save** when you explicitly want to store the current summary in browser storage.
4. Use **Save Draft** to create a named local draft.
5. Use **Open Draft** or **Restore Draft** to load an existing local draft. Opening/restoring a draft does not automatically save it again.
6. JSON Export, JSON Import and Clear Storage controls are intentionally not provided by the UI.

## Print / PDF
Use **Print / PDF** and select the browser's PDF printer when a PDF file is required. The application provides dedicated A4 print CSS and hides editing controls during printing.

Browser print headers/footers are controlled by the browser's print settings.

## Training and data notice
Use fictional or appropriately authorized data only. This project is a drafting/training utility, not a replacement for a production hospital information system, EMR, or secure medical-record platform.

## Project structure
```text
app.py
requirements.txt
templates/
  index.html
static/
  style.css
  js/
    core.js
    app.js
  sw.js
  manifest.webmanifest
  icons/
    icon.svg
README.md
```

## Production cleanup
- No database files are required.
- No patient-data API routes are required.
- Strict Content Security Policy with no inline JavaScript.
- Security headers for framing, MIME sniffing, referrer policy and cross-origin isolation.
- Externalized application JavaScript for easier maintenance and CSP compatibility.
- Storage schema v3 with compatibility reads for previous browser drafts.
- Browser-only persistence is explicit.
- PWA assets are versioned; the service worker supports in-app update activation and only removes caches belonging to this application.
- Security-related response headers remain enabled in Flask.
- Render/Gunicorn binds explicitly to `0.0.0.0:$PORT` through `gunicorn.conf.py` so the platform can detect the web service.
- `/health` provides a lightweight service health endpoint.
- The UI is designed to degrade gracefully if browser storage or service workers are unavailable.