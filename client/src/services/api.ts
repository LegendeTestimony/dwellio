// API service for Dwellio tenant application
import type { 
  User, 
  Property, 
  Application, 
  LoginCredentials, 
  SignupData,
  ApiResponse,
  PaginatedResponse,
  MoveOutIntentData,
  ApplicationFormData,
  PropertySearchFilters,
  TenantStats,
  Document
} from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  
  return data;
};

// Authentication API
export const authApi = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  async signup(userData: SignupData): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Tenant API
export const tenantApi = {
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/tenant/profile`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async updateProfile(profileData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/tenant/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(response);
  },

  async uploadDocument(file: File, documentType: string): Promise<ApiResponse<Document>> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tenant/documents`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    return handleResponse(response);
  },

  async submitMoveOutIntent(intentData: MoveOutIntentData): Promise<ApiResponse<MoveOutIntentData>> {
    const response = await fetch(`${API_BASE_URL}/tenant/move-out-intent`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(intentData)
    });
    return handleResponse(response);
  },

  async getDashboardStats(): Promise<ApiResponse<TenantStats>> {
    const response = await fetch(`${API_BASE_URL}/tenant/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Properties API
export const propertiesApi = {
  async getAvailableProperties(params?: {
    page?: number;
    limit?: number;
    type?: string;
    city?: string;
    lga?: string;
    minRent?: number;
    maxRent?: number;
  }): Promise<PaginatedResponse<Property>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/properties?${queryParams}`);
    return handleResponse(response);
  },

  async getPropertyById(id: string): Promise<ApiResponse<Property>> {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);
    return handleResponse(response);
  },

  async searchProperties(query: string, filters?: PropertySearchFilters): Promise<PaginatedResponse<Property>> {
    const queryParams = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/properties/search?${queryParams}`);
    return handleResponse(response);
  },

  async submitApplication(propertyId: string, applicationData: ApplicationFormData): Promise<ApiResponse<Application>> {
    const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/apply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(applicationData)
    });
    return handleResponse(response);
  },

  async getMyApplications(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Application>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/properties/applications/my?${queryParams}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async withdrawApplication(applicationId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await fetch(`${API_BASE_URL}/properties/applications/${applicationId}/withdraw`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Export all APIs
export default {
  auth: authApi,
  tenant: tenantApi,
  properties: propertiesApi
};
