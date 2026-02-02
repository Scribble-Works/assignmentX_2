export const useStrapiQuiz = () => {
  const config = useRuntimeConfig();
  const strapiUrl = config.public.STRAPI_URL || 'http://localhost:1337';

  /**
   * Transform a raw Question model item from Strapi into the format expected by the quiz UI.
   * Used for both pre-quiz and post-quiz (post-quiz may include questionType, correctAnswer).
   */
  const transformQuestionFromModel = (questionData) => {
    const options = [
      questionData.option1,
      questionData.option2,
      questionData.option3,
      questionData.option4
    ].filter(opt => opt !== null && opt !== undefined && opt !== '');

    const correctOptionMap = {
      'one': 0,
      'two': 1,
      'three': 2,
      'four': 3
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
   * Fetch questions from the Question model by topic and quiz type.
   * Both pre-quiz and post-quiz use the same Strapi Question content type;
   * filter by topic and quizType (e.g. 'pre-quiz' or 'post-quiz').
   * @param {string|number} topicId - Topic ID (topics relation)
   * @param {string} quizType - 'pre-quiz' or 'post-quiz'
   * @returns {Promise<Array>} Array of questions
   */
  const fetchQuestionsFromModel = async (topicId, quizType) => {
    if (!topicId) {
      console.warn('useStrapiQuiz: topicId is required');
      return null;
    }
    if (!quizType || !['pre-quiz', 'post-quiz'].includes(quizType)) {
      console.warn('useStrapiQuiz: quizType must be "pre-quiz" or "post-quiz"');
      return null;
    }

    try {
      console.log(`[Strapi] ⚡ Fetching questions (${quizType}) for topic ID: ${topicId}`);
      console.log(`[Strapi] 🔗 Strapi URL: ${strapiUrl}`);

      const addPopulate = (p) => ({ ...p, populate: '*' });
      const parseList = (response) => {
        const data = response?.data ?? response;
        return Array.isArray(data) ? data : [];
      };

      let questionsData = [];

      // 1) Try topic ONLY first (no quizType) – relation "topics"
      try {
        const response = await $fetch(`${strapiUrl}/api/questions`, {
          params: addPopulate({ 'filters[topics][id][$eq]': topicId }),
          timeout: 10000
        });
        const list = parseList(response);
        if (list.length > 0) {
          questionsData = list;
          console.log(`[Strapi] ✅ Found ${list.length} questions (topic ${topicId} only)`);
        }
      } catch (e) {
        console.warn(`[Strapi] topic (topics):`, e?.message || e);
      }

      // 2) Try topic ONLY – relation "topic" (singular)
      if (questionsData.length === 0) {
        try {
          const response = await $fetch(`${strapiUrl}/api/questions`, {
            params: addPopulate({ 'filters[topic][id][$eq]': topicId }),
            timeout: 10000
          });
          const list = parseList(response);
          if (list.length > 0) {
            questionsData = list;
            console.log(`[Strapi] ✅ Found ${list.length} questions (topic ${topicId}, relation topic)`);
          }
        } catch (e) {
          console.warn(`[Strapi] topic (topic):`, e?.message || e);
        }
      }

      // 3) Try topic + quizType with exact value we use
      if (questionsData.length === 0) {
        try {
          const response = await $fetch(`${strapiUrl}/api/questions`, {
            params: addPopulate({
              'filters[topics][id][$eq]': topicId,
              'filters[quizType][$eq]': quizType
            }),
            timeout: 10000
          });
          const list = parseList(response);
          if (list.length > 0) {
            questionsData = list;
            console.log(`[Strapi] ✅ Found ${list.length} questions (topic + quizType=${quizType})`);
          }
        } catch (e) {
          console.warn(`[Strapi] topic+quizType:`, e?.message || e);
        }
      }

      // 4) Try alternate quizType values Strapi might use (e.g. "Pre-quiz", "pre_quiz")
      const quizTypeVariants = {
        'pre-quiz': ['pre-quiz', 'Pre-quiz', 'PreQuiz', 'pre_quiz', 'Pre-quiz '],
        'post-quiz': ['post-quiz', 'Post-quiz', 'PostQuiz', 'post_quiz', 'Post-quiz ']
      };
      const variants = quizTypeVariants[quizType] || [quizType];
      if (questionsData.length === 0) {
        for (const variant of variants) {
          if (variant === quizType) continue; // already tried
          try {
            const response = await $fetch(`${strapiUrl}/api/questions`, {
              params: addPopulate({
                'filters[topics][id][$eq]': topicId,
                'filters[quizType][$eq]': variant
              }),
              timeout: 10000
            });
            const list = parseList(response);
            if (list.length > 0) {
              questionsData = list;
              console.log(`[Strapi] ✅ Found ${list.length} questions (topic + quizType="${variant}")`);
              break;
            }
          } catch (e) {
            // skip
          }
        }
      }

      // 5) Last resort: fetch ALL questions (no filters)
      if (questionsData.length === 0) {
        try {
          const response = await $fetch(`${strapiUrl}/api/questions`, {
            params: addPopulate({}),
            timeout: 10000
          });
          const list = parseList(response);
          if (list.length > 0) {
            questionsData = list;
            console.warn(`[Strapi] Using ALL ${list.length} questions – no topic/quizType filter matched. Link questions to topic ${topicId} in Strapi.`);
          }
        } catch (e) {
          console.warn(`[Strapi] fetch all:`, e?.message || e);
        }
      }

      if (questionsData.length === 0) {
        console.warn(`[Strapi] No questions for topic ${topicId}. Check: Question content type, topic relation name (topic/topics), and Strapi topic ID.`);
        return [];
      }

      // Strapi v4: item.attributes; v5: flat item
      const questions = questionsData.map(item => {
        const raw = item?.attributes ?? item;
        return transformQuestionFromModel(raw);
      });
      console.log(`[Strapi] ✅ Loaded ${questions.length} questions`);
      return questions;
    } catch (error) {
      console.error(`[Strapi] ❌ Error fetching questions for topic ${topicId} (${quizType}):`, error);
      if (error.statusCode === 404 || error.status === 404) {
        console.warn(`[Strapi] Questions API not found. Ensure Content Type "Question" exists and has a "quizType" field (e.g. "pre-quiz", "post-quiz").`);
      } else if (error.statusCode === 403 || error.status === 403) {
        console.warn(`[Strapi] Access forbidden. Enable 'find' for Question in Strapi permissions.`);
      }
      return null;
    }
  };

  /**
   * Fetch pre-quiz questions from the Question model (quizType = 'pre-quiz').
   * @param {string|number} topicId - The topic ID to fetch questions for
   * @returns {Promise<Array>} Array of quiz questions
   */
  const fetchQuizQuestions = async (topicId) => {
    return fetchQuestionsFromModel(topicId, 'pre-quiz');
  };

  /**
   * Fetch post-quiz (problem set) questions from the Question model (quizType = 'post-quiz').
   * @param {string|number} topicId - The topic ID to fetch questions for
   * @returns {Promise<Array>} Array of problem set questions
   */
  const fetchProblemSetQuestions = async (topicId) => {
    return fetchQuestionsFromModel(topicId, 'post-quiz');
  };

  /**
   * Fetch a single quiz question by ID
   * @param {string} questionId - The question ID
   * @returns {Promise<Object|null>} Quiz question object or null
   */
  const fetchQuizQuestionById = async (questionId) => {
    try {
      const response = await $fetch(`${strapiUrl}/api/quiz-questions/${questionId}`, {
        params: {
          'populate': '*'
        }
      });

      if (response?.data) {
        const item = response.data;
        return {
          id: item.id,
          question: item.attributes.question,
          options: item.attributes.options || [],
          correct: item.attributes.correctAnswer,
          image: item.attributes.image?.data?.attributes?.url 
            ? `${strapiUrl}${item.attributes.image.data.attributes.url}`
            : null
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching quiz question from Strapi:', error);
      return null;
    }
  };

  /**
   * DEBUG ONLY: Fetch ALL questions from Strapi (no filters). Logs full response to console.
   * Remove when done debugging.
   */
  const fetchAllQuestionsDebug = async () => {
    const url = `${strapiUrl}/api/questions`;
    console.log('[Strapi DEBUG] Fetching ALL questions (no filters):', url);
    try {
      const response = await $fetch(url, {
        params: { populate: '*' },
        timeout: 10000
      });
      const data = response?.data ?? response;
      const list = Array.isArray(data) ? data : [];
      console.log('[Strapi DEBUG] Raw response:', response);
      console.log('[Strapi DEBUG] All questions count:', list.length);
      console.log('[Strapi DEBUG] All questions (full array):', list);
      return list;
    } catch (e) {
      console.error('[Strapi DEBUG] Failed to fetch all questions:', e?.message || e, e);
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

