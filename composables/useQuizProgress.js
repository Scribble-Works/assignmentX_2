import { ref, readonly, onMounted } from 'vue';

// Global quiz completion state
const completedQuizzes = ref(new Set());
const contentStatus = ref(new Map());

// Quiz scores storage: { substrandId: { preQuiz: { score, correctAnswers, totalQuestions, date }, postQuiz: { ... } } }
const quizScores = ref(new Map());

// Load state from localStorage on client side
const loadStateFromStorage = () => {
  if (process.client) {
    try {
      const savedCompleted = localStorage.getItem('completedQuizzes');
      const savedStatus = localStorage.getItem('contentStatus');
      const savedScores = localStorage.getItem('quizScores');
      
      console.log('Loading from localStorage - savedCompleted:', savedCompleted);
      console.log('Loading from localStorage - savedStatus:', savedStatus);
      console.log('Loading from localStorage - savedScores:', savedScores);
      
      if (savedCompleted) {
        completedQuizzes.value = new Set(JSON.parse(savedCompleted));
        console.log('Loaded completed quizzes:', Array.from(completedQuizzes.value));
      }
      
      if (savedStatus) {
        contentStatus.value = new Map(JSON.parse(savedStatus));
        console.log('Loaded content status:', Array.from(contentStatus.value.entries()));
      }
      
      if (savedScores) {
        quizScores.value = new Map(JSON.parse(savedScores));
        console.log('Loaded quiz scores:', Array.from(quizScores.value.entries()));
      }
    } catch (error) {
      console.error('Error loading quiz progress from localStorage:', error);
    }
  }
};

// Save state to localStorage
const saveStateToStorage = () => {
  if (process.client) {
    try {
      const completedArray = Array.from(completedQuizzes.value);
      const statusArray = Array.from(contentStatus.value.entries());
      const scoresArray = Array.from(quizScores.value.entries());
      
      localStorage.setItem('completedQuizzes', JSON.stringify(completedArray));
      localStorage.setItem('contentStatus', JSON.stringify(statusArray));
      localStorage.setItem('quizScores', JSON.stringify(scoresArray));
      
      console.log('Saving to localStorage - completedQuizzes:', completedArray);
      console.log('Saving to localStorage - contentStatus:', statusArray);
      console.log('Saving to localStorage - quizScores:', scoresArray);
    } catch (error) {
      console.error('Error saving quiz progress to localStorage:', error);
    }
  }
};

