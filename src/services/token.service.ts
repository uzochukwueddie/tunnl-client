import axios, { type AxiosInstance } from 'axios';
import type { Token, ApiResponse } from '../types';
import { environment } from '../config/environment';

class TokenService {
  private api: AxiosInstance;
  private readonly API_URL = environment.apiUrl;

  constructor() {
    this.api = axios.create({
      baseURL: this.API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
  }

  async createToken(name: string): Promise<ApiResponse<Token>> {
    const response = await this.api.post<ApiResponse<Token>>('/tokens', {
      name,
    });
    return response.data;
  }

  async listTokens(): Promise<ApiResponse<Token[]>> {
    const response = await this.api.get<ApiResponse<Token[]>>('/tokens/all');
    return response.data;
  }

  async revokeToken(id: string): Promise<ApiResponse<{ id: string }>> {
    const response = await this.api.put<ApiResponse<{ id: string }>>(
      `/tokens/${id}`,
      {},
    );
    return response.data;
  }

  async deleteToken(id: string): Promise<ApiResponse<{ id: string }>> {
    const response = await this.api.delete<ApiResponse<{ id: string }>>(
      `/tokens/${id}`,
    );
    return response.data;
  }
}

export const tokenService = new TokenService();
