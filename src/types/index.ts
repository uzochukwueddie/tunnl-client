import type { ReactNode } from 'react';

export interface AuthButtonProps {
  loading: boolean;
  disabled: boolean;
  loadingText: string;
  text: string;
}

export interface AuthInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
}

export interface AuthFormProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export interface ErrorAlertProps {
  message: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  is_active: boolean;
}

export interface Auth {
  email: string;
  password: string;
}

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

export interface LoadingSpinnerProps {
  text?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

export interface ProtectedRouteProps {
  children: ReactNode;
}

export interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
  uppercase?: boolean;
}

export interface StatusIndicatorProps {
  status: 'active' | 'inactive';
  animated?: boolean;
}

export interface DashboardLayoutProps {
  children?: ReactNode;
}

export interface LoadError {
  loading: boolean;
  error: string;
}

export interface Token {
  id: string;
  user_id: string;
  token: string;
  name: string | null;
  is_active: boolean;
  created_at: string;
  last_used: string | null;
}

export interface Tunnel {
  id: string;
  subdomain: string;
  local_port: number;
  status: 'active' | 'inactive';
  created_at: string;
  public_url: string;
  user_id: string;
  last_activity?: string;
  request_count: string;
  closed_at: string | null;
}

export interface TunnelDetails extends Tunnel {
  user_id: string;
  public_url: string;
  protocol: string;
}

export interface TunnelLog {
  id: string;
  tunnel_id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface RequestLog {
  id: string;
  tunnelId: string;
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  errorMessage: string | null;
  host: string;
}

export interface Statistics {
  total_tunnels: number;
  active_tunnels: number;
  total_requests: number;
  closed: number;
}

export interface ApiResponse<T> {
  result: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface TunnelUpdate {
  type: string;
  data: Tunnel[];
  message?: string;
}

export interface TunnelLocalService {
  tunnelId: string;
  localServiceConnected: boolean;
}

export interface TunnelStatusData {
  id: string;
  subdomain: string;
  localPort: number;
  publicUrl: string;
  status: 'active' | 'inactive';
  lastSeen: string;
  createdAt: string;
  localServiceConnected?: boolean;
  shuttingDown?: boolean;
}

export interface WebSocketMessageData {
  type: 'connected' | 'status_update' | 'error' | 'local_service_status';
  tunnelId?: string;
  message?: string;
  data?: {
    tunnelId: string;
    status: 'active' | 'inactive';
    lastSeen: string;
    localServiceConnected?: boolean;
  };
  localServiceConnected?: boolean;
}

export interface ActiveTunnelItemProps {
  tunnel: Tunnel;
}

export interface QuickActionCardProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor?: string;
  iconHoverColor?: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor?: string;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

export interface TokenFormProps {
  formAction: (formData: FormData) => void;
  isPending: boolean;
  error?: string;
}

export interface TokenSuccessAlertProps {
  token: string;
  copied: boolean;
  onCopy: () => void;
}

export interface TokenListItemProps {
  token: Token;
  onRevoke: (token: Token) => void;
  onDelete: (token: Token) => void;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
}

export type TabType = 'active' | 'history';

export interface TunnelTabsProps {
  activeTab: TabType;
  activeTunnelsCount: number;
  onTabChange: (tab: TabType) => void;
}

export interface TunnelListProps {
  tunnels: Tunnel[];
  loading: boolean;
  isActive: boolean;
  emptyIcon: React.ReactNode;
  emptyTitle: string;
  emptyDescription: string;
  onDelete?: (tunnel: Tunnel, event: React.MouseEvent) => void;
  deletingInProgress?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

export interface ActiveandHistoryTunnel {
  activeTunnels: Tunnel[];
  historyTunnels: Tunnel[];
}

export interface TunnelListItemProps {
  tunnel: Tunnel;
  isActive: boolean;
  onDelete?: (tunnel: Tunnel, event: React.MouseEvent) => void;
  deletingInProgress?: boolean;
}

export interface TunnelDetailsAndLogs {
  details: Tunnel | null;
  logs: RequestLog[];
}

export interface TunnelSelectorProps {
  tunnels: Tunnel[];
  selectedTunnelId: string | null;
  onSelectTunnel: (tunnelId: string) => void;
}

export interface UseTunnelRealtimeEventsResult {
  tunnels: Tunnel[];
  tunnelStatus: TunnelStatusData | null;
  loading: boolean;
  error: string | null;
}

export interface TunnelDataAndStatus {
  tunnels: Tunnel[];
  status: TunnelStatusData | null;
}

export interface TunnelsWebSocketMessage {
  type: 'tunnels_update' | 'error';
  data?: Tunnel[];
  message?: string;
}
