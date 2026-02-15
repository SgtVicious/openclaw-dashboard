# Mission Control

A modern, AI-driven business operations management dashboard built with React and Next.js. Deploy instantly on Vercel or self-host with Docker.

## 🚀 Features

- **Real-time Operations Dashboard** - Monitor key business metrics and KPIs
- **AI-Powered Insights** - Intelligent recommendations and anomaly detection
- **Team Collaboration** - Integrated communication and task management
- **Customizable Widgets** - Flexible dashboard components
- **API Integration** - RESTful endpoints for real-time data
- **Multi-tenant Support** - Scalable architecture for teams
- **Dark/Light Themes** - Modern UI with theme switching
- **Mobile Responsive** - Works seamlessly on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (with SQLite for development)
- **Authentication**: NextAuth.js
- **Deployment**: Vercel (primary), Docker (self-hosted)
- **Styling**: Tailwind CSS, Radix UI Components
- **Charts**: Recharts for data visualization
- **Real-time**: WebSocket support via Socket.io

## 📦 Quick Start

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mission-control)

1. Click the button above
2. Configure your environment variables
3. Deploy in under 2 minutes

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/mission-control.git
cd mission-control

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

### Docker Setup

```bash
# Build and run with Docker
docker-compose up -d

# Access the application
open http://localhost:3000
```

## 📚 Documentation

- [Installation Guide](docs/installation.md)
- [API Documentation](docs/api-endpoints.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Demo Data Setup](docs/demo-data.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contributing Steps

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](https://docs.mission-control.dev)
- 🐛 [Issue Tracker](https://github.com/yourusername/mission-control/issues)
- 💬 [Discord Community](https://discord.gg/mission-control)
- 📧 [Email Support](support@mission-control.dev)

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by business intelligence tools
- Community-driven development
- Open-source friendly

---

**Star ⭐ this repository if you find it helpful!**