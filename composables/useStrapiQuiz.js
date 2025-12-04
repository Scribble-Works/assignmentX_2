export const useStrapiQuiz = () => {
  const config = useRuntimeConfig();
  const strapiUrl = config.public.STRAPI_URL || 'http://localhost:1337';

  /**
   * Fetch quiz questions from Strapi by topic ID
   * @param {string|number} topicId - The topic ID to fetch questions for (filters by topics relation)
   * @returns {Promise<Array>} Array of quiz questions
   */
  const fetchQuizQuestions = async (topicId) => {
    if (!topicId) {
      console.warn('useStrapiQuiz: topicId is required');
      return null;
    }

    try {
      console.log(`[Strapi] ⚡ Fetching quiz questions for topic ID: ${topicId}`);
      console.log(`[Strapi] 🔗 Strapi URL: ${strapiUrl}`);
      
      let questionsData = [];
      
      // Filter questions by topics relation
      try {
        console.log(`[Strapi] 📡 Filtering questions by topics relation ID = ${topicId}`);
        const questionsResponse = await $fetch(`${strapiUrl}/api/questions`, {
          params: {
            'filters[topics][id][$eq]': topicId,
            'populate': '*'
          },
          timeout: 10000
        });
        
        console.log(`[Strapi] 📦 Questions API response:`, questionsResponse);
        
        if (questionsResponse?.data && Array.isArray(questionsResponse.data) && questionsResponse.data.length > 0) {
          questionsData = questionsResponse.data;
          console.log(`[Strapi] ✅ Found ${questionsData.length} questions for topic ID ${topicId}`);
        } else {
          console.log(`[Strapi] ⚠️ No questions found for topic ID ${topicId}`);
          // Return empty array - don't fallback to all questions
          questionsData = [];
        }
      } catch (fetchError) {
        console.error(`[Strapi] ❌ Failed to fetch questions:`, fetchError?.message || fetchError);
        questionsData = [];
      }

      if (!questionsData || questionsData.length === 0) {
        console.warn(`[Strapi] ❌ No questions found for topic ID: ${topicId}`);
        return [];
      }

      console.log(`[Strapi] ✅ Processing ${questionsData.length} questions from Strapi`);

      // Transform Strapi questions to match expected format
      const questions = questionsData.map(item => {
        // Strapi v5 uses flat structure, no .attributes
        const questionData = item;
        
        // Build options array from option1, option2, option3, option4
        const options = [
          questionData.option1,
          questionData.option2,
          questionData.option3,
          questionData.option4
        ].filter(opt => opt !== null && opt !== undefined && opt !== ''); // Remove any empty options
        
        // Convert correctOption enum ('one', 'two', 'three', 'four') to index (0, 1, 2, 3)
        const correctOptionMap = {
          'one': 0,
          'two': 1,
          'three': 2,
          'four': 3
        };
        const correctIndex = correctOptionMap[questionData.correctOption] ?? 0;
        
        const transformed = {
          question: questionData.prompt || questionData.question || '',
          options: options,
          correct: correctIndex,
          explanation: questionData.explanation || null
        };

        console.log(`[Strapi] Transformed question:`, transformed);
        return transformed;
      });

      console.log(`[Strapi] ✅ Successfully loaded ${questions.length} questions from Strapi`);
      return questions;
    } catch (error) {
      console.error(`[Strapi] ❌ Error fetching quiz questions for topic ID ${topicId}:`, error);
      console.error(`[Strapi] Error details:`, {
        message: error.message,
        status: error.statusCode || error.status,
        data: error.data
      });
      
      if (error.statusCode === 404 || error.status === 404) {
        console.warn(`[Strapi] Questions endpoint not found. Make sure the Content Type 'Question' or 'PreQuiz' exists in Strapi.`);
      } else if (error.statusCode === 403 || error.status === 403) {
        console.warn(`[Strapi] Access forbidden. Check API permissions in Strapi Settings > Users & Permissions Plugin > Roles > Public > Enable 'find' and 'findOne' for Question and PreQuiz`);
      }
      return null; // Return null to indicate error, so we can fallback
    }
  };

  /**
   * Fetch problem set questions from Strapi by topic ID
   * Uses a different content type (e.g., 'problem-set-questions' or 'post-quiz-questions')
   * @param {string|number} topicId - The topic ID to fetch questions for (filters by topics relation)
   * @returns {Promise<Array>} Array of problem set questions
   */
  const fetchProblemSetQuestions = async (topicId) => {
    if (!topicId) {
      console.warn('useStrapiQuiz: topicId is required for problem set questions');
      return null;
    }

    try {
      console.log(`[Strapi] ⚡ Fetching problem set questions for topic ID: ${topicId}`);
      console.log(`[Strapi] 🔗 Strapi URL: ${strapiUrl}`);
      
      let questionsData = [];
      
      // Filter problem set questions by topics relation
      try {
        console.log(`[Strapi] 📡 Filtering problem set questions by topics relation ID = ${topicId}`);
        const questionsResponse = await $fetch(`${strapiUrl}/api/problem-set-questions`, {
          params: {
            'filters[topics][id][$eq]': topicId,
            'populate': '*'
          },
          timeout: 10000
        });
        
        console.log(`[Strapi] 📦 Problem Set Questions API response:`, questionsResponse);
        
        if (questionsResponse?.data && Array.isArray(questionsResponse.data) && questionsResponse.data.length > 0) {
          questionsData = questionsResponse.data;
          console.log(`[Strapi] ✅ Found ${questionsData.length} problem set questions for topic ID ${topicId}`);
        } else {
          console.log(`[Strapi] ⚠️ No problem set questions found for topic ID ${topicId}`);
          // Return empty array - don't fallback to all questions
          questionsData = [];
        }
      } catch (fetchError) {
        console.error(`[Strapi] ❌ Failed to fetch problem set questions:`, fetchError?.message || fetchError);
        questionsData = [];
      }

      if (!questionsData || questionsData.length === 0) {
        console.warn(`[Strapi] ❌ No problem set questions found for topic ID: ${topicId}`);
        return [];
      }

      console.log(`[Strapi] ✅ Processing ${questionsData.length} problem set questions from Strapi`);

      // Transform Strapi problem set questions to match expected format
      const questions = questionsData.map(item => {
        // Strapi v5 uses flat structure, no .attributes
        const questionData = item;
        
        // Build options array from option1, option2, option3, option4
        const options = [
          questionData.option1,
          questionData.option2,
          questionData.option3,
          questionData.option4
        ].filter(opt => opt !== null && opt !== undefined && opt !== ''); // Remove any empty options
        
        // Convert correctOption enum ('one', 'two', 'three', 'four') to index (0, 1, 2, 3)
        const correctOptionMap = {
          'one': 0,
          'two': 1,
          'three': 2,
          'four': 3
        };
        const correctIndex = correctOptionMap[questionData.correctOption] ?? 0;
        
        // Get questionType from Strapi (MCQ, True/False, Fill in the blank, Multiple blanks)
        const questionType = questionData.questionType || 'MCQ';
        
        const transformed = {
          question: questionData.prompt || questionData.question || '',
          options: options,
          correct: correctIndex,
          questionType: questionType,
          correctAnswer: questionData.correctAnswer || null, // For fill-in-the-blank and multiple blanks
          explanation: questionData.explanation || null
        };

        console.log(`[Strapi] Transformed problem set question:`, transformed);
        return transformed;
      });

      console.log(`[Strapi] ✅ Successfully loaded ${questions.length} problem set questions from Strapi`);
      return questions;
    } catch (error) {
      console.error(`[Strapi] ❌ Error fetching problem set questions for topic ID ${topicId}:`, error);
      console.error(`[Strapi] Error details:`, {
        message: error.message,
        status: error.statusCode || error.status,
        data: error.data
      });
      
      if (error.statusCode === 404 || error.status === 404) {
        console.warn(`[Strapi] Problem set questions endpoint not found. Make sure the Content Type 'ProblemSetQuestion' or 'PostQuizQuestion' exists in Strapi.`);
      } else if (error.statusCode === 403 || error.status === 403) {
        console.warn(`[Strapi] Access forbidden. Check API permissions in Strapi Settings > Users & Permissions Plugin > Roles > Public > Enable 'find' and 'findOne' for ProblemSetQuestion`);
      }
      return null; // Return null to indicate error, so we can fallback
    }
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

  return {
    fetchQuizQuestions,
    fetchProblemSetQuestions,
    fetchQuizQuestionById
  };
};

