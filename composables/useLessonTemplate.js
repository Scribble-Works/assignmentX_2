import { marked } from "marked";
import renderMathInElement from "katex/contrib/auto-render";

marked.use({ breaks: true, gfm: true });

export const renderMarkdown = (text) =>
  text ? marked.parse(String(text)) : "";

export const katexOptions = {
  delimiters: [
    { left: "$$", right: "$$", display: true },
    { left: "$", right: "$", display: false },
    { left: "\\(", right: "\\)", display: false },
    { left: "\\[", right: "\\]", display: true },
  ],
  throwOnError: false,
};

// v-math-render directive — renders KaTeX inside an element after mount/update
export const vMathRender = {
  mounted: (el) => renderMathInElement(el, katexOptions),
  updated: (el) => renderMathInElement(el, katexOptions),
};

/**
 * Stylesheet shared by <LessonPlanTemplate>, <LessonNoteTemplate> and the
 * print/PDF window so the on-screen and printed documents match exactly.
 * Class names are prefixed `lt-` to avoid collisions with Vuetify / Tailwind.
 */
export const LESSON_TEMPLATE_CSS = `
.lt-doc {
  --lt-band: #1f3a63;
  --lt-label-bg: #d6e4f0;
  --lt-label-fg: #1f3a63;
  --lt-section-bg: #f2c98a;
  --lt-section-fg: #7a4a00;
  --lt-border: #9db8d2;
  font-family: "Inter", Arial, Helvetica, sans-serif;
  color: #1f2933;
  background: #fff;
  max-width: 900px;
  margin: 0 auto;
  font-size: 13px;
  line-height: 1.5;
}
.lt-doc.lt--note {
  --lt-band: #4a6222;
  --lt-label-bg: #e2efda;
  --lt-label-fg: #3d5219;
  --lt-section-bg: #d9e8c9;
  --lt-section-fg: #3d5219;
  --lt-border: #b9cfa0;
}
.lt-brandbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 4px 10px;
}
.lt-brandbar img { height: 34px; width: auto; }
.lt-brandbar .lt-brand-name {
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.04em;
  color: var(--lt-band);
}
.lt-brandbar .lt-brand-sub {
  font-size: 11px;
  color: #6b7280;
  margin-left: auto;
}
.lt-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.lt-table td, .lt-table th {
  border: 1px solid var(--lt-border);
  padding: 6px 9px;
  vertical-align: top;
  text-align: left;
  word-wrap: break-word;
  overflow-wrap: anywhere;
}
.lt-band td {
  background: var(--lt-band);
  color: #fff;
  text-align: center;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  border-color: var(--lt-band);
  padding: 9px;
  line-height: 1.35;
}
.lt-band .lt-band-sub { font-size: 12px; font-weight: 600; }
.lt-doc .lt-band td,
.lt-doc .lt-section td,
.lt-doc .lt-note-section td,
.lt-doc .lt-label,
.lt-doc .lt-delivery th {
  overflow-wrap: normal;
  word-break: normal;
  hyphens: none;
}
.lt-label {
  background: var(--lt-label-bg);
  color: var(--lt-label-fg);
  font-weight: 700;
  width: 16%;
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 0.01em;
}
.lt-section td {
  background: var(--lt-section-bg);
  color: var(--lt-section-fg);
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.lt-note-section td {
  background: var(--lt-section-bg);
  color: var(--lt-section-fg);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  font-size: 11px;
}
.lt-delivery th {
  background: #fde9d0;
  color: #7a4a00;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 10.5px;
  text-align: center;
}
.lt-phase { background: #f4f6ef; font-weight: 700; font-size: 11px; }
.lt-delivery tr:nth-child(2) .lt-phase { background: #e9f2dc; }
.lt-delivery tr:nth-child(3) .lt-phase { background: #dcecf5; }
.lt-delivery tr:nth-child(4) .lt-phase { background: #fdf0d5; }
.lt-delivery tr:nth-child(5) .lt-phase { background: #efe3f2; }
.lt-doc ul, .lt-doc ol { margin: 0; padding-left: 18px; }
.lt-doc li { margin-bottom: 2px; }
.lt-doc p { margin: 0 0 6px; }
.lt-doc p:last-child { margin-bottom: 0; }
.lt-ol { margin: 0; padding-left: 18px; }
.lt-ol li { margin-bottom: 4px; }
.lt-rich :first-child { margin-top: 0; }
.lt-rich table { border-collapse: collapse; margin: 6px 0; width: 100%; }
.lt-rich th, .lt-rich td { border: 1px solid #cbd5e1; padding: 4px 7px; }
.lt-rich code {
  background: rgba(0,0,0,0.06);
  border-radius: 3px;
  padding: 0.1em 0.3em;
  font-size: 0.9em;
}
.lt-example { margin-bottom: 8px; }
.lt-example:last-child { margin-bottom: 0; }
.lt-example-title { font-weight: 700; color: var(--lt-label-fg); margin-bottom: 2px; }
.lt-muted { color: #64748b; font-style: italic; }

/* ─── Inline editing controls (screen only — never printed) ─────────────── */
.lt-doc .lt-edit-field {
  width: 100%;
  box-sizing: border-box;
  font: inherit;
  color: inherit;
  background: #fff;
  border: 1px solid var(--lt-border);
  border-radius: 4px;
  padding: 4px 6px;
}
.lt-doc .lt-edit-field:focus {
  outline: none;
  border-color: var(--lt-band);
  box-shadow: 0 0 0 2px rgba(31, 58, 99, 0.12);
}
.lt-doc textarea.lt-edit-field {
  display: block;
  min-height: 60px;
  resize: vertical;
  line-height: 1.5;
  font-family: "Inter", Arial, Helvetica, sans-serif;
}
.lt-doc .lt-edit-row {
  display: flex;
  gap: 6px;
  align-items: flex-start;
  margin-bottom: 6px;
}
.lt-doc .lt-edit-row .lt-edit-field { flex: 1; }
.lt-doc .lt-edit-btn {
  font: inherit;
  font-size: 11px;
  line-height: 1;
  padding: 5px 9px;
  border: 1px solid var(--lt-border);
  border-radius: 4px;
  background: #fff;
  color: var(--lt-label-fg);
  cursor: pointer;
  white-space: nowrap;
}
.lt-doc .lt-edit-btn:hover { background: var(--lt-label-bg); }
.lt-doc .lt-edit-btn--danger { color: #b3261e; border-color: #e6b4b0; }
.lt-doc .lt-edit-btn--danger:hover { background: #fbeceb; }
.lt-doc .lt-edit-add { margin-top: 4px; }
.lt-doc .lt-edit-hint {
  font-size: 10px;
  color: #6b7280;
  margin-top: 2px;
  text-transform: none;
  letter-spacing: 0;
}
@media print {
  .lt-doc .lt-edit-btn, .lt-doc .lt-edit-add { display: none !important; }
}
@media print {
  body { margin: 0; }
  .lt-doc { max-width: none; font-size: 12px; }
  .lt-table td, .lt-table th { border-color: #64748b; }
  .lt-band td { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  /*
   * Long content rows (Explanation, Examples, Diagrams, Summary) are frequently
   * taller than a page. Forcing "break-inside: avoid" on every <tr> made the
   * browser shunt the whole row onto the next page, leaving a half-empty page
   * behind it. Let those rows flow across the page break instead.
   */
  .lt-table, .lt-table tbody, .lt-table tr, .lt-table td { break-inside: auto; }

  /* Keep the short structural rows whole … */
  .lt-band,
  .lt-section,
  .lt-note-section,
  .lt-delivery tr:first-child,
  .lt-doc tr:has(> .lt-label) { break-inside: avoid; }

  /* … and keep every section heading attached to the content it introduces. */
  .lt-band,
  .lt-section,
  .lt-note-section,
  .lt-delivery th { break-after: avoid; }

  /* Don't split an individual worked example or list item unless it can't fit. */
  .lt-example, .lt-doc li { break-inside: avoid; }
}
`;
