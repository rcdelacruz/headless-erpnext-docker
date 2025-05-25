import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

class ERPNextClient {
  private client: AxiosInstance;
  private baseURL: string;
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_ERPNEXT_URL || '';
    this.apiKey = process.env.NEXT_PUBLIC_ERPNEXT_API_KEY || '';
    this.apiSecret = process.env.NEXT_PUBLIC_ERPNEXT_API_SECRET || '';

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use((config) => {
      const token = Cookies.get('erpnext_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (this.apiKey && this.apiSecret) {
        config.headers.Authorization = `token ${this.apiKey}:${this.apiSecret}`;
      }
      return config;
    });
  }

  // Authentication methods
  async login(username: string, password: string) {
    const response = await this.client.post('/api/method/login', {
      usr: username,
      pwd: password,
    });
    
    if (response.data.message === 'Logged In') {
      // Store session cookie
      Cookies.set('erpnext_token', response.data.token || '');
      return response.data;
    }
    throw new Error('Login failed');
  }

  async logout() {
    await this.client.post('/api/method/logout');
    Cookies.remove('erpnext_token');
  }

  // Generic CRUD operations
  async getList(doctype: string, fields?: string[], filters?: any, limit?: number) {
    const params = new URLSearchParams();
    params.append('doctype', doctype);
    
    if (fields) params.append('fields', JSON.stringify(fields));
    if (filters) params.append('filters', JSON.stringify(filters));
    if (limit) params.append('limit', limit.toString());

    const response = await this.client.get(`/api/resource/${doctype}`, { params });
    return response.data;
  }

  async getDoc(doctype: string, name: string) {
    const response = await this.client.get(`/api/resource/${doctype}/${name}`);
    return response.data.data;
  }

  async createDoc(doctype: string, data: any) {
    const response = await this.client.post(`/api/resource/${doctype}`, data);
    return response.data.data;
  }

  async updateDoc(doctype: string, name: string, data: any) {
    const response = await this.client.put(`/api/resource/${doctype}/${name}`, data);
    return response.data.data;
  }

  async deleteDoc(doctype: string, name: string) {
    const response = await this.client.delete(`/api/resource/${doctype}/${name}`);
    return response.data;
  }

  // Call server methods
  async callMethod(method: string, args?: any) {
    const response = await this.client.post(`/api/method/${method}`, args);
    return response.data;
  }
}

export const erpnext = new ERPNextClient();