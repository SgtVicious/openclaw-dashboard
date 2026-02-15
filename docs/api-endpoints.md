# API Endpoints Documentation

## Authentication

### POST /api/auth/signin
Authenticate user and return session token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "USER"
    },
    "token": "jwt_token_here"
  }
}
```

### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "USER"
    }
  }
}
```

## Dashboards

### GET /api/dashboards
Get all dashboards for the authenticated user.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search term

**Response:**
```json
{
  "success": true,
  "data": {
    "dashboards": [
      {
        "id": "dashboard_id",
        "name": "Sales Dashboard",
        "description": "Sales performance metrics",
        "isPublic": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "widgetCount": 5
      }
    ],
    "total": 10,
    "page": 1,
    "limit": 10
  }
}
```

### GET /api/dashboards/{id}
Get a specific dashboard with its widgets.

**Response:**
```json
{
  "success": true,
  "data": {
    "dashboard": {
      "id": "dashboard_id",
      "name": "Sales Dashboard",
      "description": "Sales performance metrics",
      "isPublic": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "widgets": [
        {
          "id": "widget_id",
          "type": "METRIC",
          "title": "Total Revenue",
          "config": {
            "metricId": "revenue",
            "format": "currency"
          },
          "position": { "x": 0, "y": 0 },
          "size": { "width": 2, "height": 1 }
        }
      ]
    }
  }
}
```

### POST /api/dashboards
Create a new dashboard.

**Request Body:**
```json
{
  "name": "New Dashboard",
  "description": "Dashboard description",
  "isPublic": false
}
```

### PUT /api/dashboards/{id}
Update a dashboard.

**Request Body:**
```json
{
  "name": "Updated Dashboard",
  "description": "Updated description",
  "isPublic": true
}
```

### DELETE /api/dashboards/{id}
Delete a dashboard.

**Response:**
```json
{
  "success": true,
  "message": "Dashboard deleted successfully"
}
```

## Metrics

### GET /api/metrics
Get all metrics with optional filtering.

**Query Parameters:**
- `name` (optional): Filter by metric name
- `from` (optional): Start date (ISO 8601)
- `to` (optional): End date (ISO 8601)
- `limit` (optional): Maximum number of results

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "id": "metric_id",
        "name": "Monthly Revenue",
        "value": 125000,
        "unit": "USD",
        "timestamp": "2024-01-01T00:00:00Z",
        "change": 12.5,
        "trend": "up"
      }
    ]
  }
}
```

### POST /api/metrics
Create a new metric data point.

**Request Body:**
```json
{
  "name": "Monthly Revenue",
  "value": 125000,
  "unit": "USD",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Activities

### GET /api/activities
Get recent activity feed.

**Query Parameters:**
- `limit` (optional): Number of activities (default: 20)
- `type` (optional): Filter by activity type

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "activity_id",
        "type": "UPDATE",
        "action": "updated dashboard",
        "target": "Sales Analytics",
        "user": {
          "id": "user_id",
          "name": "John Doe",
          "avatar": "/avatar.jpg"
        },
        "timestamp": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

## Notifications

### GET /api/notifications
Get user notifications.

**Query Parameters:**
- `unread` (optional): Filter unread notifications only
- `type` (optional): Filter by notification type

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notification_id",
        "title": "New Alert",
        "message": "CPU usage has exceeded threshold",
        "type": "WARNING",
        "read": false,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "unreadCount": 3
  }
}
```

### PUT /api/notifications/{id}/read
Mark a notification as read.

### PUT /api/notifications/read-all
Mark all notifications as read.

## Teams

### GET /api/teams
Get user's teams.

### POST /api/teams
Create a new team.

### GET /api/teams/{id}/members
Get team members.

### POST /api/teams/{id}/members
Add a member to the team.

## Alerts

### GET /api/alerts
Get configured alerts.

### POST /api/alerts
Create a new alert.

### PUT /api/alerts/{id}
Update an alert.

### DELETE /api/alerts/{id}
Delete an alert.

## AI Insights

### GET /api/ai/insights
Get AI-generated insights.

**Response:**
```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "id": "insight_id",
        "title": "Revenue Trending Up",
        "description": "Monthly revenue has increased by 12.5%",
        "type": "trend",
        "confidence": 0.85,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### GET /api/ai/anomalies
Get detected anomalies in metrics.

## Health Check

### GET /api/health
Check API health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## WebSocket Events

Real-time updates are available via WebSocket connections:

- `metric:update` - New metric data
- `alert:triggered` - Alert triggered
- `dashboard:updated` - Dashboard changes
- `notification:new` - New notifications

## Rate Limiting

API endpoints are rate-limited:
- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

Common error codes:
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid input data
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error