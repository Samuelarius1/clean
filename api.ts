// src/API/api.ts

const BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL 
  : "http://localhost/cleanPro/API/";

export const BASE_API_URL = BASE_URL;

export const API_ENDPOINTS = {
  auth: {
    login: `${BASE_URL}auth/login.php`,
    logout: `${BASE_URL}auth/logout.php`,
    me: `${BASE_URL}auth/me.php`,
    register: `${BASE_URL}auth/register.php`,
    forgotPassword: `${BASE_URL}auth/forgot-password.php`,
    resetPassword: `${BASE_URL}auth/reset-password.php`,
  },
  dashboard: {
    getStats: `${BASE_URL}dashboard/stats.php`,
    getRecentBookings: `${BASE_URL}dashboard/recent-bookings.php`,
    getRevenueChart: `${BASE_URL}dashboard/revenue-chart.php`,
  },
  bookings: {
    getAll: `${BASE_URL}bookings/get-bookings.php`,
    getById: `${BASE_URL}bookings/get-booking.php`,
    create: `${BASE_URL}bookings/create-booking.php`,
    update: `${BASE_URL}bookings/update-booking.php`,
    delete: `${BASE_URL}bookings/delete-booking.php`,
    cancel: `${BASE_URL}bookings/cancel-booking.php`,
    updateStatus: `${BASE_URL}bookings/update-status.php`,
  },
  clients: {
    getAll: `${BASE_URL}clients/get-clients.php`,
    getById: `${BASE_URL}clients/get-client.php`,
    create: `${BASE_URL}clients/create-client.php`,
    update: `${BASE_URL}clients/update-client.php`,
    archive: `${BASE_URL}clients/archive-client.php`,
    restore: `${BASE_URL}clients/restore-client.php`,
    getHistory: `${BASE_URL}clients/get-history.php`,
  },
  services: {
    manage: `${BASE_URL}services/services.php`,
  },
  inventory: {
    getOverview: `${BASE_URL}inventory/overview.php`,
    getItems: `${BASE_URL}inventory/get-items.php`,
    addMovement: `${BASE_URL}inventory/add-movement.php`,
    getAlerts: `${BASE_URL}inventory/get-alerts.php`,
  },
  finance: {
    getInvoices: `${BASE_URL}finance/get-invoices.php`,
    createInvoice: `${BASE_URL}finance/create-invoice.php`,
    getExpenses: `${BASE_URL}finance/get-expenses.php`,
  },
  settings: {
    getProfile: `${BASE_URL}settings/get-profile.php`,
    updateProfile: `${BASE_URL}settings/update-profile.php`,
    getUsers: `${BASE_URL}settings/get-users.php`,
    createUser: `${BASE_URL}settings/create-user.php`,
  }
};

// ============================================================================
// RESPONSE & ERROR TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  errors?: any;
  timestamp?: string;
}

export interface ApiError extends Error {
  statusCode?: number;
  response?: any;
}

// ============================================================================
// CORE API REQUEST HANDLER
// ============================================================================

export const apiRequest = async <T = any>(
  url: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // 🔐 Token retrieval - matches App.tsx storage key
      const token = localStorage.getItem('token') || 
                    localStorage.getItem('auth_token') ||
                    document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1] ||
                    null;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
        ...options.headers,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch(url, {
        headers,
        credentials: "include",
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      // 🔐 Handle 401/403 - redirect to login
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        throw new Error(data?.message || 'Authentication required');
      }

      if (!response.ok) {
        const error: ApiError = new Error(
          data?.message || data?.error || `HTTP error! status: ${response.status}`
        );
        error.statusCode = response.status;
        error.response = data;
        throw error;
      }

      return data as ApiResponse<T>;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry client errors (4xx)
      if (lastError instanceof Error && 
          lastError.message.includes('4') && 
          !lastError.message.includes('408')) {
        break;
      }
      if (attempt === maxRetries) break;
      
      // Exponential backoff retry
      await new Promise((resolve) => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }

  throw lastError || new Error('API request failed after multiple attempts');
};

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'staff' | 'client' | 'superadmin';
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Booking {
  id: number;
  client: string;
  service: string;
  date: string;
  status: 'completed' | 'in-progress' | 'pending' | 'cancelled';
  amount: string;
  client_id?: number;
  [key: string]: any;
}

