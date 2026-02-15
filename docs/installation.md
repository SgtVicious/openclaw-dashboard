# Installation Guide

This guide will help you install Mission Control on your local machine or server.

## Prerequisites

Before installing Mission Control, ensure you have the following installed:

### Required Software

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) 
- **Git**

### Database Requirements

- **Development**: SQLite (included)
- **Production**: PostgreSQL 14+ (recommended)

### Optional Software

- **Docker** (for containerized deployment)
- **Redis** (for caching and real-time features)

## System Requirements

### Minimum Requirements

- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 10GB free space
- **Network**: Internet connection for dependencies

### Recommended Requirements

- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 50GB+ free space
- **Network**: Stable internet connection

## Installation Methods

### Method 1: Quick Install (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mission-control.git
   cd mission-control
   ```

2. **Run the installation script**
   ```bash
   chmod +x scripts/install.sh
   ./scripts/install.sh
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

### Method 2: Manual Installation

1. **Install Node.js**
   
   **macOS (using Homebrew)**
   ```bash
   brew install node
   ```
   
   **Ubuntu/Debian**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
   
   **Windows**
   - Download from [nodejs.org](https://nodejs.org/)
   - Run the installer
   - Restart your computer

2. **Install PostgreSQL** (for production)
   
   **macOS**
   ```bash
   brew install postgresql
   brew services start postgresql
   ```
   
   **Ubuntu/Debian**
   ```bash
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```
   
   **Windows**
   - Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - Run the installer

3. **Clone and setup the repository**
   ```bash
   git clone https://github.com/yourusername/mission-control.git
   cd mission-control
   npm install
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

5. **Setup database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

6. **Start the application**
   ```bash
   npm run dev
   ```

### Method 3: Docker Installation

1. **Install Docker**
   - Follow instructions at [docker.com](https://docker.com)

2. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mission-control.git
   cd mission-control
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Open http://localhost:3000

## Environment Configuration

### Basic Configuration

Create a `.env.local` file in the root directory:

```env
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"
# For production: DATABASE_URL="postgresql://user:password@localhost:5432/mission_control"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Optional: OAuth Providers
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### Production Configuration

For production deployments, use these additional settings:

```env
# Production
NODE_ENV=production
NEXTAUTH_URL="https://your-domain.com"

# Security
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Database
DATABASE_URL="postgresql://user:password@host:5432/mission_control"

# Optional: Redis
REDIS_URL="redis://localhost:6379"

# Optional: Monitoring
SENTRY_DSN="your-sentry-dsn"
```

## Database Setup

### SQLite (Development)

SQLite is automatically configured for development. No additional setup required.

### PostgreSQL (Production)

1. **Create database and user**
   ```sql
   CREATE DATABASE mission_control;
   CREATE USER mission_control WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE mission_control TO mission_control;
   ```

2. **Update environment variables**
   ```env
   DATABASE_URL="postgresql://mission_control:your_password@localhost:5432/mission_control"
   ```

3. **Run migrations**
   ```bash
   npm run db:push
   ```

## Verification

### Check Installation

1. **Verify Node.js installation**
   ```bash
   node --version
   npm --version
   ```

2. **Verify database connection**
   ```bash
   npm run db:studio
   ```

3. **Check application status**
   ```bash
   curl http://localhost:3000/api/health
   ```

### Test Features

1. **Access the application**
   - Open http://localhost:3000
   - Login with demo credentials

2. **Test key features**
   - Dashboard creation
   - Metric visualization
   - User authentication
   - Real-time updates

## Troubleshooting Installation

### Common Issues

**Node.js Version Issues**
```bash
# Check version
node --version

# Update using nvm
nvm install 18
nvm use 18
```

**Permission Errors**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Or use npx
npx npm install
```

**Database Connection Errors**
```bash
# Check database status
sudo systemctl status postgresql

# Test connection
psql $DATABASE_URL
```

**Port Conflicts**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process or use different port
npm run dev -- --port 3001
```

### Getting Help

If you encounter issues:

1. **Check logs**
   ```bash
   npm run dev 2>&1 | tee install.log
   ```

2. **Review documentation**
   - [Troubleshooting Guide](troubleshooting.md)
   - [GitHub Issues](https://github.com/yourusername/mission-control/issues)

3. **Community support**
   - [Discord Community](https://discord.gg/mission-control)
   - [Stack Overflow](https://stackoverflow.com/questions/tagged/mission-control)

## Next Steps

After successful installation:

1. **Configure authentication** (optional)
2. **Set up integrations** (optional)
3. **Invite team members**
4. **Create your first dashboard**
5. **Explore AI insights**

## Uninstallation

To remove Mission Control:

```bash
# Stop the application
Ctrl+C (if running)

# Remove the directory
rm -rf mission-control

# Remove database (if PostgreSQL)
dropdb mission_control

# Remove Docker containers (if using Docker)
docker-compose down -v
```

## Security Considerations

### Development

- Use strong passwords for demo accounts
- Keep environment variables secure
- Don't commit sensitive data

### Production

- Use environment-specific configurations
- Enable SSL/TLS
- Set up proper firewall rules
- Regular security updates

## Performance Optimization

### Development

- Enable hot reload
- Use development database
- Disable unnecessary features

### Production

- Use production database
- Enable caching
- Set up CDN
- Monitor performance

## Support

For installation support:

- 📧 Email: support@mission-control.dev
- 💬 Discord: [Join our community](https://discord.gg/mission-control)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/mission-control/issues)

---

**Next**: Check out the [Getting Started Guide](../README.md) to begin using Mission Control!