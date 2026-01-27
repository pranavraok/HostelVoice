'use client'

import { createClient } from '@/lib/supabase/client'

// ==============================================
// CENTRAL API CLIENT FOR HOSTELVOICE
// ==============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Custom API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Response type from backend
interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  error?: string
}

// Get access token from Supabase session
async function getAccessToken(): Promise<string | null> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || null
}

// Build headers with Authorization
async function buildHeaders(includeContentType = true): Promise<HeadersInit> {
  const token = await getAccessToken()
  const headers: HeadersInit = {}
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json'
  }
  
  return headers
}

// Handle API response
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json() as ApiResponse<T>
  
  // Handle 401 - Auto logout
  if (response.status === 401) {
    const supabase = createClient()
    await supabase.auth.signOut()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new ApiError(data.message || 'Session expired', 401, data)
  }
  
  // Handle other errors
  if (!response.ok || !data.success) {
    throw new ApiError(
      data.message || data.error || 'An error occurred',
      response.status,
      data
    )
  }
  
  return data
}

// ==============================================
// API METHODS
// ==============================================

/**
 * GET request
 */
export async function apiGet<T = unknown>(
  url: string,
  options?: { signal?: AbortSignal }
): Promise<ApiResponse<T>> {
  const headers = await buildHeaders(false)
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'GET',
    headers,
    signal: options?.signal,
  })
  
  return handleResponse<T>(response)
}

/**
 * POST request
 */
export async function apiPost<T = unknown>(
  url: string,
  body?: unknown,
  options?: { signal?: AbortSignal }
): Promise<ApiResponse<T>> {
  const headers = await buildHeaders(true)
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: options?.signal,
  })
  
  return handleResponse<T>(response)
}

/**
 * PATCH request
 */
export async function apiPatch<T = unknown>(
  url: string,
  body?: unknown,
  options?: { signal?: AbortSignal }
): Promise<ApiResponse<T>> {
  const headers = await buildHeaders(true)
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'PATCH',
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: options?.signal,
  })
  
  return handleResponse<T>(response)
}

/**
 * DELETE request
 */
export async function apiDelete<T = unknown>(
  url: string,
  body?: unknown,
  options?: { signal?: AbortSignal }
): Promise<ApiResponse<T>> {
  const headers = await buildHeaders(true)
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'DELETE',
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: options?.signal,
  })
  
  return handleResponse<T>(response)
}

// ==============================================
// TYPED API FUNCTIONS
// ==============================================

// Issues
export interface Issue {
  id: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  hostel_name: string
  room_number?: string
  location?: string
  reported_by: string
  assigned_to?: string
  notes?: string
  images?: string[]
  created_at: string
  updated_at: string
  resolved_at?: string
  reporter?: {
    id: string
    full_name: string
    email: string
  }
  assignee?: {
    id: string
    full_name: string
    email: string
  }
}

export const issuesApi = {
  getMyIssues: (page = 1, limit = 10) => 
    apiGet<Issue[]>(`/api/issues/my?page=${page}&limit=${limit}`),
  
  getAllIssues: (params?: { page?: number; limit?: number; status?: string; category?: string; search?: string }) => {
    const query = new URLSearchParams()
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    if (params?.status) query.set('status', params.status)
    if (params?.category) query.set('category', params.category)
    if (params?.search) query.set('search', params.search)
    return apiGet<Issue[]>(`/api/issues?${query.toString()}`)
  },
  
  getById: (id: string) => 
    apiGet<Issue>(`/api/issues/${id}`),
  
  create: (data: {
    title: string
    description: string
    category: string
    priority?: string
    hostel_name: string
    room_number?: string
    location?: string
    images?: string[]
  }) => apiPost<Issue>('/api/issues', data),
  
  assign: (id: string, data: { assigned_to: string; notes?: string }) =>
    apiPatch<Issue>(`/api/issues/${id}/assign`, data),
  
  updateStatus: (id: string, data: { status: string; notes?: string }) =>
    apiPatch<Issue>(`/api/issues/${id}/status`, data),
  
  findDuplicates: (id: string) =>
    apiGet<Issue[]>(`/api/issues/${id}/duplicates`),
  
  merge: (data: { master_issue_id: string; duplicate_issue_ids: string[]; merge_notes?: string }) =>
    apiPost<Issue>('/api/issues/merge', data),
}

// Announcements
export interface Announcement {
  id: string
  title: string
  content: string
  category: string
  priority: string
  target_role: string
  target_hostel?: string
  is_active: boolean
  is_pinned?: boolean
  created_by: string
  expires_at?: string
  attachments?: string[]
  created_at: string
  updated_at: string
  creator?: {
    id: string
    full_name: string
    email: string
  }
}

