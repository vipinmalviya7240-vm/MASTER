import { auth } from '../firebase/config';

const API_BASE_URL = 'http://localhost:5000/api';
const BYPASS_TOKEN = 'mock-jwt-token-xyz';

// Central API fetch helper that handles request execution and falls back gracefully
export const apiRequest = async (endpoint, options = {}) => {
  let idToken = BYPASS_TOKEN;

  try {
    const currentUser = auth?.currentUser;
    if (currentUser && typeof currentUser.getIdToken === 'function') {
      idToken = await currentUser.getIdToken(true);
    }
  } catch (err) {
    console.warn("⚠️ Failed to retrieve dynamic Firebase ID token, using fallback bypass token.");
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`,
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API response error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`⚠️ API Request to ${endpoint} failed. Triggering frontend local simulator.`, error);
    throw error;
  }
};

// Subject specific chat endpoint
export const sendAIChat = async (messages, subject) => {
  try {
    const data = await apiRequest('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ messages, subject }),
    });
    return data.response;
  } catch (err) {
    return null; // Signals component to trigger local simulation response fallback
  }
};

// Quiz AI Generator endpoint
export const generateAIQuiz = async (topic, difficulty) => {
  try {
    const data = await apiRequest('/ai/quiz', {
      method: 'POST',
      body: JSON.stringify({ topic, difficulty }),
    });
    if (data.success && data.questions) {
      return data.questions;
    }
    return null;
  } catch (err) {
    return null;
  }
};

// Save completed quiz result to database history
export const saveQuizResult = async (topic, difficulty, score, totalQuestions, answers) => {
  try {
    const data = await apiRequest('/quiz/create', {
      method: 'POST',
      body: JSON.stringify({ topic, difficulty, score, totalQuestions, answers }),
    });
    return data;
  } catch (err) {
    return null;
  }
};

// Fetch user profile metrics & streak stats
export const fetchDashboardStats = async () => {
  try {
    const data = await apiRequest('/dashboard/stats');
    return data.stats;
  } catch (err) {
    return null;
  }
};

// Fetch subject progress lists and recommendation feeds
export const fetchDashboardProgress = async () => {
  try {
    const data = await apiRequest('/dashboard/progress');
    return data;
  } catch (err) {
    return null;
  }
};
