import type { AxiosInstance } from 'axios';
import { environment } from '../config/environment';
import axios from 'axios';
import type { ApiResponse, User } from '../types';

class AuthService {
  private api: AxiosInstance;
  private readonly API_URL = environment.apiUrl;

  constructor() {
    this.api = axios.create({
      baseURL: this.API_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
  }

  async register(email: string, password: string): Promise<ApiResponse<User>> {
    const response = await this.api.post<ApiResponse<User>>('/auth/signup', {
      email,
      password
    });
    return response.data;
  }

  async login(email: string, password: string): Promise<ApiResponse<User>> {
    const response = await this.api.post<ApiResponse<User>>('/auth/signin', {
      email,
      password
    });
    return response.data;
  }

  async currentUser(): Promise<ApiResponse<User>> {
    const response = await this.api.get<ApiResponse<User>>('/auth/currentuser');
    return response.data;
  }

  async logout<T>(): Promise<ApiResponse<T>> {
    const response = await this.api.get<ApiResponse<T>>('/auth/logout');
    return response.data;
  }
}

export const authService = new AuthService();
