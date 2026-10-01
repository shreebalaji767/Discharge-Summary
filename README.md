# BLSSNVJ21 Discharge Summary

A modern, browser-first discharge summary editor for training and administrative drafting.

## Current version
**v2 — Browser-only PWA upgrade (2026)**

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
- Automatic browser autosave
- Restore last browser draft
- Named draft save/open
- JSON import/export backup
- Clear browser storage
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

## JSON backup workflow
1. Enter or edit the summary.
2. The editor automatically saves the current draft to browser storage.
3. Use **Export JSON** for a portable backup.
4. Use **Import JSON** to restore a backup on another browser/device.
5. Use **Save Draft** / **Open Draft** for named local drafts.

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
- PWA assets are versioned.
- Security-related response headers remain enabled in Flask.
- The UI is designed to degrade gracefully if browser storage or service workers are unavailable.