export interface BookingFilters {
  status?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at?: string;
  [key: string]: any;
}

export interface DashboardStats {
  totalBookings: number;
  activeClients: number;
  revenue: string;
  growthRate: string;
  [key: string]: any;
}

// ✅ SERVICE & PREFERENCE TYPES - Exported for component use
export interface Service {
  id: number;
  name: string;
  description?: string;
  price?: number | string;
  duration?: number;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PreferenceOption {
  id: number;
  category: 'service_day' | 'time_slot' | 'frequency' | 'client_status';
  label: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// AUTH API
// ============================================================================

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    return apiRequest<AuthResponse>(API_ENDPOINTS.auth.login, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
  logout: async (): Promise<ApiResponse> => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    return apiRequest(API_ENDPOINTS.auth.logout, { method: "POST" });
  },
  getMe: async (): Promise<ApiResponse<User>> => {
    return apiRequest<User>(API_ENDPOINTS.auth.me);
  }
};

// ============================================================================
// BOOKING API
// ============================================================================

export const bookingAPI = {
  getAll: async (params?: BookingFilters): Promise<ApiResponse<Booking[]>> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const url = `${API_ENDPOINTS.bookings.getAll}${searchParams.toString() ? `?${searchParams}` : ''}`;
    return apiRequest<Booking[]>(url);
  },
  getById: async (id: number): Promise<ApiResponse<Booking>> => {
    return apiRequest<Booking>(`${API_ENDPOINTS.bookings.getById}?id=${id}`);
  },
  create: async (data: Partial<Booking>): Promise<ApiResponse<Booking>> => {
    return apiRequest<Booking>(API_ENDPOINTS.bookings.create, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, data: Partial<Booking>): Promise<ApiResponse<Booking>> => {
    return apiRequest<Booking>(API_ENDPOINTS.bookings.update, {
      method: "POST",
      body: JSON.stringify({ id, ...data }),
    });
  },
  updateStatus: async (id: number, status: Booking['status']): Promise<ApiResponse<Booking>> => {
    return apiRequest<Booking>(API_ENDPOINTS.bookings.updateStatus, {
      method: "POST",
      body: JSON.stringify({ id, status }),
    });
  },
  delete: async (id: number): Promise<ApiResponse> => {
    return apiRequest(API_ENDPOINTS.bookings.delete, {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  },
  cancel: async (id: number, reason?: string): Promise<ApiResponse> => {
    return apiRequest(API_ENDPOINTS.bookings.cancel, {
      method: "POST",
      body: JSON.stringify({ id, reason }),
    });
  }
};

// ============================================================================
// CLIENT API
// ============================================================================

export const clientAPI = {
  getAll: async (search?: string, page?: number, limit?: number): Promise<ApiResponse<Client[]>> => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    const url = `${API_ENDPOINTS.clients.getAll}${params.toString() ? `?${params}` : ''}`;
    return apiRequest<Client[]>(url);
  },
  getById: async (id: number): Promise<ApiResponse<Client>> => {
    return apiRequest<Client>(`${API_ENDPOINTS.clients.getById}?id=${id}`);
  },
  create: async (data: Partial<Client>): Promise<ApiResponse<Client>> => {
    return apiRequest<Client>(API_ENDPOINTS.clients.create, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, data: Partial<Client>): Promise<ApiResponse<Client>> => {
    return apiRequest<Client>(API_ENDPOINTS.clients.update, {
      method: "POST",
      body: JSON.stringify({ id, ...data }),
    });
  },
  archive: async (id: number): Promise<ApiResponse> => {
    return apiRequest(API_ENDPOINTS.clients.archive, {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  },
  restore: async (id: number): Promise<ApiResponse> => {
    return apiRequest(API_ENDPOINTS.clients.restore, {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  },
  getHistory: async (clientId: number): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>(`${API_ENDPOINTS.clients.getHistory}?client_id=${clientId}`);
  }
};

// ============================================================================
// DASHBOARD API
// ============================================================================

export const dashboardAPI = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return apiRequest<DashboardStats>(API_ENDPOINTS.dashboard.getStats);
  },
  getRecentBookings: async (limit?: number): Promise<ApiResponse<Booking[]>> => {
    const url = limit 
      ? `${API_ENDPOINTS.dashboard.getRecentBookings}?limit=${limit}`
      : API_ENDPOINTS.dashboard.getRecentBookings;
    return apiRequest<Booking[]>(url);
  },
  getRevenueChart: async (period?: 'week' | 'month' | 'year'): Promise<ApiResponse<any>> => {
    const url = period 
      ? `${API_ENDPOINTS.dashboard.getRevenueChart}?period=${period}`
      : API_ENDPOINTS.dashboard.getRevenueChart;
    return apiRequest(url);
  }
};

// ============================================================================
// ✅ SERVICES API - FULL CRUD IMPLEMENTATION
// ============================================================================

export const serviceAPI = {
  /**
   * Fetch all cleaning services
   */
  getAll: async (): Promise<ApiResponse<Service[]>> => {
    return apiRequest<Service[]>(API_ENDPOINTS.services.manage);
  },

  /**
   * Create a new cleaning service
   * @param data - Service data (name required, others optional)
   */
  create: async (data: Partial<Service>): Promise<ApiResponse<{ id: number }>> => {
    if (!data.name?.trim()) {
      throw new Error('Service name is required');
    }
    return apiRequest<{ id: number }>(API_ENDPOINTS.services.manage, {
      method: "POST",
      body: JSON.stringify({
        name: data.name.trim(),
        description: data.description?.trim() || null,
        price: data.price !== undefined ? parseFloat(String(data.price)) : null,
        duration: data.duration !== undefined ? parseInt(String(data.duration)) : null,
      }),
    });
  },

  /**
   * Update an existing cleaning service
   * @param id - Service ID
   * @param data - Updated service data
   */
  update: async (id: number, data: Partial<Service>): Promise<ApiResponse> => {
    if (!data.name?.trim()) {
      throw new Error('Service name is required');
    }
    return apiRequest(`${API_ENDPOINTS.services.manage}?id=${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: data.name.trim(),
        description: data.description?.trim() || null,
        price: data.price !== undefined ? parseFloat(String(data.price)) : null,
        duration: data.duration !== undefined ? parseInt(String(data.duration)) : null,
      }),
    });
  },

  /**
   * Delete a cleaning service
   * @param id - Service ID to delete
   */
  delete: async (id: number): Promise<ApiResponse> => {
    return apiRequest(`${API_ENDPOINTS.services.manage}?id=${id}`, {
      method: "DELETE",
    });
  }
};

// ============================================================================
// ✅ PREFERENCES API - FULL CRUD IMPLEMENTATION
// ============================================================================

export const preferenceAPI = {
  /**
   * Fetch preference options by category
   * @param category - One of: 'service_day' | 'time_slot' | 'frequency' | 'client_status'
   */
  getByCategory: async (category: PreferenceOption['category']): Promise<ApiResponse<PreferenceOption[]>> => {
    const allowedCategories: PreferenceOption['category'][] = ['service_day', 'time_slot', 'frequency', 'client_status'];
    if (!allowedCategories.includes(category)) {
      throw new Error(`Invalid category: ${category}`);
    }
    return apiRequest<PreferenceOption[]>(`${API_ENDPOINTS.services.manage}?category=${category}`);
  },

  /**
   * Create a new preference option
   * @param category - Category to add the option to
   * @param data - { label: string, value?: string }
   */
  create: async (
    category: PreferenceOption['category'], 
    data: { label: string; value?: string }
  ): Promise<ApiResponse<{ id: number }>> => {
    const allowedCategories: PreferenceOption['category'][] = ['service_day', 'time_slot', 'frequency', 'client_status'];
    if (!allowedCategories.includes(category)) {
      throw new Error(`Invalid category: ${category}`);
    }
    if (!data.label?.trim()) {
      throw new Error('Label is required');
    }
    // Auto-generate value if not provided
    const value = data.value?.trim() || 
      data.label.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
    
    return apiRequest<{ id: number }>(`${API_ENDPOINTS.services.manage}?category=${category}`, {
      method: "POST",
      body: JSON.stringify({
        label: data.label.trim(),
        value: value,
      }),
    });
  },

  /**
   * Update an existing preference option
   * @param id - Option ID
   * @param category - Category of the option
   * @param data - Updated { label: string, value?: string }
   */
  update: async (
    id: number, 
    category: PreferenceOption['category'], 
    data: { label: string; value?: string }
  ): Promise<ApiResponse> => {
    const allowedCategories: PreferenceOption['category'][] = ['service_day', 'time_slot', 'frequency', 'client_status'];
    if (!allowedCategories.includes(category)) {
      throw new Error(`Invalid category: ${category}`);
    }
    if (!data.label?.trim()) {
      throw new Error('Label is required');
    }
    const value = data.value?.trim() || 
      data.label.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
    
    return apiRequest(`${API_ENDPOINTS.services.manage}?id=${id}&category=${category}`, {
      method: "PUT",
      body: JSON.stringify({
        label: data.label.trim(),
        value: value,
      }),
    });
  },

  /**
   * Delete a preference option
   * @param id - Option ID to delete
   * @param category - Category of the option (for logging)
   */
  delete: async (id: number, category: PreferenceOption['category']): Promise<ApiResponse> => {
    return apiRequest(`${API_ENDPOINTS.services.manage}?id=${id}&category=${category}`, {
      method: "DELETE",
    });
  }
};

// ============================================================================
// INVENTORY API
// ============================================================================

export const inventoryAPI = {
  getOverview: async (): Promise<ApiResponse> => 
    apiRequest(API_ENDPOINTS.inventory.getOverview),
  
  getItems: async (filters?: any): Promise<ApiResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const url = `${API_ENDPOINTS.inventory.getItems}${params.toString() ? `?${params}` : ''}`;
    return apiRequest(url);
  },
  
  addMovement: async (data: any): Promise<ApiResponse> => {
    return apiRequest(API_ENDPOINTS.inventory.addMovement, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  
  getAlerts: async (): Promise<ApiResponse> => 
    apiRequest(API_ENDPOINTS.inventory.getAlerts)
};

// ============================================================================
// FINANCE API
// ============================================================================

export const financeAPI = {
  getInvoices: async (filters?: any): Promise<ApiResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const url = `${API_ENDPOINTS.finance.getInvoices}${params.toString() ? `?${params}` : ''}`;
    return apiRequest(url);
  },
  
  createInvoice: async (data: any): Promise<ApiResponse> => {
    return apiRequest(API_ENDPOINTS.finance.createInvoice, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  
  getExpenses: async (filters?: any): Promise<ApiResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const url = `${API_ENDPOINTS.finance.getExpenses}${params.toString() ? `?${params}` : ''}`;
    return apiRequest(url);
  }
};

// ============================================================================
// SETTINGS API
// ============================================================================

export const settingsAPI = {
  getProfile: async (): Promise<ApiResponse> => 
    apiRequest(API_ENDPOINTS.settings.getProfile),
  
  updateProfile: async (data: any): Promise<ApiResponse> => {
    return apiRequest(API_ENDPOINTS.settings.updateProfile, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  
  getUsers: async (): Promise<ApiResponse> => 
    apiRequest(API_ENDPOINTS.settings.getUsers),
  
  createUser: async (data: any): Promise<ApiResponse> => {
    return apiRequest(API_ENDPOINTS.settings.createUser, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
};

// ============================================================================
// ✅ EXPORT ALL APIS
// ============================================================================

export const api = {
  auth: authAPI,
  booking: bookingAPI,
  client: clientAPI,
  dashboard: dashboardAPI,
  service: serviceAPI,
  preference: preferenceAPI,
  inventory: inventoryAPI,
  finance: financeAPI,
  settings: settingsAPI,
};

export default api;