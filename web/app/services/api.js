import { API_URL } from '../config.js';
import { getUserId } from './userApi.js';

class ApiService {
  // Set API base URL
  static API_BASE = API_URL;

  /**
   * Get headers for API requests
   * @returns {object} - Headers object
   */
  static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  /**
   * Base request method for all API calls
   * @param {string} endpoint - API endpoint
   * @param {object} options - Fetch options
   * @returns {Promise<object>} - Parsed JSON response
   */
  static async request(endpoint, options = {}) {
    const url = `${this.API_BASE}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...(options.headers || {})
        }
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API error for ${endpoint}:`, error);
      throw new ApiError(`Request failed: ${error.message}`, endpoint, options);
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
   * Increment user XP
   * @param {number} amount - Amount of XP to increment
   * @returns {Promise<object>} - Increment response
   */
  static async incrementXp(amount) {
    const userId = await getUserId();
    if (!userId) {
      console.error('User ID not found. Cannot increment XP.');
      return;
    }

    const endpoint = `/users/addXP?userId=${userId}&amount=${amount}`;
    const response = await this.request(endpoint, {
      method: 'POST'
    });
    
    // If successful, update localStorage immediately
    if (response && response.status === 200) {
      // Get current XP from localStorage
      const currentXp = parseInt(localStorage.getItem('userXp') || '0', 10);
      // Update with new amount
      const newXp = currentXp + amount;
      localStorage.setItem('userXp', newXp.toString());
      
      // Dispatch a custom event to notify listeners about XP change
      window.dispatchEvent(new CustomEvent('xpUpdated', { detail: { xp: newXp } }));
    }
    
    return response;
  }

  /**
   * Get user XP
   * @returns {Promise<object>} - User XP data   
   */
  static async getUserXp() {
    const userId = await getUserId();
    if (!userId) {
      console.error('User ID not found. Cannot fetch XP.');
      return;
    }

    const endpoint = `/users/get?id=${userId}`;
    return this.request(endpoint);
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

  static async getUserData(userId) {
    return this.request(`/users/get?id=${userId}`);
  }

  static async getUserStreakCond(userId) {
    return this.request(`/users/streakCond?id=${userId}`);
  }

  static async userCompleteStreak(userId) {
    return this.request(`/users/completeStreak?id=${userId}`, {method: `POST`});
  }

  static async getUserInteractedSegments(userId, articleId) {
    return this.request(`/metrics/getUserSegments?userId=${userId}&articleId=${articleId}`);
  }
  /**
 * Get sources for a segment
 * @param {number} segmentId - Segment ID
 * @returns {Promise<object>} - Sources data
 */
static async getSources(segmentId) {
  const endpoint = `/getSources?segmentId=${segmentId}`;
  const data = await this.request(endpoint);
  
  if (data.status !== 200) {
    throw new Error(`Failed to fetch sources: ${data.status}`);
  }
  
  return data;
}

/**
 * Get friends and pending friend requests for a user
 * @param {number} userId - User ID
 * @returns {Promise<object>} - Friends response containing both accepted friends and pending requests
 */
static async getFriends(userId) {
  const endpoint = `/users/getFriends?userId=${userId}`;
  const data = await this.request(endpoint);
  
  if (data.status !== 200) {
    throw new ApiError(data.message || "Failed to fetch friends", endpoint, { userId });
  }
  
  return data;
}

/**
 * Get all users
 * @returns {Promise<object>} - Response containing all users
 */
static async getAllUsers() {
  const endpoint = '/users/all';
  const data = await this.request(endpoint);
  
  if (data.status !== 200) {
    throw new Error(`Failed to fetch users: ${data.status} - ${data.message}`);
  }
  
  return data;
}

/**
 * Respond to a friend request (accept or ignore)
 * @param {number} userId - ID of the user responding to the request
 * @param {number} requesterId - ID of the user who sent the request
 * @param {string} action - Action to take: 'accept' or 'ignore'
 * @returns {Promise<object>} - Status response
 */
static async respondToFriend(userId, requesterId, action) {
  const endpoint = `/users/respondToFriend?userId=${userId}&requesterId=${requesterId}&action=${action}`;
  const data = await this.request(endpoint, {
    method: 'POST'
  });
  
  if (data.status !== 200) {
    throw new ApiError(data.message || "Failed to respond to friend request", endpoint, 
      { userId, requesterId, action });
  }
  
  return data;
}

/**
 * Send a friend request
 * @param {number} userId - ID of the user sending the request
 * @param {string} friendTag - Tag of the user to add as friend
 * @returns {Promise<object>} - Status response
 */
static async addFriend(userId, friendTag) {
  const endpoint = `/users/addFriend?userId=${userId}&friendTag=${friendTag}`;
  const data = await this.request(endpoint, {
    method: 'POST'
  });
  
  if (data.status !== 200) {
    throw new ApiError(data.message || "Failed to send friend request", endpoint, 
      { userId, friendTag });
  }
  
  return data;
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
