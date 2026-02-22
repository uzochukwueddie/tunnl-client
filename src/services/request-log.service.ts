import type { AxiosInstance } from 'axios';
import { environment } from '../config/environment';
import axios from 'axios';
import type { ApiResponse, RequestLog } from '../types';

class RequestLogService {
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

  async getRequestLogsByTunnelId(tunnelId: string, limit?: number): Promise<ApiResponse<RequestLog[]>> {
    const params: Record<string, string> = {};
    if (limit) {
      params.limit = limit.toString();
    }
    const response = await this.api.get<ApiResponse<RequestLog[]>>(`/request-logs/tunnel/${tunnelId}`, {
      params
    });
    return response.data;
  }
}

export const requestLogService = new RequestLogService();
