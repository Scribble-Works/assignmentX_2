export const useStrapiQuiz = () => {
  const client = useSupabaseClient();

  /**
   * Transform a raw Question row from Supabase into the format expected by the quiz UI.
   * Used for both pre-quiz and post-quiz.
   *
   * IMPORTANT: Supabase returns snake_case column names, e.g.
   *   option_1, option_2, option_3, option_4, correct_option, question_type,
   *   correct_answer, prompt, explanation, true, false.
   * The previous version read camelCase (option1, correctOption, questionType)
   * which never matched, so questions rendered with no options / wrong answers.
   */
  const transformQuestionFromModel = (q) => {
    if (!q) return null;

    const questionType = (q.question_type || q.questionType || "MCQ")
      .toString()
      .trim();

    const prompt = q.prompt || q.question || "";
    const explanation = q.explanation ?? null;
    const correctAnswer = q.correct_answer ?? null;

    // --- True / False ---
    if (questionType === "True/False") {
      const trueLabel = q.true ?? "True";
      const falseLabel = q.false ?? "False";
      const ca = (correctAnswer ?? "").toString().trim().toLowerCase();
      const correctIndex = ca === "false" ? 1 : 0;
      return {
        question: prompt,
        options: [trueLabel, falseLabel],
        correct: correctIndex,
        questionType,
        correctAnswer: (correctAnswer ?? trueLabel).toString().trim(),
        explanation,
      };
    }

    // --- Fill in the blank / Multiple blanks ---
    if (
      questionType === "Fill in the blank" ||
      questionType === "Multiple blanks"
    ) {
      return {
        question: prompt,
        options: [],
        correct: -1,
        questionType,
        correctAnswer: correctAnswer ? correctAnswer.toString().trim() : null,
        explanation,
      };
    }

    // --- MCQ / multiple-choice (default) ---
    const options = [
      q.option_1,
      q.option_2,
      q.option_3,
      q.option_4,
    ]
      .map((o) => (o === null || o === undefined ? "" : String(o)))
      .filter((o) => o.trim() !== "");

    // correct_option is stored as "option1" | "option2" | "option3" | "option4"
    const correctOptionMap = {
      option1: 0,
      option2: 1,
      option3: 2,
      option4: 3,
    };
    let correctIndex = correctOptionMap[q.correct_option];
    if (correctIndex === undefined) correctIndex = 0;
    // Guard against an out-of-range index after empty options are filtered out
    if (correctIndex < 0 || correctIndex >= options.length) correctIndex = 0;

    return {
      question: prompt,
      options,
      correct: correctIndex,
      questionType,
      correctAnswer: correctAnswer ? correctAnswer.toString().trim() : null,
      explanation,
    };
  };

  /**
   * Normalize an indicator value for matching against the `indicators` column.
   * The page passes the raw substrand text which can contain a trailing tab
   * (e.g. "B7.1.1.1.5 ...places\t") while the DB stores it without the tab.
   * Trimming whitespace makes the exact-match query succeed.
   */
  const normalizeIndicator = (value) => {
    if (value === null || value === undefined) return "";
    return String(value).trim();
  };

  /**
   * Fetch questions from Supabase by indicator text and quiz type.
   * @param {string} indicator - Indicator TEXT (matches the `indicators` column)
   * @param {string} quiz_type - 'pre-quiz' or 'post-quiz'
   * @returns {Promise<Array|null>} Array of questions, [] if none, null on error
   */
  const fetchQuestionsFromModel = async (indicator, quiz_type) => {
    if (!indicator) {
      console.warn("useStrapiQuiz: indicator is required");
      return null;
    }
    if (!quiz_type || !["pre-quiz", "post-quiz"].includes(quiz_type)) {
      console.warn('useStrapiQuiz: quiz_type must be "pre-quiz" or "post-quiz"');
      return null;
    }

    const normalizedIndicator = normalizeIndicator(indicator);

    try {
      console.log(
        `[Supabase] ⚡ Fetching questions (${quiz_type}) for indicator: ${normalizedIndicator}`,
      );

      const { data: questionsData, error } = await client
        .from("questions")
        .select("*")
        .eq("indicators", normalizedIndicator)
        .eq("quiz_type", quiz_type);

      if (error) {
        console.error(`[Supabase] ❌ Error fetching questions:`, error);
        return null;
      }

      if (!questionsData || questionsData.length === 0) {
        console.warn(
          `[Supabase] No questions found for indicator "${normalizedIndicator}" with quizType ${quiz_type}`,
        );
        return [];
      }

      const questions = questionsData
        .map((item) => transformQuestionFromModel(item))
        .filter(Boolean);
      console.log(`[Supabase] ✅ Loaded ${questions.length} questions`);
      return questions;
    } catch (error) {
      console.error(
        `[Supabase] ❌ Error fetching questions for indicator ${normalizedIndicator} (${quiz_type}):`,
        error,
      );
      return null;
    }
  };

  /**
   * Fetch pre-quiz questions (quiz_type = 'pre-quiz') for an indicator.
   * @param {string} indicator - Indicator TEXT
   * @returns {Promise<Array>} Array of quiz questions
   */
  const fetchQuizQuestions = async (indicator) => {
    return fetchQuestionsFromModel(indicator, "pre-quiz");
  };

  /**
   * Fetch post-quiz (problem set) questions (quiz_type = 'post-quiz') for an indicator.
   * @param {string} indicator - Indicator TEXT
   * @returns {Promise<Array>} Array of problem set questions
   */
  const fetchProblemSetQuestions = async (indicator) => {
    return fetchQuestionsFromModel(indicator, "post-quiz");
  };

  /**
   * DEBUG ONLY: Fetch ALL questions from Supabase (no filters). Logs to console.
   */
  const fetchAllQuestionsDebug = async () => {
    console.log("[Supabase DEBUG] Fetching ALL questions (no filters)");
    try {
      const { data, error } = await client
        .from("questions")
        .select("*")
        .limit(1000);

      if (error) {
        console.error("[Supabase DEBUG] Failed to fetch all questions:", error);
        return [];
      }

      console.log("[Supabase DEBUG] All questions count:", data?.length || 0);
      return data || [];
    } catch (e) {
      console.error(
        "[Supabase DEBUG] Failed to fetch all questions:",
        e?.message || e,
        e,
      );
      return [];
    }
  };

  return {
    fetchQuizQuestions,
    fetchProblemSetQuestions,
    fetchQuestionsFromModel,
    transformQuestionFromModel,
    fetchAllQuestionsDebug,
  };
};
