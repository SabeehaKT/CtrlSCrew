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
      const error = await response.json().catch(() => ({}));
      const message = error?.detail ?? error?.error ?? error?.message ?? `Request failed (${response.status})`;
      throw new Error(typeof message === 'string' ? message : 'Request failed');
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

  // Course recommendations (returns fallback when endpoint is missing so Learning page still loads)
  async getCourseRecommendations() {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    try {
      return await this.request('/api/users/course-recommendations', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (err) {
      if (err.message === 'Not Found' || (err.message && err.message.includes('404'))) {
        return {
          success: false,
          error: 'Recommendations unavailable. Restart the backend server (python main.py) to enable course recommendations.',
          recommendations: [],
          total_courses_analyzed: 0,
        };
      }
      throw err;
    }
  },

  // Story-based wellbeing endpoints
  async getWellbeingStory() {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request('/api/wellness/story', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async submitWellbeingResponse(answers) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request('/api/wellness/submit', {
      method: 'POST',
      body: JSON.stringify({ answers }),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Wellness AI endpoints
  async getWellnessInsights() {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request('/api/wellness/wellness-insights', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async logActivity(activityType) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request(`/api/wellness/log-activity?activity_type=${activityType}`, {
      method: 'POST',
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

  async calculateLOP(userId, month, year) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request(`/api/payroll/calculate-lop/${userId}/${month}/${year}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Leave endpoints
  async getMyLeaveBalance() {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request('/api/leave/balance', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async initializeLeaveBalances() {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request('/api/leave/balance/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async getAllLeaveBalances() {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request('/api/leave/balance/all', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Leave Request endpoints
  async applyLeave(leaveData) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request('/api/leave-requests/', {
      method: 'POST',
      body: JSON.stringify(leaveData),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async getMyLeaveRequests() {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request('/api/leave-requests/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async getAllLeaveRequests() {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request('/api/leave-requests/all', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async updateLeaveRequest(requestId, updateData) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request(`/api/leave-requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Attendance endpoints
  async markBulkAttendance(date, status) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request(`/api/attendance/bulk?date=${date}&status=${status}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async updateAttendance(attendanceId, status, leaveType = null) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    const params = new URLSearchParams({ status });
    if (leaveType) {
      params.append('leave_type', leaveType);
    }
    return this.request(`/api/attendance/${attendanceId}?${params.toString()}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async getAttendanceByDate(date) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return this.request(`/api/attendance/date/${date}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async getMyAttendance(startDate = null, endDate = null) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/attendance/my-attendance${query}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async getUserAttendance(userId, startDate = null, endDate = null) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/attendance/user/${userId}${query}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async getMyAttendanceSummary(month = null, year = null) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/attendance/summary/my${query}`, {
      method: 'GET',
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
