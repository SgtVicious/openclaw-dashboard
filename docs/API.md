# API Reference

This document describes the APIs used by the OpenClaw Dashboard.

## Table of Contents

- [WebSocket API](#websocket-api)
- [REST API](#rest-api)
- [Authentication](#authentication)
- [Types](#types)

## WebSocket API

The dashboard connects to the OpenClaw Gateway via WebSocket.

### Connection

```typescript
const ws = new WebSocket('ws://localhost:18789');

ws.onopen = () => {
  // Authenticate
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'your-jwt-token'
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  handleMessage(message);
};
```

### Message Types

#### Client → Gateway

```typescript
// Health check
interface HealthRequest {
  type: 'health';
  requestId: string;
}

// Status request
interface StatusRequest {
  type: 'status';
  requestId: string;
}

// Send message to agent
interface SendRequest {
  type: 'send';
  requestId: string;
  agentId: string;
  message: string;
  sessionId?: string;
}

// Agent control
interface AgentRequest {
  type: 'agent';
  requestId: string;
  action: 'start' | 'stop' | 'restart';
  agentId: string;
}
```

#### Gateway → Client

```typescript
// Health response
interface HealthResponse {
  type: 'health';
  requestId: string;
  status: 'healthy' | 'unhealthy';
  uptime: number;
  version: string;
}

// Agent event
interface AgentEvent {
  type: 'agent';
  agentId: string;
  event: 'started' | 'stopped' | 'error';
  timestamp: string;
  data?: unknown;
}

// Chat message
interface ChatEvent {
  type: 'chat';
  agentId: string;
  sessionId: string;
  message: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  };
}

// Presence update
interface PresenceEvent {
  type: 'presence';
  agentId: string;
  status: 'online' | 'offline' | 'busy';
  timestamp: string;
}

// Cron event
interface CronEvent {
  type: 'cron';
  event: 'job_started' | 'job_completed' | 'job_failed';
  jobId: string;
  timestamp: string;
  data?: {
    output?: string;
    error?: string;
  };
}
```

## REST API

### Authentication

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your-password"
}
```

Response:

```json
{
  "token": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJSUzI1NiIs...",
  "expiresIn": 3600
}
```

### Agents

#### List Agents

```http
GET /api/agents
Authorization: Bearer <token>
```

Response:

```json
{
  "agents": [
    {
      "id": "main",
      "name": "Chief of Staff",
      "emoji": "🦞",
      "status": "online",
      "model": "anthropic/claude-opus-4-6",
      "workspace": "/home/pi/.openclaw/workspace",
      "lastActive": "2024-02-14T10:00:00Z"
    }
  ]
}
```

#### Get Agent Details

```http
GET /api/agents/:id
Authorization: Bearer <token>
```

#### Create Agent

```http
POST /api/agents
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Researcher",
  "emoji": "🔬",
  "model": "openai/gpt-4",
  "workspace": "/home/pi/.openclaw/workspace-researcher"
}
```

#### Update Agent

```http
PATCH /api/agents/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "model": "anthropic/claude-sonnet-4-6"
}
```

#### Delete Agent

```http
DELETE /api/agents/:id
Authorization: Bearer <token>
```

### Sessions

#### List Sessions

```http
GET /api/sessions
Authorization: Bearer <token>
```

Query Parameters:
- `agentId` - Filter by agent
- `status` - Filter by status (active, archived)
- `limit` - Number of results (default: 50)
- `offset` - Pagination offset

Response:

```json
{
  "sessions": [
    {
      "id": "session-001",
      "agentId": "main",
      "key": "main",
      "status": "active",
      "messageCount": 42,
      "createdAt": "2024-02-14T08:00:00Z",
      "lastActivity": "2024-02-14T10:00:00Z"
    }
  ],
  "total": 1
}
```

#### Get Session Transcript

```http
GET /api/sessions/:id/transcript
Authorization: Bearer <token>
```

Response:

```json
{
  "session": {
    "id": "session-001",
    "agentId": "main",
    "messages": [
      {
        "id": "msg-001",
        "role": "user",
        "content": "Hello!",
        "timestamp": "2024-02-14T08:00:00Z"
      },
      {
        "id": "msg-002",
        "role": "assistant",
        "content": "Hi there! How can I help you today?",
        "timestamp": "2024-02-14T08:00:05Z",
        "tokens": {
          "input": 2,
          "output": 12
        }
      }
    ]
  }
}
```

#### Send Message to Session

```http
POST /api/sessions/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Your message here"
}
```

### Cron Jobs

#### List Cron Jobs

```http
GET /api/cron/jobs
Authorization: Bearer <token>
```

Response:

```json
{
  "jobs": [
    {
      "id": "cron-001",
      "jobId": "morning-brief",
      "name": "Morning Brief",
      "schedule": {
        "kind": "cron",
        "cron": "0 7 * * *",
        "tz": "America/Los_Angeles"
      },
      "status": "pending",
      "nextRun": "2024-02-15T15:00:00Z",
      "runCount": 12
    }
  ]
}
```

#### Create Cron Job

```http
POST /api/cron/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Daily Report",
  "schedule": {
    "kind": "cron",
    "cron": "0 9 * * *",
    "tz": "UTC"
  },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "Generate daily report"
  }
}
```

#### Update Cron Job

```http
PATCH /api/cron/jobs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "schedule": {
    "kind": "cron",
    "cron": "0 10 * * *"
  }
}
```

#### Delete Cron Job

```http
DELETE /api/cron/jobs/:id
Authorization: Bearer <token>
```

#### Run Job Now

```http
POST /api/cron/jobs/:id/run
Authorization: Bearer <token>
```

### Files

#### List Files

```http
GET /api/files
Authorization: Bearer <token>
```

Query Parameters:
- `path` - Directory path (default: root)
- `workspace` - Workspace ID

Response:

```json
{
  "files": [
    {
      "name": "AGENTS.md",
      "type": "file",
      "size": 2048,
      "modifiedAt": "2024-02-14T10:00:00Z"
    },
    {
      "name": "memory",
      "type": "directory",
      "modifiedAt": "2024-02-14T09:00:00Z"
    }
  ]
}
```

#### Get File Content

```http
GET /api/files/:path
Authorization: Bearer <token>
```

Response:

```json
{
  "file": {
    "name": "AGENTS.md",
    "content": "# Agent Instructions\n\nYou are a helpful assistant...",
    "size": 2048,
    "modifiedAt": "2024-02-14T10:00:00Z"
  }
}
```

#### Update File

```http
PUT /api/files/:path
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "# Updated content"
}
```

### System

#### Get System Info

```http
GET /api/system/info
Authorization: Bearer <token>
```

Response:

```json
{
  "hostname": "raspberrypi",
  "platform": "linux",
  "arch": "arm64",
  "uptime": 86400,
  "openclaw": {
    "version": "1.0.0",
    "gatewayStatus": "running",
    "connectedChannels": ["whatsapp", "telegram"]
  }
}
```

#### Get Metrics

```http
GET /api/system/metrics
Authorization: Bearer <token>
```

Response:

```json
{
  "cpu": {
    "usage": 45.2,
    "temperature": 52.3
  },
  "memory": {
    "total": 4294967296,
    "used": 2576980377,
    "free": 1717986918
  },
  "disk": {
    "total": 31457280000,
    "used": 15728640000,
    "free": 15728640000
  }
}
```

### Logs

#### Get Logs

```http
GET /api/logs
Authorization: Bearer <token>
```

Query Parameters:
- `level` - Log level (debug, info, warn, error)
- `limit` - Number of lines (default: 100)
- `since` - Start timestamp

Response:

```json
{
  "logs": [
    {
      "timestamp": "2024-02-14T10:00:00Z",
      "level": "info",
      "message": "Gateway started",
      "source": "gateway"
    }
  ]
}
```

#### Stream Logs (WebSocket)

```typescript
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'logs',
  filter: {
    level: 'info'
  }
}));
```

## Authentication

### JWT Token

The dashboard uses JWT tokens for authentication:

```typescript
// Decode token
const payload = JSON.parse(atob(token.split('.')[1]));

