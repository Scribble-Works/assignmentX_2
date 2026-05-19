<script setup>
import { computed } from "vue";

const props = defineProps({
  pages: {
    type: [Array, String, Object],
    default: () => [],
  },
  buttonLabel: {
    type: String,
    default: "Sample Questions",
  },
  buttonBlock: {
    type: Boolean,
    default: false,
  },
});

const normalizedPages = computed(() => {
  const value = props.pages;

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (item && typeof item === "object")
          return (item.url || item.src || "").trim();
        return "";
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    const s = value.trim();
    return s ? [s] : [];
  }

  if (value && typeof value === "object") {
    // Could be { questions: [...] }
    if (Array.isArray(value.questions)) {
      return value.questions
        .map((item) => {
          if (typeof item === "string") return item.trim();
          if (item && typeof item === "object")
            return (item.url || item.src || "").trim();
          return "";
        })
        .filter(Boolean);
    }
    const s = (value.url || value.src || "").trim();
    return s ? [s] : [];
  }

  return [];
});

const hasPages = computed(() => normalizedPages.value.length > 0);

function openPopup() {
  if (!process.client) return;
  const pages = normalizedPages.value;
  if (!pages.length) return;

  const win = window.open(
    "",
    "sample-questions-viewer",
    "width=1100,height=800,scrollbars=yes,resizable=yes",
  );
  if (!win) return;

  const safeUrl = (v) =>
    String(v)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const pageMarkup = pages
    .map(
      (page, i) => `
    <section class="page-wrap">
      <div class="page-label">Page ${i + 1} of ${pages.length}</div>
      <img src="${safeUrl(page)}" alt="Sample question page ${i + 1}" loading="lazy" />
    </section>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Sample Questions</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #f3f4f6; color: #1f2937; }
    .bar { position: sticky; top: 0; z-index: 10; background: #111827; color: #fff; padding: 12px 16px; }
    .bar strong { display: block; margin-bottom: 4px; }
    .bar span { font-size: 14px; opacity: 0.85; }
    .pages { padding: 16px; display: grid; gap: 16px; }
    .page-wrap { background: #fff; border-radius: 12px; box-shadow: 0 10px 26px rgba(0,0,0,.10); overflow: hidden; }
    .page-label { background: #e5e7eb; padding: 8px 12px; font-size: 13px; font-weight: 700; }
    img { width: 100%; height: auto; display: block; }
  </style>
</head>
<body>
  <div class="bar">
    <strong>Sample Questions</strong>
    <span>${pages.length} page${pages.length > 1 ? "s" : ""}</span>
  </div>
  <div class="pages">${pageMarkup}</div>
</body>
</html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
}
</script>

<template>
  <v-btn
    v-if="hasPages"
    :block="buttonBlock"
    rounded
    color="grey-darken-3"
    @click="openPopup"
  >
    {{ buttonLabel }}
  </v-btn>
</template>
