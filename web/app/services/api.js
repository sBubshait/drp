import { API_URL } from '../config.js';

class ApiService {
  /**
   * Generic request method that handles all HTTP requests
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {object} options - Fetch options (method, headers, body, etc.)
   * @returns {Promise<any>} - Parsed JSON response
   */
  static async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    };

    try {
      
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw new ApiError(error.message, endpoint, options);
    }
  }

  /**
   * Get article by ID or default article
   * @param {number|null} id - Article ID (null for default article)
   * @returns {Promise<object>} - Article data
   */
  static async getArticle(id = null) {
    const endpoint = id ? `/getArticle?id=${id}` : '/getArticle';
    const data = await this.request(endpoint);
    
    if (data.status !== 200) {
      throw new Error(`API error! status: ${data.status}`);
    }
    
    return data;
  }

  /**
   * Submit a vote for a poll
   * @param {number} pollId - Poll ID
   * @param {number} optionIndex - Selected option index
   * @returns {Promise<object>} - Vote response
   */
  static async submitVote(pollId, optionIndex) {
    const endpoint = `/vote?pollId=${pollId}&optionIndex=${optionIndex}`;
    return this.request(endpoint, {
      method: 'POST'
    });
  }

  /**
   * Submit a discussion response
   * @param {number} discussionId - Discussion ID
   * @param {string} content - Response content
   * @returns {Promise<object>} - Submit response
   */
  static async submitDiscussionResponse(discussionId, content) {
    return this.request('/discussions/respond', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        discussionId: discussionId.toString(),
        content: content.trim()
      })
    });
  }

  static async upvoteAnnotation(annotationId) {
    return this.request('/info/upvote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        annotationId: annotationId.toString()
      })
    });
  }

  /**
   * Get discussion responses
   * @param {number} discussionId - Discussion ID
   * @returns {Promise<object>} - Discussion responses
   */
  static async getDiscussionResponses(discussionId) {
    const endpoint = `/discussions/responses?discussionId=${discussionId}`;
    const data = await this.request(endpoint);
    
    if (data.status !== 200) {
      throw new Error(`Failed to fetch discussion responses: ${data.status}`);
    }
    
    return data;
  }

  /**
   * Get segment by ID
   * @param {number} segmentId - Segment ID
   * @returns {Promise<object>} - Segment data
   */
  static async getSegment(segmentId) {
    const endpoint = `/getSegment?segmentId=${segmentId}`;
    const data = await this.request(endpoint);
    
    if (data.status !== 200) {
      throw new Error(`Failed to fetch segment: ${data.status}`);
    }
    
    return data;
  }

  static async editDiscussionResponse(id, responseId, content) {
    return this.request('/discussions/editResponse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        responseId: responseId.toString(),
        content: content.trim()
      })
    });
  }

  /**
   * Record a swipe right action
   * @param {number} userId - User ID
   * @param {number} articleId - Article ID
   * @returns {Promise<object>} - Status response
   */
  static async swipeRight(userId, articleId) {
    const endpoint = `/metrics/swipedRight`;
    return this.request(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        userId: userId,
        articleId: articleId
      })
    });
  }

  /**
   * Record interaction with a segment
   * @param {number} userId - User ID
   * @param {number} segmentId - Segment ID
   * @returns {Promise<object>} - Status response
   */
  static async interactWithSegment(userId, segmentId) {
    const endpoint = `/metrics/interactWithSegment`;
    return this.request(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        userId: userId,
        segmentId: segmentId
      })
    });
  }
}

/**
 * Custom error class for API-related errors
 */
class ApiError extends Error {
  constructor(message, endpoint, options) {
    super(message);
    this.name = 'ApiError';
    this.endpoint = endpoint;
    this.options = options;
  }
}

export default ApiService;
export { ApiError };