export const announcementsApi = {
  getTargeted: (page = 1, limit = 10, category?: string) => {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (category) query.set('category', category)
    return apiGet<Announcement[]>(`/api/announcements?${query.toString()}`)
  },
  
  getAll: (page = 1, limit = 10) =>
    apiGet<Announcement[]>(`/api/announcements/all?page=${page}&limit=${limit}`),
  
  getById: (id: string) =>
    apiGet<Announcement>(`/api/announcements/${id}`),
  
  create: (data: {
    title: string
    content: string
    category?: string
    priority?: string
    target_role?: string
    target_hostel?: string
    expires_at?: string
    attachments?: string[]
  }) => apiPost<Announcement>('/api/announcements', data),
  
  update: (id: string, data: Partial<{
    title: string
    content: string
    category: string
    priority: string
    target_role: string
    target_hostel: string
    expires_at: string
  }>) => apiPatch<Announcement>(`/api/announcements/${id}`, data),
  
  delete: (id: string) =>
    apiDelete<void>(`/api/announcements/${id}`),
  
  toggle: (id: string) =>
    apiPatch<Announcement>(`/api/announcements/${id}/toggle`),
}

// Lost & Found
export interface LostFoundItem {
  id: string
  item_name: string
  description: string
  category: string
  type: 'lost' | 'found'
  status: 'open' | 'claimed' | 'returned' | 'closed'
  reported_by: string
  claimed_by?: string
  location_found?: string
  location_lost?: string
  current_location?: string
  date_lost_found?: string
  date_found?: string
  date_lost?: string
  claimed_at?: string
  images?: string | string[]
  contact_info?: string
  notes?: string
  created_at: string
  updated_at: string
  reporter?: {
    id: string
    full_name: string
    email: string
    phone_number?: string
  }
  claimer?: {
    id: string
    full_name: string
    email: string
  }
}

export const lostFoundApi = {
  getOpenItems: (params?: { page?: number; limit?: number; type?: string; category?: string; search?: string }) => {
    const query = new URLSearchParams()
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    if (params?.type) query.set('type', params.type)
    if (params?.category) query.set('category', params.category)
    if (params?.search) query.set('search', params.search)
    return apiGet<LostFoundItem[]>(`/api/lostfound?${query.toString()}`)
  },
  
  getMyItems: (page = 1, limit = 10) =>
    apiGet<LostFoundItem[]>(`/api/lostfound/my?page=${page}&limit=${limit}`),
  
  getAll: (page = 1, limit = 10) =>
    apiGet<LostFoundItem[]>(`/api/lostfound/all?page=${page}&limit=${limit}`),
  
  getById: (id: string) =>
    apiGet<LostFoundItem>(`/api/lostfound/${id}`),
  
  report: (data: {
    item_name: string
    description: string
    type: 'lost' | 'found'
    category?: string
    location_found?: string
    location_lost?: string
    date_found?: string
    date_lost?: string
    contact_info?: string
    images?: string[]
  }) => apiPost<LostFoundItem>('/api/lostfound', data),
  
  claim: (id: string, notes?: string) =>
    apiPatch<LostFoundItem>(`/api/lostfound/${id}/claim`, { notes }),
  
  close: (id: string, data: { status: 'returned' | 'closed'; notes?: string }) =>
    apiPatch<LostFoundItem>(`/api/lostfound/${id}/close`, data),
}

// Residents
export interface Resident {
  id: string
  user_id: string
  guardian_name?: string
  guardian_phone?: string
  guardian_email?: string
  permanent_address?: string
  blood_group?: string
  emergency_contact?: string
  medical_conditions?: string
  check_in_date?: string
  check_out_date?: string
  created_at: string
  updated_at: string
  user?: {
    id: string
    full_name: string
    email: string
    phone_number: string
    hostel_name: string
    room_number: string
  }
}

export const residentsApi = {
  getMe: () =>
    apiGet<Resident>('/api/residents/me'),
  
  addOrUpdate: (data: {
    guardian_name?: string
    guardian_phone?: string
    guardian_email?: string
    permanent_address?: string
    blood_group?: string
    emergency_contact?: string
    medical_conditions?: string
    check_in_date?: string
  }) => apiPost<Resident>('/api/residents', data),
  
  updateMe: (data: Partial<{
    guardian_name: string
    guardian_phone: string
    guardian_email: string
    permanent_address: string
    blood_group: string
    emergency_contact: string
    medical_conditions: string
  }>) => apiPatch<Resident>('/api/residents/me', data),
  
  getAll: (page = 1, limit = 10) =>
    apiGet<Resident[]>(`/api/residents?page=${page}&limit=${limit}`),
  
  getByHostel: (hostelName: string, page = 1, limit = 10) =>
    apiGet<Resident[]>(`/api/residents/hostel/${encodeURIComponent(hostelName)}?page=${page}&limit=${limit}`),
  
  getById: (id: string) =>
    apiGet<Resident>(`/api/residents/${id}`),
}

// Notifications
export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: string
  reference_id?: string
  is_read: boolean
  read_at?: string
  created_at: string
}

