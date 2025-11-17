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
      
      // Fetch questions filtered by topic ID (using topics relation)
      try {
        console.log(`[Strapi] 📡 Fetching questions for topic ID: ${topicId}`);
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
          console.log(`[Strapi] ✅ Found ${questionsData.length} questions for topic ID: ${topicId}`);
        } else {
          console.log(`[Strapi] ⚠️ No questions found for topic ID: ${topicId}, trying fallback (all questions)`);
          // Fallback - fetch all questions if no filtered results
          const allQuestionsResponse = await $fetch(`${strapiUrl}/api/questions`, {
            params: {
              'populate': '*'
            },
            timeout: 10000
          });
          
          if (allQuestionsResponse?.data && Array.isArray(allQuestionsResponse.data)) {
            questionsData = allQuestionsResponse.data;
            console.log(`[Strapi] ⚠️ Using all ${questionsData.length} questions as fallback`);
          }
        }
      } catch (questionsError) {
        console.warn(`[Strapi] ⚠️ Questions endpoint failed:`, questionsError);
        // Try fallback to all questions
        try {
          const allQuestionsResponse = await $fetch(`${strapiUrl}/api/questions`, {
            params: {
              'populate': '*'
            },
            timeout: 10000
          });
          
          if (allQuestionsResponse?.data && Array.isArray(allQuestionsResponse.data)) {
            questionsData = allQuestionsResponse.data;
            console.log(`[Strapi] ⚠️ Using all ${questionsData.length} questions as fallback after error`);
          }
        } catch (fallbackError) {
          console.error(`[Strapi] ❌ Fallback also failed:`, fallbackError);
        }
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
    fetchQuizQuestionById
  };
};

