import { ref, readonly, onMounted } from 'vue';

// Global quiz completion state
const completedQuizzes = ref(new Set());
const contentStatus = ref(new Map());
// Tracks which substrands have already shown their one-time pre-quiz, keyed
// by a caller-supplied substrand key (e.g. `${moduleSlug}-substrand-${substrandId}`).
const seenSubstrandQuizzes = ref(new Set());
// Quiz results keyed by `${key}::${quizType}`, e.g.
// `assignment_workbook1-substrand-3::pre-quiz` -> { score, correctAnswers, totalQuestions, savedAt }.
const quizScores = ref(new Map());

// Load state from localStorage on client side
const loadStateFromStorage = () => {
  if (process.client) {
    try {
      const savedCompleted = localStorage.getItem('completedQuizzes');
      const savedStatus = localStorage.getItem('contentStatus');
      const savedSeenSubstrandQuizzes = localStorage.getItem('seenSubstrandQuizzes');
      const savedScores = localStorage.getItem('quizScores');

      if (savedCompleted) {
        completedQuizzes.value = new Set(JSON.parse(savedCompleted));
      }

      if (savedStatus) {
        contentStatus.value = new Map(JSON.parse(savedStatus));
      }

      if (savedSeenSubstrandQuizzes) {
        seenSubstrandQuizzes.value = new Set(JSON.parse(savedSeenSubstrandQuizzes));
      }

      if (savedScores) {
        quizScores.value = new Map(JSON.parse(savedScores));
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
      localStorage.setItem('completedQuizzes', JSON.stringify(Array.from(completedQuizzes.value)));
      localStorage.setItem('contentStatus', JSON.stringify(Array.from(contentStatus.value.entries())));
      localStorage.setItem('seenSubstrandQuizzes', JSON.stringify(Array.from(seenSubstrandQuizzes.value)));
      localStorage.setItem('quizScores', JSON.stringify(Array.from(quizScores.value.entries())));
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
  };

  const markQuizInProgress = (contentId) => {
    contentStatus.value.set(contentId, 'in-progress');
    saveStateToStorage();
  };

  const isQuizCompleted = (contentId) => {
    return completedQuizzes.value.has(contentId);
  };

  const getContentStatus = (contentId) => {
    return contentStatus.value.get(contentId) || 'not-started';
  };

  // Has the one-time pre-quiz already been shown for this substrand?
  const hasSeenSubstrandQuiz = (substrandKey) => {
    return seenSubstrandQuizzes.value.has(substrandKey);
  };

  // Mark the substrand's pre-quiz as shown so later indicator clicks in the
  // same substrand skip straight to content instead of re-showing the quiz.
  const markSubstrandQuizSeen = (substrandKey) => {
    seenSubstrandQuizzes.value.add(substrandKey);
    saveStateToStorage();
  };

  // Persist a quiz result (score/correctAnswers/totalQuestions) for a given
  // substrand-level key and quiz type ('pre-quiz' | 'post-quiz'), so the
  // progress report can compare the two later.
  const saveQuizScore = (key, quizType, data) => {
    quizScores.value.set(`${key}::${quizType}`, { ...data, savedAt: Date.now() });
    saveStateToStorage();
  };

  // Look up a previously saved quiz result, or null if that quiz hasn't been
  // taken yet.
  const getQuizScore = (key, quizType) => {
    return quizScores.value.get(`${key}::${quizType}`) || null;
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

  return {
    completedQuizzes,
    contentStatus,
    markQuizCompleted,
    markQuizInProgress,
    isQuizCompleted,
    getContentStatus,
    getStatusInfo,
    getAllCompletedQuizzes,
    getCompletedCount,
    hasSeenSubstrandQuiz,
    markSubstrandQuizSeen,
    saveQuizScore,
    getQuizScore,
    loadStateFromStorage,
    saveStateToStorage
  };
}; 