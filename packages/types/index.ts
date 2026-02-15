export interface User {
  id: string
  name?: string | null
  email: string
  emailVerified?: Date | null
  image?: string | null
  role: 'USER' | 'ADMIN'
  createdAt: Date
  updatedAt: Date
}

export interface Dashboard {
  id: string
  name: string
  description?: string | null
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
  widgets: Widget[]
}

export interface Widget {
  id: string
  type: 'METRIC' | 'CHART' | 'TABLE' | 'ALERT' | 'TEXT'
  title: string
  config: Record<string, any>
  position: { x: number; y: number }
  size: { width: number; height: number }
  createdAt: Date
  updatedAt: Date
  dashboardId: string
}

export interface Metric {
  id: string
  name: string
  description?: string | null
  unit?: string | null
  value: number
  timestamp: Date
  metadata?: Record<string, any> | null
}

export interface Activity {
  id: string
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'SHARE' | 'COMMENT'
  action: string
  target: string
  metadata?: Record<string, any> | null
  createdAt: Date
  userId: string
  user: User
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS'
  read: boolean
  createdAt: Date
  userId: string
}

export interface Alert {
  id: string
  title: string
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  isActive: boolean
  conditions: Record<string, any>
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface Team {
  id: string
  name: string
  description?: string | null
  createdAt: Date
  updatedAt: Date
  ownerId: string
  memberships: TeamMember[]
}

export interface TeamMember {
  id: string
  role: 'MEMBER' | 'ADMIN' | 'OWNER'
  createdAt: Date
  userId: string
  teamId: string
  user: User
}

export interface AIInsight {
  id: string
  title: string
  description: string
  type: 'trend' | 'alert' | 'suggestion'
  confidence: number
  createdAt: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface FilterOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
  filters?: Record<string, any>
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
  }[]
}

export interface DashboardWidget {
  id: string
  type: string
  title: string
  data?: any
  config: Record<string, any>
  position: { x: number; y: number }
  size: { width: number; height: number }
}