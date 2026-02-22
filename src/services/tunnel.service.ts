import type { AxiosInstance } from 'axios';
import { environment } from '../config/environment';
import axios from 'axios';
import type { ApiResponse, PaginatedResponse, Statistics, Tunnel, TunnelLog, TunnelStatusData } from '../types';

class TunnelService {
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

  async getActiveTunnels(): Promise<ApiResponse<Tunnel[]>> {
    const response = await this.api.get<ApiResponse<Tunnel[]>>('/tunnels/active');
    return response.data;
  }

  async getAllUserTunnels(): Promise<ApiResponse<Tunnel[]>> {
    const response = await this.api.get<ApiResponse<Tunnel[]>>('/tunnels/all');
    return response.data;
  }

  async getTunnelStatus(tunnelId: string): Promise<ApiResponse<TunnelStatusData>> {
    const response = await this.api.get<ApiResponse<TunnelStatusData>>(`/tunnels/${tunnelId}/status`);
    return response.data;
  }

  async getTunnelHistory(page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<Tunnel>> {
    const response = await this.api.get<PaginatedResponse<Tunnel>>('/tunnels/history', {
      params: {
        page: page.toString(),
        page_size: pageSize.toString()
      }
    });
    return response.data;
  }

  async getTunnelDetails(id: string): Promise<ApiResponse<Tunnel>> {
    const response = await this.api.get<ApiResponse<Tunnel>>(`/tunnels/single/${id}`);
    return response.data;
  }

  async getTunnelLogs(id: string, limit: number = 100): Promise<ApiResponse<TunnelLog>> {
    const response = await this.api.get<ApiResponse<TunnelLog>>(`/tunnels/${id}/logs`, {
      params: {
        limit: limit.toString()
      }
    });
    return response.data;
  }

  async getStatistics(): Promise<ApiResponse<Statistics>> {
    const response = await this.api.get<ApiResponse<Statistics>>('/tunnels/stats/overview');
    return response.data;
  }

  async deleteTunnel(id: string): Promise<ApiResponse<string>> {
    const response = await this.api.delete<ApiResponse<string>>(`/tunnels/${id}`);
    return response.data;
  }
}

export const tunnelService = new TunnelService();
