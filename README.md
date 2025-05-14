A single‑page, Google‑powered workflow that lets facilitators and staff collect “Athenian Dialogue Assessment” files, store them in Drive, record every submission in Sheets, 
and receive a nightly e‑mail digest — all without a traditional server.

Front‑end Static HTML + CSS (AA‑accessible) + vanilla JS Back‑end Google Apps Script  (Web App) Storage Google Drive (uploads) + Google Sheets (Courses, Submissions) Messaging Gmail (MailApp) daily summaries

🚀 What it does Dynamic course list GET request (JSONP) pulls the next two open courses from the Courses sheet and fills the dropdown.

Accessible form WCAG‑AA color/contrast, labelled controls, inline ARIA error messages, keyboard‑friendly.

Smart uploads ‑ Files saved to Drive/ Athenian Test/ {Course Title}/ ‑ Auto‑renamed → {CourseCode} – {LastName}, {FirstName}.pdf

Sheet logging Each submit creates a row in Submissions with timestamp, contact info, course & facilitator e‑mail, and the Drive link (or “No File Submitted”).

Nightly digest A time‑based Apps‑Script trigger sends one e‑mail per facilitator at 6 p.m., CC’ing Katherine Coates, listing that day’s submissions.

Zero infrastructure Runs entirely on free Google Workspace services (Apps Script quota).
