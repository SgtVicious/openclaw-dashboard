# Configuration Guide

This guide covers all configuration options for the OpenClaw Dashboard.

## Table of Contents

- [Environment Variables](#environment-variables)
- [Dashboard Settings](#dashboard-settings)
- [OpenClaw Integration](#openclaw-integration)
- [Security Configuration](#security-configuration)
- [Channel Configuration](#channel-configuration)
- [Model Provider Configuration](#model-provider-configuration)

## Environment Variables

Create a `.env` file in the project root:

```env
# Dashboard Configuration
VITE_DASHBOARD_PORT=28471
VITE_GATEWAY_URL=ws://localhost:18789
VITE_GATEWAY_HTTP=http://localhost:18789

# Security
VITE_ENCRYPTION_KEY=your-secure-encryption-key
VITE_SESSION_TIMEOUT=3600
VITE_MAX_LOGIN_ATTEMPTS=5

# Features
VITE_ENABLE_EXPERIMENTAL=false
VITE_DEBUG_MODE=false
```

### Variable Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_DASHBOARD_PORT` | 28471 | Port the dashboard runs on |
| `VITE_GATEWAY_URL` | ws://localhost:18789 | WebSocket URL for OpenClaw gateway |
| `VITE_GATEWAY_HTTP` | http://localhost:18789 | HTTP URL for OpenClaw gateway |
| `VITE_ENCRYPTION_KEY` | - | Key for encrypting sensitive data |
| `VITE_SESSION_TIMEOUT` | 3600 | Session timeout in seconds |
| `VITE_MAX_LOGIN_ATTEMPTS` | 5 | Maximum failed login attempts |
| `VITE_ENABLE_EXPERIMENTAL` | false | Enable experimental features |
| `VITE_DEBUG_MODE` | false | Enable debug logging |

## Dashboard Settings

Access settings via the Settings page in the dashboard.

### Appearance

- **Theme**: Dark, Light, or System
- **Language**: Currently English only (more coming)
- **Timezone**: Your local timezone
- **Date Format**: Preferred date format
- **Time Format**: 12h or 24h

### Ports

Configure all service ports:

| Service | Default | Description |
|---------|---------|-------------|
| Dashboard | 28471 | This dashboard |
| Gateway | 18789 | OpenClaw gateway WebSocket |
| Canvas | 18793 | Agent-editable HTML |
| WebSocket | 18790 | Alternative WebSocket |
| API | 18791 | REST API endpoint |

### Security

- **Session Timeout**: Auto-logout after inactivity
- **MFA/2FA**: Two-factor authentication
- **Password Requirements**: Minimum length, complexity
- **CORS Origins**: Allowed origins for API access
- **Rate Limiting**: Request throttling

### SSH Settings

For remote access via SSH tunnel:

- **SSH Port**: 22 (or custom)
- **Authentication**: Password, Key, or Both
- **Allowed Users**: User whitelist
- **Key Path**: SSH private key location

### Notifications

- **Email Alerts**: SMTP configuration
- **Webhook Notifications**: Custom webhooks
- **Alert Conditions**: Error rates, system health

### Backup/Restore

- **Automatic Backup**: Schedule backups
- **Backup Location**: Local or cloud storage
- **Restore**: Point-in-time recovery

## OpenClaw Integration

### Gateway Configuration

Ensure your `~/.openclaw/openclaw.json` allows dashboard connections:

```json
{
  "gateway": {
    "bind": {
      "host": "0.0.0.0",
      "port": 18789
    },
    "cors": {
      "origins": [
        "http://localhost:28471",
        "http://localhost:5173",
        "http://your-pi-ip:28471"
      ]
    },
    "reload": {
      "mode": "hybrid"
    }
  }
}
```

### Session Configuration

```json
{
  "session": {
    "mainKey": "main",
    "dmScope": "per-channel-peer",
    "identityLinks": {
      "whatsapp:+1234567890": "user-alice",
      "telegram:@alice": "user-alice"
    },
    "pruning": {
      "enabled": true,
      "maxAge": "30d"
    }
  }
}
```

### Agent Configuration

```json
{
  "agents": {
    "defaults": {
      "workspace": "~/.openclaw/workspace",
      "model": {
        "primary": "anthropic/claude-opus-4-6"
      },
      "sandbox": {
        "enabled": false,
        "workspaceRoot": "~/.openclaw/sandbox"
      },
      "compaction": {
        "memoryFlush": true
      }
    },
    "list": [
      {
        "id": "main",
        "name": "Chief of Staff",
        "emoji": "🦞"
      }
    ]
  }
}
```

## Security Configuration

### Authentication

The dashboard uses JWT-based authentication:

1. **Password Hashing**: Argon2id
2. **API Key Encryption**: AES-256-GCM
3. **Session Tokens**: RS256 signed JWTs
4. **Token Expiry**: Configurable (default 1 hour)

### Setting Up Authentication

1. First login: Use default credentials (configurable)
2. Change password immediately
3. Configure MFA (optional but recommended)
4. Store API keys securely

### API Key Management

```typescript
// Store encrypted API key
const encryptedKey = await encryptApiKey(provider, apiKey);

// Retrieve and decrypt
const apiKey = await decryptApiKey(provider);
```

## Channel Configuration

### WhatsApp (Baileys)

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "pairing": {
        "mode": "qr"
      }
    }
  }
}
```

Setup via dashboard:
1. Go to Settings → Channels
2. Enable WhatsApp
3. Scan QR code with phone
4. Verify connection

### Telegram

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "YOUR_BOT_TOKEN"
    }
  }
}
```

Setup via dashboard:
1. Create bot with @BotFather
2. Copy bot token
3. Paste in Settings → Channels → Telegram
4. Test connection

### Discord

```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "botToken": "YOUR_BOT_TOKEN",
      "intents": ["Guilds", "GuildMessages", "DirectMessages"]
    }
  }
}
```

### Slack

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "appToken": "xapp-...",
      "botToken": "xoxb-..."
    }
  }
}
```

## Model Provider Configuration

### Anthropic (Claude)

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-opus-4-6"
      }
    }
  },
  "providers": {
    "anthropic": {
      "apiKey": "sk-ant-..."
    }
  }
}
```

