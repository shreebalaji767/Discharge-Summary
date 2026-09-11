# Discharge Summary Editor - HMS Training Tool

A clean, single-purpose Flask training application containing **only the Discharge Summary module**.

## Included sections

1. Final Diagnosis
2. Condition on Admission
3. Symptoms / Complaints during treatment
4. General & Systemic Examinations
5. Course in the Hospital
6. Condition at Discharge
7. Diet Plan
8. Followup
9. Advice on Discharge
10. Type of Discharge

## Editing

- Every patient/admission field is editable.
- Every section title is editable.
- Every section's content is editable.
- Add unlimited custom sections.
- Delete any section.
- Move sections up/down.
- Generate a random fictional discharge summary.
- Start a blank discharge summary.
- Save to the current Python session only.
- Save / Print PDF using the browser print dialog.

## Storage

There is **no database and no permanent file storage**. Data exists only in Python RAM while the server is running.

## Run on Windows

```text
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:5000`.

## Training notice

Use fictional training data only. This application is not a clinical record system and should not be used as a substitute for a production hospital information system.
