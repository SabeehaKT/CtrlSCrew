// API configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export const apiClient = {
  // Helper function to make API calls
  async request(endpoint, options = {}) {
    const url = `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || 'Request failed');
    }

    return response.json();
  },

  // Auth endpoints
  async register(name, email, password) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  async login(email, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    
    return data;
  },

  async getCurrentUser() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }

    return this.request('/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async getUserProfile() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }

    return this.request('/api/users/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async updateUserProfile(profileData) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async changePassword(oldPassword, newPassword) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request('/api/users/change-password', {
      method: 'POST',
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /** Get AI-generated roadmap summary for Edit Roadmap flow (Career tab) */
  async getRoadmapSummary(milestoneData) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request('/api/career/roadmap-summary', {
      method: 'POST',
      body: JSON.stringify(milestoneData),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Course recommendations
  async getCourseRecommendations() {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request('/api/users/course-recommendations', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Admin endpoints
  async getAllUsers() {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request('/api/admin/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async createUser(userData) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async updateUser(userId, userData) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request(`/api/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async deleteUser(userId) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request(`/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async getUser(userId) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request(`/api/admin/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Payroll endpoints
  async createPayroll(payrollData) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request('/api/payroll/', {
      method: 'POST',
      body: JSON.stringify(payrollData),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async getUserPayrolls(userId) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request(`/api/payroll/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async getLatestPayroll(userId) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request(`/api/payroll/user/${userId}/latest`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async getAllPayrolls() {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request('/api/payroll/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async updatePayroll(payrollId, payrollData) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request(`/api/payroll/${payrollId}`, {
      method: 'PUT',
      body: JSON.stringify(payrollData),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async deletePayroll(payrollId) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request(`/api/payroll/${payrollId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Auth helpers
  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },
};
