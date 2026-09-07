/**
 * POST /api/ai-assistant/chat
 *
 * Modes:
 *   chat          – conversational concept explanation (returns { content })
 *   lesson-notes  – structured lesson notes for a strand/indicator (returns { data })
 *   lesson-plan   – structured lesson plan for a strand/indicator (returns { data })
 *
 * Required env var:
 *   NUXT_GEMINI_API_KEY – from https://aistudio.google.com/app/apikey
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── System context ────────────────────────────────────────────────────────────
const BASE_CONTEXT = `You are an expert Mathematics teaching assistant trained on Ghana's \
National Curriculum for Basic Schools (Standards-Based / Common Core Curriculum), \
published by NaCCA. You support facilitators (teachers) in Ghanaian basic-school classrooms \
(Primary 4 to JHS 3 / Basic 4 to Basic 9).

Your expertise covers:
- NaCCA Standards-Based Curriculum for Mathematics
- Strands: Number, Algebra / Patterns & Relationships, Geometry and Measurement, Data Handling
- BECE (Basic Education Certificate Examination) preparation
- Pedagogy suited for Ghanaian classrooms and contexts

Always use clear, simple language with step-by-step explanations, and real-world examples \
relevant to Ghanaian pupils where possible.`;

// ─── JSON document instructions ────────────────────────────────────────────────
const LESSON_NOTES_INSTRUCTIONS = `
Produce LESSON NOTES for a Ghanaian basic-school Mathematics facilitator as a single JSON object.

Context supplied by the teacher:
- Grade / Class: {LEVEL}
- Strand / topic area: {STRAND}
- Learning indicator number / code (may be alphanumeric, e.g. "1", "1.2", "B4.1.2.1"): {INDICATOR_NUMBER}
- Learning indicator (may be blank — if blank, derive the standard NaCCA indicator for this strand and grade): {INDICATOR_TEXT}

Return ONLY minified JSON (no markdown fences, no commentary) with EXACTLY this shape:
{
  "strand": string,
  "indicatorNumber": string,          // echo back the indicator number / code exactly as supplied
  "indicatorText": string,            // the full learning indicator statement
  "lessonTopic": string,              // concise lesson topic derived from the indicator
  "duration": string,                 // e.g. "60 minutes" — choose based on the depth of content
  "keyConcept": string,               // 1–2 sentences stating the main idea
  "explanation": string,              // thorough teacher-facing explanation, Markdown allowed (headings, lists, tables)
  "examples": [                        // 3–5 fully worked, step-by-step examples
    { "title": string, "body": string }  // body is Markdown; show every step
  ],
  "diagrams": string,                 // Markdown describing diagrams/number lines/models a teacher should draw, with clear labels
  "summary": string                   // Markdown bullet list of the key points pupils must remember
}
Use $...$ / $$...$$ for any mathematical notation.
`;

const LESSON_PLAN_INSTRUCTIONS = `
Produce a LESSON PLAN for a Ghanaian basic-school Mathematics facilitator as a single JSON object.

Context supplied by the teacher:
- Grade / Class: {LEVEL}
- Strand / topic area: {STRAND}
- Learning indicator number / code (may be alphanumeric, e.g. "1", "1.2", "B4.1.2.1"): {INDICATOR_NUMBER}
- Learning indicator (may be blank — if blank, derive the standard NaCCA indicator for this strand and grade): {INDICATOR_TEXT}

Return ONLY minified JSON (no markdown fences, no commentary) with EXACTLY this shape:
{
  "strand": string,
  "indicatorNumber": string,          // echo back the indicator number / code exactly as supplied
  "indicatorText": string,
  "lessonTitle": string,
  "duration": string,                 // total lesson time, chosen from the depth of content, e.g. "60 minutes"
  "learningObjectives": [string, string, string],   // 3–4 specific, measurable objectives
  "resources": [string],              // teaching / learning materials
  "delivery": [                       // EXACTLY these four phases, in this order
    { "phase": "1. STARTER (Review & Introduction)", "teacherActivities": string, "pupilActivities": string, "resources": string, "duration": string },
    { "phase": "2. MAIN (New Learning)",             "teacherActivities": string, "pupilActivities": string, "resources": string, "duration": string },
    { "phase": "3. PRACTICE (Guided Practice)",      "teacherActivities": string, "pupilActivities": string, "resources": string, "duration": string },
    { "phase": "4. PLENARY (Review & Conclusion)",   "teacherActivities": string, "pupilActivities": string, "resources": string, "duration": string }
  ],
  "assessment": string,               // Markdown — how learning will be assessed, plus 3–5 homework questions
  "differentiation": string,          // Markdown — support for slow, average and fast learners
  "reflection": ""                    // leave as an empty string for the teacher to complete after the lesson
}
The four phase durations must add up to the total "duration".
teacherActivities and pupilActivities may use short Markdown lists. Use $...$ / $$...$$ for mathematical notation.
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const parseJsonDocument = (raw: string) => {
  let text = (raw || "").trim();
  // Strip ```json ... ``` fences if the model added them
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) text = fenced[1].trim();
  // Fall back to the outermost { ... }
  if (!text.startsWith("{")) {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first !== -1 && last !== -1) text = text.slice(first, last + 1);
  }
  return JSON.parse(text);
};

// ─── Handler ──────────────────────────────────────────────────────────────────
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const {
    message,
    mode,
    topic,
    strand,
    level,
    history,
    indicatorNumber,
    indicatorText,
  } = body ?? {};

  const config = useRuntimeConfig();
  const apiKey = config.geminiApiKey as string | undefined;
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "Gemini API key is not configured. Add NUXT_GEMINI_API_KEY to your .env file.",
    });
  }
  const genAI = new GoogleGenerativeAI(apiKey);

  const isDocMode = mode === "lesson-notes" || mode === "lesson-plan";
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: BASE_CONTEXT,
    generationConfig: {
      // Lesson docs are long and must be complete JSON — give them plenty of room
      // (gemini-2.5-flash also spends part of this budget on internal reasoning).
      maxOutputTokens: isDocMode ? 32768 : 8192,
      ...(isDocMode ? { responseMimeType: "application/json" } : {}),
    },
  });

  if (isDocMode) {
    const strandValue = (strand || topic || "").trim();
    if (!strandValue) {
      throw createError({
        statusCode: 400,
        statusMessage: "A strand / topic is required for this document.",
      });
    }
    const template =
      mode === "lesson-notes"
        ? LESSON_NOTES_INSTRUCTIONS
        : LESSON_PLAN_INSTRUCTIONS;
    const prompt = template
      .replace(/\{LEVEL\}/g, level || "Basic 4")
      .replace(/\{STRAND\}/g, strandValue)
      .replace(/\{INDICATOR_NUMBER\}/g, String(indicatorNumber ?? "1").trim() || "1")
      .replace(/\{INDICATOR_TEXT\}/g, (indicatorText || "").trim() || "(blank)");

    try {
      const result = await model.generateContent(prompt);
      const data = parseJsonDocument(result.response.text());
      // Make sure the teacher's own inputs win over anything the model changed
      data.strand = strandValue;
      data.indicatorNumber =
        String(indicatorNumber ?? data.indicatorNumber ?? "1").trim() || "1";
      if ((indicatorText || "").trim()) data.indicatorText = indicatorText.trim();
      return { mode, data };
    } catch (err: any) {
      throw createError({
        statusCode: 502,
        statusMessage: `Could not generate the document: ${
          err?.message ?? "unknown error"
        }`,
      });
    }
  }

  // ─── Chat mode ──────────────────────────────────────────────────────────────
  if (!message?.trim()) {
    throw createError({ statusCode: 400, statusMessage: "Message is required." });
  }
  const contextLines: string[] = [];
  if (Array.isArray(history) && history.length > 0) {
    for (const turn of history.slice(-6)) {
      contextLines.push(
        `${turn.role === "user" ? "Teacher" : "Assistant"}: ${turn.text}`,
      );
    }
  }
  const conversationContext = contextLines.length
    ? `Previous conversation:\n${contextLines.join("\n")}\n\n`
    : "";
  const prompt = `${conversationContext}Teacher: ${message.trim()}`;

  try {
    const result = await model.generateContent(prompt);
    return { content: result.response.text() };
  } catch (err: any) {
    throw createError({
      statusCode: 502,
      statusMessage: `Gemini error: ${err?.message ?? "Unknown error"}`,
    });
  }
});
