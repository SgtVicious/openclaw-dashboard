# OpenClaw Dashboard

<p align="center">
  <img src="https://raw.githubusercontent.com/openclaw/openclaw/main/assets/logo.png" alt="OpenClaw Dashboard" width="120">
</p>

<p align="center">
  <strong>A comprehensive, production-ready dashboard for OpenClaw - the personal AI assistant gateway</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#documentation">Documentation</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3.4-blue?logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Vite-7.2-blue?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License: MIT">
</p>

---

## Features

### Core Management
- **Agent Management** - Full control over agents and sub-agents with hierarchical visualization
- **Session Management** - View transcripts, manage session history, and monitor active conversations
- **File Workspace** - Edit OpenClaw configuration files (AGENTS.md, SOUL.md, TOOLS.md, etc.) with live preview
- **Cron Jobs** - Schedule and manage automated tasks with support for `at`, `every`, and `cron` schedules

### Monitoring & Observability
- **Real-time Logs** - Live log streaming with filtering and search capabilities
- **System Health** - Monitor your Raspberry Pi or server performance (CPU, memory, temperature)
- **Gateway Status** - Track WebSocket connections, channel health, and API status
- **Usage Metrics** - Token usage, cost tracking, and performance analytics

### Advanced Features
- **Workspace Visualization** - Visual office layout showing agents at work with real-time status
- **Governance & Consensus** - Multi-model voting system for important decisions
- **Agent Collaboration** - Configure inter-agent communication and task delegation
- **Security** - Encrypted API key storage, Argon2id password hashing, session management

### Configuration
- **Theme Support** - Dark, light, and system theme modes
- **Multi-Provider** - Support for Anthropic, OpenAI, and other model providers
- **Channel Management** - WhatsApp, Telegram, Discord, Slack, and more
- **SSH Access** - Secure remote access configuration for LAN deployments

---

## Quick Start

### Prerequisites

- Node.js 22+ 
- OpenClaw instance running (default port 18789)
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/openclaw-dashboard.git
cd openclaw-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deploying to Your Raspberry Pi

```bash
# Build the application
npm run build

# The dist folder can be served with any static file server
# Example using Python
python3 -m http.server 28471 --directory dist

# Or using Node.js serve
npx serve -s dist -l 28471
```

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Dashboard Configuration
VITE_DASHBOARD_PORT=28471
VITE_GATEWAY_URL=ws://localhost:18789

# Security (optional)
VITE_ENCRYPTION_KEY=your-encryption-key
VITE_SESSION_TIMEOUT=3600
```

### OpenClaw Integration

The dashboard connects to your OpenClaw gateway via WebSocket. Ensure your `openclaw.json` allows connections from the dashboard origin:

```json
{
  "gateway": {
    "bind": {
      "host": "0.0.0.0",
      "port": 18789
    },
    "cors": {
      "origins": ["http://localhost:28471", "http://your-pi-ip:28471"]
    }
  }
}
```

### SSH Tunnel Setup (for LAN access)

From your laptop (ROG or other):

```bash
# Create SSH tunnel to Raspberry Pi
ssh -L 28471:localhost:28471 pi@raspberrypi.local

# Now access dashboard at http://localhost:28471 on your laptop
```

---

## Screenshots

<p align="center">
  <em>Dashboard screenshots will be added here</em>
</p>

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenClaw Dashboard                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Agents  │ │ Sessions │ │ Workspace│ │ Cron Jobs│       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │   Logs   │ │  System  │ │Settings  │ │Governance│       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    OpenClaw Gateway                          │
│                      (Port 18789)                            │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
    ┌──────────┐       ┌──────────┐       ┌──────────┐
    │ WhatsApp │       │ Telegram │       │ Discord  │
    └──────────┘       └──────────┘       └──────────┘
```

---

## Feature Coverage

Based on comprehensive audit of [OpenClaw Documentation](https://docs.openclaw.ai):

| Category | Coverage | Status |
|----------|----------|--------|
| Agent Management | 85% | ✅ Strong |
| Session Management | 85% | ✅ Strong |
| Cron Jobs | 95% | ✅ Excellent |
| File/Workspace | 90% | ✅ Strong |
| Gateway Operations | 80% | ✅ Good |
| Channel Integration | 30% | 🚧 In Progress |
| Model Providers | 40% | 🚧 In Progress |
| Skills Management | 20% | 📋 Planned |

See [FEATURE_AUDIT.md](./FEATURE_AUDIT.md) for detailed coverage analysis.

---

## Documentation

- [Feature Audit](./FEATURE_AUDIT.md) - Comprehensive feature coverage analysis
- [Configuration Guide](./docs/CONFIGURATION.md) - Detailed configuration options
- [API Reference](./docs/API.md) - Dashboard API documentation
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment instructions
- [Contributing](./CONTRIBUTING.md) - Contribution guidelines

---

## Roadmap

### Phase 1: Core (Complete) ✅
- [x] Dashboard with KPIs and monitoring
- [x] Agent management and visualization
- [x] Session transcripts and history
- [x] File workspace editor
- [x] Cron job management
- [x] System health monitoring

### Phase 2: Enhancement (In Progress) 🚧
- [ ] Channel QR pairing (WhatsApp, Telegram)
- [ ] Extended model provider support
- [ ] Skills marketplace integration
- [ ] Advanced session search

### Phase 3: Advanced (Planned) 📋
- [ ] Multi-gateway support
- [ ] Node/device management
- [ ] Automation workflow builder
- [ ] Mobile app companion

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Fork and clone
git clone https://github.com/yourusername/openclaw-dashboard.git
cd openclaw-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Run linter
npm run lint

# Type check
npm run typecheck
```

---

## Security

- **API Keys**: Encrypted with AES-256-GCM
- **Passwords**: Hashed with Argon2id
- **Sessions**: JWT with RS256 signing
- **CORS**: Configurable origin allowlist

Report security vulnerabilities to [security@openclaw.ai](mailto:security@openclaw.ai)

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

## Acknowledgments

- [OpenClaw](https://openclaw.ai) - The AI that actually does things
- [shadcn/ui](https://ui.shadcn.com) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [React](https://react.dev) - UI library
- [Vite](https://vitejs.dev) - Build tool

---

<p align="center">
  <strong>Built with ❤️ for the OpenClaw community</strong>
</p>

<p align="center">
  <a href="https://openclaw.ai">🦞 OpenClaw</a> •
  <a href="https://docs.openclaw.ai">Documentation</a> •
  <a href="https://github.com/openclaw/openclaw">GitHub</a>
</p>
