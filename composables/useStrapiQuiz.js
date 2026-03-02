export const useStrapiQuiz = () => {
  const client = useSupabaseClient();
  
  /**
   * Transform a raw Question from Supabase into the format expected by the quiz UI.
   * Used for both pre-quiz and post-quiz.
   */
  const transformQuestionFromModel = (questionData) => {
    const options = [
      questionData.option1,
      questionData.option2,
      questionData.option3,
      questionData.option4
    ].filter(opt => opt !== null && opt !== undefined && opt !== '');

    const correctOptionMap = {
      'option_1': 0,
      'option_2': 1,
      'option_3': 2,
      'option_4': 3
    };
    const correctIndex = correctOptionMap[questionData.correctOption] ?? 0;
    const questionType = questionData.questionType || 'MCQ';

    return {
      question: questionData.prompt || questionData.question || '',
      options,
      correct: correctIndex,
      questionType,
      correctAnswer: questionData.correctAnswer ?? null,
      explanation: questionData.explanation ?? null
    };
  };

  /**
   * Fetch questions from Supabase by topic and quiz type.
   * @param {string|number} topicId - Topic ID
   * @param {string} quizType - 'pre-quiz' or 'post-quiz'
   * @returns {Promise<Array>} Array of questions
   */
  const fetchQuestionsFromModel = async (indicator, quizType) => {
    if (!topicId) {
      console.warn('useStrapiQuiz: topicId is required');
      return null;
    }
    if (!quizType || !['pre-quiz', 'post-quiz'].includes(quizType)) {
      console.warn('useStrapiQuiz: quizType must be "pre-quiz" or "post-quiz"');
      return null;
    }

    try {
      console.log(`[Supabase] ⚡ Fetching questions (${quizType}) for topic ID: ${topicId}`);

      // Fetch questions from Supabase
      const { data: questionsData, error } = await client
        .from('questions')
        .select('*')
        .eq('indicator', indicator)
        .eq('quiz_type', pre-quiz);

      if (error) {
        console.error(`[Supabase] ❌ Error fetching questions:`, error);
        return null;
      }

      if (!questionsData || questionsData.length === 0) {
        console.warn(`[Supabase] No questions found for topic ${topicId} with quizType ${quizType}`);
        return [];
      }

      const questions = questionsData.map(item => transformQuestionFromModel(item));
      console.log(`[Supabase] ✅ Loaded ${questions.length} questions`);
      return questions;
    } catch (error) {
      console.error(`[Supabase] ❌ Error fetching questions for topic ${topicId} (${quizType}):`, error);
      return null;
    }
  };

  /**
   * Fetch pre-quiz questions from the Question model (quizType = 'pre-quiz').
   * @param {string|number} topicId - The topic ID to fetch questions for
   * @returns {Promise<Array>} Array of quiz questions
   */
  const fetchQuizQuestions = async (topicId) => {
    return fetchQuestionsFromModel(quiz_type, 'pre-quiz');
  };

  /**
   * Fetch post-quiz (problem set) questions from the Question model (quizType = 'post-quiz').
   * @param {string|number} topicId - The topic ID to fetch questions for
   * @returns {Promise<Array>} Array of problem set questions
   */
  const fetchProblemSetQuestions = async (topicId) => {
    return fetchQuestionsFromModel(quiz_type, 'post-quiz');
  };

  /**
   * Fetch a single quiz question by ID from Supabase
   * @param {string} questionId - The question ID
   * @returns {Promise<Object|null>} Quiz question object or null
   */
  const fetchQuizQuestionById = async (questionId) => {
    try {
      const { data, error } = await client
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single();

      if (error) {
        console.error('[Supabase] Error fetching quiz question:', error);
        return null;
      }

      if (data) {
        return transformQuestionFromModel(data);
      }

      return null;
    } catch (error) {
      console.error('[Supabase] Error fetching quiz question:', error);
      return null;
    }
  };

  /**
   * DEBUG ONLY: Fetch ALL questions from Supabase (no filters). Logs full response to console.
   */
  const fetchAllQuestionsDebug = async () => {
    console.log('[Supabase DEBUG] Fetching ALL questions (no filters)');
    try {
      const { data, error } = await client
        .from('questions')
        .select('*');

      if (error) {
        console.error('[Supabase DEBUG] Failed to fetch all questions:', error);
        return [];
      }

      console.log('[Supabase DEBUG] All questions count:', data?.length || 0);
      console.log('[Supabase DEBUG] All questions (full array):', data);
      return data || [];
    } catch (e) {
      console.error('[Supabase DEBUG] Failed to fetch all questions:', e?.message || e, e);
      return [];
    }
  };

  return {
    fetchQuizQuestions,
    fetchProblemSetQuestions,
    fetchQuestionsFromModel,
    fetchQuizQuestionById,
    fetchAllQuestionsDebug
  };
};

