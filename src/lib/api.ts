// Enhanced API client utilities for frontend
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api' 
  : 'http://localhost:9002/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Get token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      ...options.headers,
    };

    // Only add Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth methods
  async register(data: {
    email: string;
    password: string;
    userType: 'student' | 'company';
    fullName?: string;
    companyName?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profile: any) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ profile }),
    });
  }

  // Jobs methods
  async getJobs(params?: {
    page?: number;
    limit?: number;
    type?: string;
    location?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString());
      });
    }
    
    const query = searchParams.toString();
    return this.request(`/jobs${query ? `?${query}` : ''}`);
  }

  async getJob(id: string) {
    return this.request(`/jobs/${id}`);
  }

  async createJob(data: any) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateJob(id: string, data: any) {
    return this.request(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJob(id: string) {
    return this.request(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async applyToJob(id: string, data: { coverLetter?: string; resumeUrl?: string }) {
    return this.request(`/jobs/${id}/apply`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async likeJob(id: string) {
    return this.request(`/jobs/${id}/like`, {
      method: 'POST',
    });
  }

  // Applications methods
  async getApplications(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/applications${query}`);
  }

  async getApplication(id: string) {
    return this.request(`/applications/${id}`);
  }

  async updateApplication(id: string, data: { status: string; notes?: string }) {
    return this.request(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Resume methods
  async uploadResume(file: File) {
    const formData = new FormData();
    formData.append('resume', file);

    return this.request('/upload/resume', {
      method: 'POST',
      body: formData,
    });
  }

  async getResumes() {
    return this.request('/upload/resume');
  }

  // Discussion methods
  async getDiscussions(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    tag?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString());
      });
    }
    
    const query = searchParams.toString();
    return this.request(`/discussions${query ? `?${query}` : ''}`);
  }

  async getDiscussion(id: string) {
    return this.request(`/discussions/${id}`);
  }

  async createDiscussion(data: {
    title: string;
    content: string;
    category?: string;
    tags?: string[];
  }) {
    return this.request('/discussions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDiscussion(id: string, data: {
    title?: string;
    content?: string;
    tags?: string[];
  }) {
    return this.request(`/discussions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDiscussion(id: string) {
    return this.request(`/discussions/${id}`, {
      method: 'DELETE',
    });
  }

  async replyToDiscussion(id: string, content: string) {
    return this.request(`/discussions/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async likeDiscussion(id: string) {
    return this.request(`/discussions/${id}/like`, {
      method: 'POST',
    });
  }

  // Company updates methods
  async getCompanyUpdates(companyId?: string, page?: number) {
    const params = new URLSearchParams();
    if (companyId) params.append('companyId', companyId);
    if (page) params.append('page', page.toString());
    
    const query = params.toString();
    return this.request(`/company-updates${query ? `?${query}` : ''}`);
  }

  async createCompanyUpdate(data: { title: string; content?: string; image?: string }) {
    return this.request('/company-updates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Search methods
  async search(query: string, type?: string, page?: number) {
    const params = new URLSearchParams({ q: query });
    if (type) params.append('type', type);
    if (page) params.append('page', page.toString());
    
    return this.request(`/search?${params.toString()}`);
  }

  // Stats methods
  async getStats() {
    return this.request('/stats');
  }
}

export const apiClient = new ApiClient();