export const notificationsApi = {
  getAll: (page = 1, limit = 20, unread?: boolean) => {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (unread !== undefined) query.set('unread', String(unread))
    return apiGet<Notification[]>(`/api/notifications?${query.toString()}`)
  },
  
  getUnreadCount: () =>
    apiGet<{ count: number }>('/api/notifications/count'),
  
  markAsRead: (notificationIds: string[]) =>
    apiPatch<void>('/api/notifications/read', { notification_ids: notificationIds }),
  
  markAllAsRead: () =>
    apiPatch<void>('/api/notifications/read-all'),
}

// Analytics
export interface DashboardStats {
  issues: {
    total: number
    pending: number
    this_month: number
    last_month: number
    trend: number
  }
  users: {
    total: number
    pending_approvals: number
  }
  announcements: {
    active: number
  }
  lost_found: {
    open: number
  }
  // Also support flat structure for backwards compatibility
  totalIssues?: number
  pendingIssues?: number
  inProgressIssues?: number
  resolvedIssues?: number
  issuesThisMonth?: number
  totalUsers?: number
  totalStudents?: number
  totalCaretakers?: number
  activeAnnouncements?: number
  openLostFound?: number
}

export interface IssuesSummary {
  byStatus: { status: string; count: number }[]
  byCategory: { category: string; count: number }[]
  byPriority: { priority: string; count: number }[]
}

export interface CategoryFrequency {
  category: string
  count: number
  percentage: number
}

export interface StatusTrend {
  week: string
  created: number
  resolved: number
}

export const analyticsApi = {
  getDashboard: () =>
    apiGet<DashboardStats>('/api/analytics/dashboard'),
  
  getIssuesSummary: (hostelName?: string) => {
    const query = hostelName ? `?hostel_name=${encodeURIComponent(hostelName)}` : ''
    return apiGet<IssuesSummary>(`/api/analytics/issues-summary${query}`)
  },
  
  getResolutionTime: (category?: string) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : ''
    return apiGet<{ averageHours: number; byCategory: { category: string; averageHours: number }[] }>(
      `/api/analytics/resolution-time${query}`
    )
  },
  
  getCategoryFrequency: (period = 30) =>
    apiGet<CategoryFrequency[]>(`/api/analytics/category-frequency?period=${period}`),
  
  getHostelDensity: (period = 30) =>
    apiGet<{ hostel: string; totalIssues: number; pending: number; resolved: number }[]>(
      `/api/analytics/hostel-density?period=${period}`
    ),
  
  getStatusTrends: (period = 30) =>
    apiGet<StatusTrend[]>(`/api/analytics/status-trends?period=${period}`),
}

// Admin
export interface PendingUser {
  id: string
  email: string
  full_name: string
  role: string
  student_id?: string
  caretaker_id?: string
  hostel_name?: string
  room_number?: string
  phone_number?: string
  department?: string
  approval_status: string
  created_at: string
}

export const adminApi = {
  getPendingUsers: (page = 1, limit = 10) =>
    apiGet<PendingUser[]>(`/api/admin/pending-users?page=${page}&limit=${limit}`),
  
  approveUser: (userId: string) =>
    apiPatch<void>('/api/admin/approve-user', { user_id: userId }),
  
  rejectUser: (userId: string, reason?: string) =>
    apiPatch<void>('/api/admin/reject-user', { user_id: userId, rejection_reason: reason }),
  
  getAllUsers: (params?: { page?: number; limit?: number; role?: string; approval_status?: string; search?: string }) => {
    const query = new URLSearchParams()
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    if (params?.role) query.set('role', params.role)
    if (params?.approval_status) query.set('approval_status', params.approval_status)
    if (params?.search) query.set('search', params.search)
    return apiGet<PendingUser[]>(`/api/admin/users?${query.toString()}`)
  },
  
  getAuditLogs: (page = 1, limit = 50) =>
    apiGet<unknown[]>(`/api/admin/audit-logs?page=${page}&limit=${limit}`),
  
  getSystemStats: () =>
    apiGet<unknown>('/api/admin/stats'),
  
  getHostels: () =>
    apiGet<{ name: string; studentCount: number }[]>('/api/admin/hostels'),
}

// Upload
export const uploadApi = {
  getSignedUploadUrl: (bucket: string, filename: string, contentType: string) =>
    apiPost<{ signedUrl: string; path: string; expiresIn: number; bucket: string }>(
      '/api/upload/signed-url',
      { bucket, filename, contentType }
    ),
  
  getPublicUrl: (bucket: string, path: string) =>
    apiGet<{ publicUrl: string }>(`/api/upload/public-url?bucket=${bucket}&path=${path}`),
  
  getSignedDownloadUrl: (bucket: string, path: string) =>
    apiGet<{ signedUrl: string; expiresIn: number }>(`/api/upload/signed-url?bucket=${bucket}&path=${path}`),
  
  deleteFile: (bucket: string, path: string) =>
    apiDelete<void>('/api/upload/file', { bucket, path }),
  
  listMyFiles: (bucket: string) =>
    apiGet<unknown[]>(`/api/upload/my-files/${bucket}`),
}