### OpenAI

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "openai/gpt-4"
      }
    }
  },
  "providers": {
    "openai": {
      "apiKey": "sk-..."
    }
  }
}
```

### Model Failover

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-opus-4-6",
        "fallback": "openai/gpt-4"
      }
    }
  }
}
```

## Advanced Configuration

### Custom Skill Directories

```json
{
  "skills": {
    "load": {
      "extraDirs": ["/path/to/custom/skills"]
    }
  }
}
```

### Tool Configuration

```json
{
  "tools": {
    "profile": "full",
    "allow": ["browser", "exec", "web_search"],
    "deny": []
  }
}
```

### Memory Configuration

```json
{
  "plugins": {
    "slots": {
      "memory": "memory-core"
    }
  },
  "memory": {
    "embedding": {
      "provider": "openai",
      "model": "text-embedding-3-small"
    }
  }
}
```

### Cron Job Defaults

```json
{
  "cron": {
    "defaults": {
      "wakeMode": "now",
      "sessionTarget": "isolated",
      "delivery": {
        "mode": "announce"
      }
    }
  }
}
```

## Troubleshooting

### Dashboard Won't Connect to Gateway

1. Check gateway is running: `openclaw gateway status`
2. Verify CORS origins include dashboard URL
3. Check firewall rules
4. Verify WebSocket URL is correct

### Authentication Issues

1. Clear browser localStorage
2. Check session timeout settings
3. Verify encryption key is set
4. Check for JavaScript errors in console

### Channel Connection Failures

1. Verify bot tokens are correct
2. Check channel-specific logs
3. Ensure required intents are enabled
4. Verify network connectivity

## Environment-Specific Configs

### Development

```env
VITE_GATEWAY_URL=ws://localhost:18789
VITE_DEBUG_MODE=true
VITE_ENABLE_EXPERIMENTAL=true
```

### Production (Raspberry Pi)

```env
VITE_GATEWAY_URL=ws://localhost:18789
VITE_DASHBOARD_PORT=28471
VITE_DEBUG_MODE=false
VITE_SESSION_TIMEOUT=3600
```

### Production (Remote Server)

```env
VITE_GATEWAY_URL=wss://your-domain.com/gateway
VITE_DASHBOARD_PORT=443
VITE_DEBUG_MODE=false
VITE_ENCRYPTION_KEY=your-production-key
```

---

For more information, see:
- [OpenClaw Documentation](https://docs.openclaw.ai)
- [Deployment Guide](./DEPLOYMENT.md)
- [API Reference](./API.md)
