# BLSSNVJ21 Discharge Summary

A modern, browser-first discharge summary editor for training and administrative drafting.

## Current version
**v2.3 — Browser-only PWA + productivity upgrade (2026) — manual-save architecture**

## Features
- Responsive desktop, tablet and mobile interface
- Progressive Web App (PWA) manifest and service worker
- Offline shell/cache support after the first successful load
- Browser tab favicon/logo using BLSSNVJ21 branding
- SEO metadata, Open Graph and Twitter metadata
- Editable patient/admission fields
- Editable clinical section titles and content
- Add unlimited custom sections
- Move sections up/down
- Delete sections
- Blank summary reset
- Fictional random-data generator
- Print / PDF with A4 print CSS
- Manual browser save only (no automatic saving)
- Visible PWA Install App button
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
This version uses browser storage only (`localStorage`).

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
- Browser-only persistence is explicit.
- PWA assets are versioned; the service worker supports in-app update activation.
- Security-related response headers remain enabled in Flask.
- The UI is designed to degrade gracefully if browser storage or service workers are unavailable.