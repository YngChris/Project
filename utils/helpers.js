const crypto = require('crypto');

/**
 * Generate a random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate a random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Format date to readable string
 * @param {Date} date - Date to format
 * @param {string} format - Format string
 * @returns {string} Formatted date
 */
const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * Calculate time difference between two dates
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {Object} Time difference object
 */
const getTimeDifference = (date1, date2 = new Date()) => {
  const diff = Math.abs(date2 - date1);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

/**
 * Check if a string is a valid email
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if a string is a valid phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone number
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

/**
 * Sanitize HTML content
 * @param {string} content - Content to sanitize
 * @returns {string} Sanitized content
 */
const sanitizeHtml = (content) => {
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add if truncated
 * @returns {string} Truncated text
 */
const truncateText = (text, length = 100, suffix = '...') => {
  if (text.length <= length) return text;
  return text.substring(0, length) + suffix;
};

/**
 * Convert string to title case
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

/**
 * Generate pagination object
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {Object} Pagination object
 */
const generatePagination = (page = 1, limit = 10, total = 0) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
  };
};

/**
 * Calculate medication adherence percentage
 * @param {Array} reports - Array of medication reports
 * @returns {number} Adherence percentage
 */
const calculateAdherence = (reports) => {
  if (!reports || reports.length === 0) return 0;
  
  const takenCount = reports.filter(report => report.taken).length;
  return Math.round((takenCount / reports.length) * 100);
};

/**
 * Get medication status based on reports
 * @param {Array} reports - Array of medication reports
 * @returns {string} Status string
 */
const getMedicationStatus = (reports) => {
  if (!reports || reports.length === 0) return 'no-data';
  
  const adherence = calculateAdherence(reports);
  
  if (adherence >= 90) return 'excellent';
  if (adherence >= 80) return 'good';
  if (adherence >= 70) return 'fair';
  if (adherence >= 60) return 'poor';
  return 'very-poor';
};

/**
 * Generate mock data for testing
 * @param {string} type - Type of mock data
 * @param {number} count - Number of items to generate
 * @returns {Array} Array of mock data
 */
const generateMockData = (type, count = 1) => {
  const mockData = [];
  
  for (let i = 0; i < count; i++) {
    switch (type) {
      case 'medication':
        mockData.push({
          id: `med_${i + 1}`,
          name: `Medication ${i + 1}`,
          dosage: `${generateRandomNumber(1, 10)}mg`,
          frequency: 'Once daily',
          instructions: 'Take with food',
          isActive: true,
          createdAt: new Date(),
        });
        break;
        
      case 'alert':
        mockData.push({
          id: `alert_${i + 1}`,
          medicationId: `med_${i + 1}`,
          time: `${String(generateRandomNumber(6, 22)).padStart(2, '0')}:${String(generateRandomNumber(0, 59)).padStart(2, '0')}`,
          frequency: 'daily',
          isActive: true,
          message: 'Time to take your medication!',
          createdAt: new Date(),
        });
        break;
        
      case 'report':
        mockData.push({
          id: `report_${i + 1}`,
          medicationId: `med_${i + 1}`,
          date: new Date(),
          taken: Math.random() > 0.2, // 80% chance of being taken
          notes: Math.random() > 0.7 ? 'Feeling good today' : null,
          createdAt: new Date(),
        });
        break;
        
      case 'discussion':
        mockData.push({
          id: `discussion_${i + 1}`,
          title: `Discussion ${i + 1}`,
          content: `This is the content of discussion ${i + 1}`,
          category: ['general', 'medication', 'support'][generateRandomNumber(0, 2)],
          replyCount: generateRandomNumber(0, 10),
          likeCount: generateRandomNumber(0, 20),
          createdAt: new Date(),
        });
        break;
        
      case 'location':
        mockData.push({
          id: `location_${i + 1}`,
          name: `Pharmacy ${i + 1}`,
          type: 'pharmacy',
          address: {
            street: `${generateRandomNumber(100, 9999)} Main St`,
            city: 'Anytown',
            state: 'CA',
            zipCode: `${generateRandomNumber(10000, 99999)}`,
            country: 'United States',
          },
          phone: `555-${String(generateRandomNumber(100, 999)).padStart(3, '0')}-${String(generateRandomNumber(1000, 9999)).padStart(4, '0')}`,
          rating: generateRandomNumber(1, 5),
          isFavorite: Math.random() > 0.7,
          createdAt: new Date(),
        });
        break;
        
      default:
        mockData.push({ id: i + 1, createdAt: new Date() });
    }
  }
  
  return mockData;
};

module.exports = {
  generateRandomString,
  generateRandomNumber,
  formatDate,
  getTimeDifference,
  isValidEmail,
  isValidPhone,
  sanitizeHtml,
  truncateText,
  toTitleCase,
  generatePagination,
  calculateAdherence,
  getMedicationStatus,
  generateMockData,
}; 