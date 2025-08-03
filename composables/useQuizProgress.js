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
      
      if (savedCompleted) {
        completedQuizzes.value = new Set(JSON.parse(savedCompleted));
      }
      
      if (savedStatus) {
        contentStatus.value = new Map(JSON.parse(savedStatus));
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
    loadStateFromStorage,
    saveStateToStorage
  };
}; 