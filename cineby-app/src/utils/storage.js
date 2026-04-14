// Storage utility for managing watch history and progress

const STORAGE_KEYS = {
  WATCH_HISTORY: 'cineby_watch_history',
  WATCH_PROGRESS: 'cineby_watch_progress',
  LAST_WATCHED: 'cineby_last_watched',
  USER_PREFERENCES: 'cineby_user_preferences'
};

/**
 * Get watch history from localStorage
 * @returns {Array} Array of watched items
 */
export const getWatchHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WATCH_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting watch history:', error);
    return [];
  }
};

/**
 * Add item to watch history
 * @param {Object} item - Item to add
 * @param {number} item.id - Item ID
 * @param {string} item.title - Item title
 * @param {string} item.type - 'movie' or 'tv'
 * @param {string} item.poster_path - Poster image path
 * @param {number} item.timestamp - Current timestamp
 */
export const addToWatchHistory = (item) => {
  try {
    const history = getWatchHistory();
    const existingIndex = history.findIndex(h => h.id === item.id && h.type === item.type);
    
    const watchItem = {
      id: item.id,
      title: item.title,
      type: item.type,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      season: item.season,
      episode: item.episode,
      timestamp: Date.now(),
      ...item
    };

    if (existingIndex > -1) {
      history[existingIndex] = watchItem;
    } else {
      history.unshift(watchItem);
    }

    // Keep only last 50 items
    const trimmedHistory = history.slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.WATCH_HISTORY, JSON.stringify(trimmedHistory));
    
    return trimmedHistory;
  } catch (error) {
    console.error('Error adding to watch history:', error);
    return [];
  }
};

/**
 * Get watch progress for an item
 * @param {number} id - Item ID
 * @param {string} type - 'movie' or 'tv'
 * @param {number} season - Season number (for TV)
 * @param {number} episode - Episode number (for TV)
 * @returns {Object|null} Progress data or null
 */
export const getWatchProgress = (id, type, season = null, episode = null) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WATCH_PROGRESS);
    const progress = data ? JSON.parse(data) : {};
    
    const key = type === 'movie' ? `movie_${id}` : `tv_${id}_s${season}_e${episode}`;
    return progress[key] || null;
  } catch (error) {
    console.error('Error getting watch progress:', error);
    return null;
  }
};

/**
 * Save watch progress
 * @param {number} id - Item ID
 * @param {string} type - 'movie' or 'tv'
 * @param {number} currentTime - Current playback time in seconds
 * @param {number} duration - Total duration in seconds
 * @param {number} season - Season number (for TV)
 * @param {number} episode - Episode number (for TV)
 */
export const saveWatchProgress = (id, type, currentTime, duration, season = null, episode = null) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WATCH_PROGRESS);
    const progress = data ? JSON.parse(data) : {};
    
    const key = type === 'movie' ? `movie_${id}` : `tv_${id}_s${season}_e${episode}`;
    const percentage = (currentTime / duration) * 100;
    
    progress[key] = {
      id,
      type,
      currentTime,
      duration,
      percentage: Math.min(percentage, 99), // Cap at 99% to mark as completed
      season,
      episode,
      lastUpdated: Date.now()
    };

    localStorage.setItem(STORAGE_KEYS.WATCH_PROGRESS, JSON.stringify(progress));
    return progress[key];
  } catch (error) {
    console.error('Error saving watch progress:', error);
    return null;
  }
};

/**
 * Get continue watching items
 * @param {number} limit - Maximum number of items to return
 * @returns {Array} Array of items with progress
 */
export const getContinueWatching = (limit = 10) => {
  try {
    const history = getWatchHistory();
    const data = localStorage.getItem(STORAGE_KEYS.WATCH_PROGRESS);
    const progress = data ? JSON.parse(data) : {};
    
    const itemsWithProgress = history.map(item => {
      const key = item.type === 'movie' 
        ? `movie_${item.id}` 
        : `tv_${item.id}_s${item.season}_e${item.episode}`;
      
      const progressData = progress[key];
      
      if (progressData && progressData.percentage > 5 && progressData.percentage < 95) {
        return {
          ...item,
          progress: progressData
        };
      }
      
      return null;
    }).filter(Boolean);

    // Sort by last updated time
    itemsWithProgress.sort((a, b) => b.progress.lastUpdated - a.progress.lastUpdated);
    
    return itemsWithProgress.slice(0, limit);
  } catch (error) {
    console.error('Error getting continue watching:', error);
    return [];
  }
};

/**
 * Clear watch history
 */
export const clearWatchHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.WATCH_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.WATCH_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.LAST_WATCHED);
  } catch (error) {
    console.error('Error clearing watch history:', error);
  }
};

/**
 * Get user preferences
 * @returns {Object} User preferences
 */
export const getUserPreferences = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return data ? JSON.parse(data) : {
      autoplay: true,
      quality: 'auto',
      subtitles: false
    };
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return {
      autoplay: true,
      quality: 'auto',
      subtitles: false
    };
  }
};

/**
 * Save user preferences
 * @param {Object} preferences - User preferences
 */
export const saveUserPreferences = (preferences) => {
  try {
    const currentPrefs = getUserPreferences();
    const updatedPrefs = { ...currentPrefs, ...preferences };
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updatedPrefs));
    return updatedPrefs;
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return null;
  }
};

export default {
  getWatchHistory,
  addToWatchHistory,
  getWatchProgress,
  saveWatchProgress,
  getContinueWatching,
  clearWatchHistory,
  getUserPreferences,
  saveUserPreferences
};