export const useQuizProgress = () => {
  // Load state when composable is first used
  if (process.client && completedQuizzes.value.size === 0) {
    loadStateFromStorage();
  }

  const markQuizCompleted = (contentId) => {
    completedQuizzes.value.add(contentId);
    contentStatus.value.set(contentId, 'completed');
    saveStateToStorage();
    console.log(`Marked course ${contentId} as completed. Status:`, contentStatus.value.get(contentId));
    console.log('Current completed quizzes:', Array.from(completedQuizzes.value));
    console.log('Current content status:', Array.from(contentStatus.value.entries()));
  };

  const unmarkQuizCompleted = (contentId) => {
    completedQuizzes.value.delete(contentId);
    contentStatus.value.delete(contentId);
    saveStateToStorage();
    console.log(`Unmarked course ${contentId} as completed.`);
    console.log('Current completed quizzes:', Array.from(completedQuizzes.value));
  };

  const markQuizInProgress = (contentId) => {
    contentStatus.value.set(contentId, 'in-progress');
    saveStateToStorage();
  };

  const isQuizCompleted = (contentId) => {
    return completedQuizzes.value.has(contentId);
  };

  const getContentStatus = (contentId) => {
    // If quiz is completed, always return 'completed' regardless of contentStatus
    if (completedQuizzes.value.has(contentId)) {
      return 'completed';
    }
    return contentStatus.value.get(contentId) || 'not-started';
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return { color: 'text-green-600', bgColor: 'bg-green-100', text: 'Completed', icon: '✓' };
      case 'in-progress':
        return { color: 'text-blue-600', bgColor: 'bg-blue-100', text: 'In Progress', icon: '⟳' };
      case 'not-started':
      default:
        return { color: 'text-gray-600', bgColor: 'bg-gray-100', text: 'Not Started', icon: '○' };
    }
  };

  const getAllCompletedQuizzes = () => {
    return Array.from(completedQuizzes.value);
  };

  const getCompletedCount = () => {
    return completedQuizzes.value.size;
  };

  // Save quiz score (preQuiz or postQuiz)
  const saveQuizScore = (substrandId, quizType, scoreData) => {
    // quizType should be 'preQuiz' or 'postQuiz'
    const existingData = quizScores.value.get(substrandId) || {};
    existingData[quizType] = {
      score: scoreData.score,
      correctAnswers: scoreData.correctAnswers,
      totalQuestions: scoreData.totalQuestions,
      date: new Date().toISOString()
    };
    // Save topic name if provided
    if (scoreData.topicName) {
      existingData.topicName = scoreData.topicName;
    }
    quizScores.value.set(substrandId, existingData);
    saveStateToStorage();
    console.log(`Saved ${quizType} score for substrand ${substrandId}:`, existingData[quizType]);
  };

  // Get quiz score for a substrand
  const getQuizScore = (substrandId, quizType) => {
    const substrandScores = quizScores.value.get(substrandId);
    if (!substrandScores) return null;
    return substrandScores[quizType] || null;
  };

  // Get all quiz scores
  const getAllQuizScores = () => {
    return Array.from(quizScores.value.entries()).map(([substrandId, scores]) => ({
      substrandId,
      ...scores
    }));
  };

  // Get scores for a specific substrand
  const getSubstrandScores = (substrandId) => {
    const scores = quizScores.value.get(substrandId) || quizScores.value.get(String(substrandId));
    if (!scores) return null;
    return {
      substrandId,
      ...scores
    };
  };

  // Get aggregated scores across all substrands
  const getAggregatedScores = () => {
    const allScores = getAllQuizScores();
    
    if (allScores.length === 0) {
      return { preQuiz: null, postQuiz: null };
    }

    let preQuizTotal = 0;
    let preQuizCount = 0;
    let postQuizTotal = 0;
    let postQuizCount = 0;

    allScores.forEach(({ preQuiz, postQuiz }) => {
      if (preQuiz) {
        preQuizTotal += preQuiz.score;
        preQuizCount++;
      }
      if (postQuiz) {
        postQuizTotal += postQuiz.score;
        postQuizCount++;
      }
    });

    return {
      preQuiz: preQuizCount > 0 ? Math.round(preQuizTotal / preQuizCount) : null,
      postQuiz: postQuizCount > 0 ? Math.round(postQuizTotal / postQuizCount) : null
    };
  };

  // Get proficiency level based on score (Official JHS Mathematics Grading System)
  const getProficiencyLevel = (score) => {
    if (score === null || score === undefined) {
      return { level: 'N/A', code: 'NA', description: 'No data available' };
    }
    // Highly Proficient (HP): 80% and above
    if (score >= 80) {
      return { 
        level: 'Highly Proficient', 
        code: 'HP',
        description: 'Learner shows a high level of proficiency in knowledge, skills and values and can transfer them automatically and flexibly through authentic performance tasks.'
      };
    }
    // Proficient (P): 68-79%
    if (score >= 68) {
      return { 
        level: 'Proficient', 
        code: 'P',
        description: 'Learner demonstrates sufficient level of proficient knowledge, skills and core understanding and can transfer them independently through authentic performance tasks.'
      };
    }
    // Approaching Proficiency (AP): 54-67%
    if (score >= 54) {
      return { 
        level: 'Approaching Proficiency', 
        code: 'AP',
        description: 'Learner is approaching proficiency in terms of knowledge, skills and values with little guidance and can transfer understanding through authentic performance tasks.'
      };
    }
    // Developing (D): 40-53%
    if (score >= 40) {
      return { 
        level: 'Developing', 
        code: 'D',
        description: 'Learner demonstrates a developing level of knowledge, skills and values but needs help throughout the performance of authentic tasks.'
      };
    }
    // Emerging (E): 39% and below
    return { 
      level: 'Emerging', 
      code: 'E',
      description: 'Learner is emerging with minimal understanding in terms of knowledge, skills, and values but needs a lot of help.'
    };
  };

  return {
    completedQuizzes,
    contentStatus,
    quizScores,
    markQuizCompleted,
    unmarkQuizCompleted,
    markQuizInProgress,
    isQuizCompleted,
    getContentStatus,
    getStatusInfo,
    getAllCompletedQuizzes,
    getCompletedCount,
    saveQuizScore,
    getQuizScore,
    getAllQuizScores,
    getSubstrandScores,
    getAggregatedScores,
    getProficiencyLevel,
    loadStateFromStorage,
    saveStateToStorage
  };
}; 