// Check expiration
const isExpired = payload.exp * 1000 < Date.now();
```

### Token Refresh

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

## Types

### Core Types

```typescript
// Agent
interface Agent {
  id: string;
  name: string;
  emoji: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  model: string;
  workspace: string;
  lastActive: string;
  createdAt: string;
}

// Session
interface Session {
  id: string;
  agentId: string;
  key: string;
  status: 'active' | 'archived';
  messageCount: number;
  createdAt: string;
  lastActivity: string;
}

// Message
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tokens?: {
    input: number;
    output: number;
  };
}

// Cron Job
interface CronJob {
  id: string;
  jobId: string;
  name: string;
  schedule: {
    kind: 'at' | 'every' | 'cron';
    at?: string;
    every?: number;
    cron?: string;
    tz?: string;
  };
  sessionTarget: 'main' | 'isolated';
  wakeMode: 'now' | 'next-heartbeat';
  payload: {
    kind: 'systemEvent' | 'agentTurn';
    message?: string;
    systemEvent?: string;
  };
  status: 'pending' | 'running' | 'completed' | 'failed' | 'disabled';
  createdAt: string;
  lastRun?: string;
  nextRun?: string;
  runCount: number;
}

// File
interface File {
  name: string;
  type: 'file' | 'directory';
  size?: number;
  modifiedAt: string;
}

// System Metrics
interface SystemMetrics {
  cpu: {
    usage: number;
    temperature?: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
  };
}
```

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request was invalid",
    "details": {
      "field": "email",
      "issue": "is required"
    }
  }
}
```

### Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `UNAUTHORIZED` | Authentication required | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `INVALID_REQUEST` | Invalid request format | 400 |
| `RATE_LIMITED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Server error | 500 |

---

For more information, see:
- [Configuration Guide](./CONFIGURATION.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [OpenClaw Documentation](https://docs.openclaw.ai)
