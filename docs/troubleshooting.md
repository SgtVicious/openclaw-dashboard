# Troubleshooting Guide

This guide helps you resolve common issues with Mission Control.

## Installation Issues

### Node.js Version Issues

**Problem**: `Error: Node.js version must be >= 18.0.0`

**Solution**:
```bash
# Check your Node.js version
node --version

# If below 18, upgrade Node.js
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or download from nodejs.org
```

### NPM Installation Failures

**Problem**: `npm install` fails with permission errors

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Try installing with different permissions
sudo npm install

# Or use npx
npx npm install
```

**Problem**: `npm install` fails with network errors

**Solution**:
```bash
# Use a different registry
npm install --registry https://registry.npm.taobao.org/

# Or configure npm to use a proxy
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

### Database Connection Issues

**Problem**: `Error: Database connection failed`

**Solution**:
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL if not running
sudo systemctl start postgresql

# Check database URL in .env file
echo $DATABASE_URL

# Test database connection
psql $DATABASE_URL
```

**Problem**: `Error: Permission denied for database`

**Solution**:
```sql
-- Connect to PostgreSQL as superuser
sudo -u postgres psql

-- Create database and user
CREATE DATABASE mission_control;
CREATE USER mission_control WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE mission_control TO mission_control;
```

## Development Issues

### Port Already in Use

**Problem**: `Error: Port 3000 is already in use`

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
npm run dev -- --port 3001
```

### Hot Reload Not Working

**Problem**: Changes don't trigger hot reload

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Restart development server
npm run dev

# Check for file watching limits (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### TypeScript Errors

**Problem**: `Type 'X' is not assignable to type 'Y'`

**Solution**:
```bash
# Check TypeScript version
npm list typescript

# Update TypeScript
npm install typescript@latest --save-dev

# Check for type conflicts
npm run type-check
```

**Problem**: `Cannot find module '@/components/...'`

**Solution**:
```bash
# Check tsconfig.json paths
cat tsconfig.json | grep paths -A 10

# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

## Authentication Issues

### NextAuth Configuration

**Problem**: `Error: NEXTAUTH_URL is not defined`

**Solution**:
```bash
# Add to .env.local
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Generate a secure secret
openssl rand -base64 32
```

**Problem**: OAuth providers not working

**Solution**:
```bash
# Check OAuth credentials in .env
GITHUB_CLIENT_ID="your_client_id"
GITHUB_CLIENT_SECRET="your_client_secret"

# Ensure callback URLs are configured in GitHub/Google
# http://localhost:3000/api/auth/callback/github
```

### Session Issues

**Problem**: `Error: Session not found`

**Solution**:
```bash
# Clear browser cookies
# Check database session table
npm run db:studio

# Restart development server
npm run dev
```

## Database Issues

### Prisma Migration Errors

**Problem**: `Error: P3005 The database schema is not empty`

**Solution**:
```bash
# Reset database (⚠️ This will delete all data)
npm run db:reset

# Or manually drop and recreate
dropdb mission_control
createdb mission_control
npm run db:push
```

**Problem**: `Error: P1001 Can't reach database server`

**Solution**:
```bash
# Check database server status
sudo systemctl status postgresql

# Check connection string
psql $DATABASE_URL

# Verify network connectivity
telnet localhost 5432
```

### Data Seeding Issues

**Problem**: `Error: Unique constraint failed`

**Solution**:
```bash
# Reset database and re-seed
npm run db:reset
npm run db:seed

# Or skip existing data
npm run db:seed -- --skip-existing
```

## Build and Deployment Issues

### Build Failures

**Problem**: `Error: Build failed with exit code 1`

**Solution**:
```bash
# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint

# Clear build cache
rm -rf .next
rm -rf node_modules/.cache

# Try building again
npm run build
```

**Problem**: `Error: Module not found`

**Solution**:
```bash
# Check import paths
# Ensure all dependencies are installed
npm install

# Check case sensitivity (Linux/macOS)
ls -la src/components/
```

### Docker Issues

**Problem**: `Error: Cannot connect to Docker daemon`

**Solution**:
```bash
# Start Docker service
sudo systemctl start docker

# Add user to docker group
sudo usermod -aG docker $USER
# Log out and back in
```

**Problem**: `Error: Docker build failed`

**Solution**:
```bash
# Check Dockerfile syntax
cat Dockerfile

# Build with no cache
docker build --no-cache .

# Check Docker logs
docker logs <container_id>
```

## Runtime Issues

### Memory Issues

**Problem**: `JavaScript heap out of memory`

**Solution**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Or in package.json scripts
"scripts": {
  "dev": "node --max-old-space-size=4096 node_modules/.bin/next dev"
}
```

### Performance Issues

**Problem**: Slow page loads

**Solution**:
```bash
# Check for large bundles
npm run build
npm run analyze

# Optimize images
# Use next/image component
# Enable image optimization
```

**Problem**: High CPU usage

**Solution**:
```bash
# Check for infinite loops
# Review useEffect dependencies
# Check for unnecessary re-renders
# Use React DevTools Profiler
```

## API Issues

### CORS Errors

**Problem**: `Error: CORS policy blocked request`

**Solution**:
```javascript
// In next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ]
      }
    ]
  }
}
```

### Rate Limiting

**Problem**: `Error: Too many requests`

**Solution**:
```bash
# Implement rate limiting
# Use Redis for distributed rate limiting
# Add delays between requests
# Implement request queuing
```

## Environment Issues

### Environment Variables

**Problem**: `Error: Environment variable not found`

**Solution**:
```bash
# Check .env.local exists
cp .env.example .env.local

# Verify variable names
grep -r "process.env" src/

# Restart development server
npm run dev
```

### Path Issues

**Problem**: `Error: Cannot find module`

**Solution**:
```bash
# Check file paths (case-sensitive on Linux/macOS)
ls -la src/components/

# Check TypeScript paths in tsconfig.json
# Verify module resolution
```

## Testing Issues

### Test Failures

**Problem**: `Error: Test suite failed to run`

**Solution**:
```bash
# Check test environment
npm run test -- --env=jsdom

# Update test dependencies
npm update @testing-library/react

# Clear Jest cache
npm run test -- --clearCache
```

### Coverage Issues

**Problem**: Low test coverage

**Solution**:
```bash
# Generate coverage report
npm run test:coverage

# Check uncovered files
open coverage/lcov-report/index.html

# Add tests for uncovered code
```

## Getting Help

### Debug Information

When reporting issues, include:

```bash
# System information
node --version
npm --version
uname -a

# Application logs
npm run dev 2>&1 | tee debug.log

# Database information
npm run db:studio
```

### Community Support

- **GitHub Issues**: Report bugs and request features
- **Discord**: Join our community for real-time help
- **Documentation**: Check the docs for common solutions
- **Stack Overflow**: Tag questions with `mission-control`

### Professional Support

For enterprise support:
- Email: support@mission-control.dev
- Phone: +1-555-MISSION
- Enterprise SLA available

## Prevention Tips

### Development Best Practices

1. **Use version managers** (nvm, n)
2. **Keep dependencies updated**
3. **Use consistent Node.js versions**
4. **Test in different environments**
5. **Use environment variables for configuration**

### Deployment Best Practices

1. **Test builds locally before deploying**
2. **Use CI/CD pipelines**
3. **Monitor application health**
4. **Set up proper logging**
5. **Have rollback procedures ready**

### Monitoring

Set up monitoring to catch issues early:
- Application performance monitoring
- Error tracking (Sentry)
- Log aggregation
- Health checks
- Alert systems

Remember: Most issues can be prevented with proper setup, regular maintenance, and good development practices.