import { ref, readonly, onMounted } from 'vue';

// Global quiz completion state
const completedQuizzes = ref(new Set());
const contentStatus = ref(new Map());

// Load state from localStorage on client side
const loadStateFromStorage = () => {
  if (process.client) {
    try {
      const savedCompleted = localStorage.getItem('completedQuizzes');
      const savedStatus = localStorage.getItem('contentStatus');
      
      console.log('Loading from localStorage - savedCompleted:', savedCompleted);
      console.log('Loading from localStorage - savedStatus:', savedStatus);
      
      if (savedCompleted) {
        completedQuizzes.value = new Set(JSON.parse(savedCompleted));
        console.log('Loaded completed quizzes:', Array.from(completedQuizzes.value));
      }
      
      if (savedStatus) {
        contentStatus.value = new Map(JSON.parse(savedStatus));
        console.log('Loaded content status:', Array.from(contentStatus.value.entries()));
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
      
      localStorage.setItem('completedQuizzes', JSON.stringify(completedArray));
      localStorage.setItem('contentStatus', JSON.stringify(statusArray));
      
      console.log('Saving to localStorage - completedQuizzes:', completedArray);
      console.log('Saving to localStorage - contentStatus:', statusArray);
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

  return {
    completedQuizzes,
    contentStatus,
    markQuizCompleted,
    unmarkQuizCompleted,
    markQuizInProgress,
    isQuizCompleted,
    getContentStatus,
    getStatusInfo,
    getAllCompletedQuizzes,
    getCompletedCount,
    loadStateFromStorage,
    saveStateToStorage
  };
}; 