/**
 * POST /api/ai-assistant/chat
 *
 * Modes:
 *   chat          – conversational concept explanation
 *   lesson-notes  – generates structured lesson notes for a topic
 *   lesson-plan   – generates a full lesson plan for a topic
 *
 * Required env var:
 *   GEMINI_API_KEY – from https://aistudio.google.com/app/apikey
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── System context ────────────────────────────────────────────────────────────
const BASE_CONTEXT = `You are an expert Mathematics teaching assistant trained on Ghana's \
National Curriculum for Basic Schools (Standards-Based Curriculum). \
You support facilitators (teachers) in Ghanaian JHS (Junior High School) classrooms.

Your expertise covers:
- Ghana Standards-Based Curriculum for Mathematics (Primary 4 - 6)
- Ghana Standards-Based Curriculum for Mathematics (JHS 1–3)
- Strands: Number, Algebra, Geometry and Measurement, Data Handling
- BECE (Basic Education Certificate Examination) preparation
- Pedagogy suited for Ghanaian classrooms and contexts

Always use clear, simple language with step-by-step explanations. \
Include real-world examples relevant to Ghanaian students where possible.`;

// ─── Document templates ────────────────────────────────────────────────────────
const LESSON_NOTES_INSTRUCTIONS = `
Generate comprehensive lesson notes for a Ghanaian JHS Mathematics facilitator.
Use exactly the following structure:

LESSON NOTES
============
Topic: {TOPIC}
Class: {LEVEL}
Strand: [identify the correct strand from the Ghana SBC]
Duration: 60 minutes

1. LEARNING OBJECTIVES
   By the end of this lesson, students will be able to:
   (list 3–4 specific, measurable objectives)

2. KEY VOCABULARY
   (define 5–8 key terms)

3. PREREQUISITE KNOWLEDGE
   (what students must already know)

4. CONTENT EXPLANATION
   (thorough explanation of the concept in teacher-friendly language)

5. WORKED EXAMPLES
   (provide 4–5 fully solved step-by-step examples, numbered)

6. COMMON MISCONCEPTIONS
   (list typical errors students make and how to correct them)

7. PRACTICE QUESTIONS
   (provide 8 questions of varying difficulty with full answers)

8. KEY TAKEAWAYS
   (bullet-point summary of the most important points)
`;

const LESSON_PLAN_INSTRUCTIONS = `
Generate a detailed lesson plan for a Ghanaian JHS Mathematics facilitator.
Use exactly the following structure:

LESSON PLAN
===========
Subject:       Mathematics
Topic:         {TOPIC}
Class:         {LEVEL}
Duration:      60 minutes
Date:          _______________
Facilitator:   _______________

CURRICULUM ALIGNMENT
Strand:           [identify correct strand]
Sub-strand:       [identify correct sub-strand]
Content Standard: [reference from Ghana SBC]
Learning Indicators:
  1. [indicator 1]
  2. [indicator 2]
  3. [indicator 3]

LEARNING OBJECTIVES
By the end of the lesson, students will be able to:
  1. [objective 1]
  2. [objective 2]
  3. [objective 3]

MATERIALS & RESOURCES
  - [list all teaching materials]

KEY VOCABULARY
  [5–8 terms with brief definitions]

─────────────────────────────────────────────
LESSON PROCEDURE
─────────────────────────────────────────────

PHASE 1 – STARTER / REVIEW (10 minutes)
  [engaging hook or review activity to activate prior knowledge]

PHASE 2 – INTRODUCTION OF NEW CONCEPT (10 minutes)
  Teacher actions:  [what the teacher does]
  Student actions:  [what students do]

PHASE 3 – MAIN ACTIVITY (25 minutes)
  Teacher actions:  [step-by-step teaching actions]
  Student actions:  [student engagement and tasks]
  Key questions to ask:
    - [question 1]
    - [question 2]
    - [question 3]

PHASE 4 – GUIDED PRACTICE (10 minutes)
  [supervised practice problems with teacher circulating]

PHASE 5 – CLOSURE (5 minutes)
  [summary activity and exit ticket]

─────────────────────────────────────────────
ASSESSMENT
  Formative:   [method used during lesson]
  Homework:    [assignment with 3–5 problems]

DIFFERENTIATION
  Support (struggling learners):   [strategies]
  Extension (advanced learners):   [enrichment tasks]

TEACHER REFLECTION (complete after lesson)
  What went well:     _______________
  What to improve:    _______________
  Follow-up needed:   _______________
`;

// ─── Handler ──────────────────────────────────────────────────────────────────
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { message, mode, topic, level, history } = body ?? {};

  const config = useRuntimeConfig();
  const apiKey = config.geminiApiKey as string | undefined;
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "Gemini API key is not configured. Add GEMINI_API_KEY to your .env file.",
    });
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: BASE_CONTEXT,
    generationConfig: { maxOutputTokens: 8192 },
  });

  let prompt: string;

  if (mode === "lesson-notes") {
    if (!topic?.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: "Topic is required for lesson notes.",
      });
    }
    prompt = LESSON_NOTES_INSTRUCTIONS.replace("{TOPIC}", topic.trim()).replace(
      "{LEVEL}",
      level || "JHS",
    );
  } else if (mode === "lesson-plan") {
    if (!topic?.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: "Topic is required for a lesson plan.",
      });
    }
    prompt = LESSON_PLAN_INSTRUCTIONS.replace("{TOPIC}", topic.trim()).replace(
      "{LEVEL}",
      level || "JHS",
    );
  } else {
    // Chat mode — include recent history for multi-turn context
    if (!message?.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: "Message is required.",
      });
    }
    const contextLines: string[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const turn of history.slice(-6)) {
        // last 3 exchanges
        contextLines.push(
          `${turn.role === "user" ? "Teacher" : "Assistant"}: ${turn.text}`,
        );
      }
    }
    const conversationContext = contextLines.length
      ? `Previous conversation:\n${contextLines.join("\n")}\n\n`
      : "";
    prompt = `${conversationContext}Teacher: ${message.trim()}`;
  }

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
