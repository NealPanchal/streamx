// Performance optimization utilities

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Lazy load images using Intersection Observer
 * @param {string} selector - CSS selector for images
 * @param {Object} options - Intersection Observer options
 */
export const lazyLoadImages = (selector = 'img[data-src]', options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
    ...options
  };

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        
        if (src) {
          img.src = src;
          img.classList.remove('lazy');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      }
    });
  }, defaultOptions);

  const images = document.querySelectorAll(selector);
  images.forEach(img => imageObserver.observe(img));

  return imageObserver;
};

/**
 * Preload critical resources
 * @param {Array} resources - Array of resource URLs
 */
export const preloadResources = (resources) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.url;
    
    if (resource.type === 'image') {
      link.as = 'image';
    } else if (resource.type === 'script') {
      link.as = 'script';
    } else if (resource.type === 'style') {
      link.as = 'style';
    }
    
    document.head.appendChild(link);
  });
};

/**
 * Optimize images for different screen sizes
 * @param {string} baseUrl - Base image URL
 * @param {Object} sizes - Size configurations
 * @returns {Object} Optimized image URLs
 */
export const getOptimizedImageUrls = (baseUrl, sizes = {}) => {
  const defaultSizes = {
    small: 'w300',
    medium: 'w500',
    large: 'w780',
    original: 'original'
  };

  const finalSizes = { ...defaultSizes, ...sizes };
  const urls = {};

  Object.keys(finalSizes).forEach(key => {
    urls[key] = baseUrl.replace('/original/', `/${finalSizes[key]}/`);
  });

  return urls;
};

/**
 * Cache API responses in memory
 */
class APICache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key) {
    if (this.cache.has(key)) {
      // Move to end (LRU)
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }

  set(key, value, ttl = 300000) { // 5 minutes default TTL
    if (this.cache.size >= this.maxSize) {
      // Remove oldest item
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
  }

  clear() {
    this.cache.clear();
  }

  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const apiCache = new APICache();

/**
 * Measure performance metrics
 */
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const end = performance.now();
      console.log(`Performance: ${name} took ${end - start} milliseconds`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`Performance: ${name} failed after ${end - start} milliseconds`, error);
      throw error;
    }
  };
};

/**
 * Virtual scrolling for large lists
 * @param {Array} items - Items to render
 * @param {number} itemHeight - Height of each item
 * @param {number} containerHeight - Height of container
 * @param {number} scrollTop - Current scroll position
 * @returns {Object} Visible items and offsets
 */
export const getVisibleItems = (items, itemHeight, containerHeight, scrollTop) => {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    startIndex,
    endIndex,
    offsetY
  };
};

/**
 * Format file size for display
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if user is on slow connection
 * @returns {boolean} True if on slow connection
 */
export const isSlowConnection = () => {
  if (typeof navigator !== 'undefined' && navigator.connection) {
    const connection = navigator.connection;
    return (
      connection.saveData ||
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      connection.effectiveType === '3g'
    );
  }
  return false;
};

/**
 * Optimize loading based on connection speed
 * @returns {Object} Optimization settings
 */
export const getOptimizationSettings = () => {
  const slow = isSlowConnection();
  
  return {
    lazyLoad: true,
    lowQuality: slow,
    prefetch: !slow,
    animations: !slow,
    autoPlay: !slow
  };
};

export default {
  debounce,
  throttle,
  lazyLoadImages,
  preloadResources,
  getOptimizedImageUrls,
  apiCache,
  measurePerformance,
  getVisibleItems,
  formatFileSize,
  isSlowConnection,
  getOptimizationSettings
};
