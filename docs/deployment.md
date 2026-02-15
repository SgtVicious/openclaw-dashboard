# Deployment Guide

## Vercel Deployment (Recommended)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mission-control)

### Manual Deployment Steps

1. **Fork the Repository**
   ```bash
   # Fork the repository on GitHub, then clone your fork
   git clone https://github.com/yourusername/mission-control.git
   cd mission-control
   ```

2. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/mission-control.git
   git push -u origin main
   ```

3. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

4. **Environment Variables**
   Add these to your Vercel project settings:
   ```
   DATABASE_URL=your_database_url
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your_secret_key
   ```

### Environment Setup

Create a `.env.production` file:
```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Optional: OAuth Providers
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Optional: AI Integration
OPENAI_API_KEY="sk-..."

# Optional: Redis (for caching)
REDIS_URL="redis://your-redis-url"
```

## Docker Deployment

### Quick Start with Docker Compose

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mission-control.git
   cd mission-control
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Open http://localhost:3000
   - Default credentials: admin@mission-control.dev / demo123

### Production Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t mission-control .
   ```

2. **Run with external database**
   ```bash
   docker run -d \
     --name mission-control \
     -p 3000:3000 \
     -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
     -e NEXTAUTH_URL="https://your-domain.com" \
     -e NEXTAUTH_SECRET="your-secret" \
     mission-control
   ```

### Docker Compose for Production

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - REDIS_URL=${REDIS_URL}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Self-Hosted Deployment

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Redis (optional, for caching)
- PM2 (for process management)
- Nginx (for reverse proxy)

### Step-by-Step Installation

1. **Install Node.js and dependencies**
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

2. **Set up PostgreSQL**
   ```bash
   sudo apt-get install postgresql postgresql-contrib
   sudo -u postgres psql
   
   # In PostgreSQL prompt:
   CREATE DATABASE mission_control;
   CREATE USER mission_control WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE mission_control TO mission_control;
   \q
   ```

3. **Clone and setup application**
   ```bash
   git clone https://github.com/yourusername/mission-control.git
   cd mission-control
   npm install
   npm run build
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with production values
   ```

5. **Database setup**
   ```bash
   npm run db:push
   npm run db:seed
   ```

6. **Start with PM2**
   ```bash
   pm2 start npm --name "mission-control" -- start
   pm2 startup
   pm2 save
   ```

7. **Nginx configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       location /api/ {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

### SSL with Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Cloud Provider Deployment

### AWS Deployment

1. **Using AWS Elastic Beanstalk**
   ```bash
   # Install EB CLI
   pip install awsebcli
   
   # Initialize EB
   eb init -p node.js mission-control
   
   # Create environment
   eb create production
   
   # Deploy
   eb deploy
   ```

2. **Using AWS ECS with Fargate**
   - Build and push Docker image to ECR
   - Create ECS cluster and task definition
   - Set up Application Load Balancer
   - Configure RDS for PostgreSQL
   - Deploy service

### Google Cloud Platform

1. **Using Google App Engine**
   ```yaml
   # app.yaml
   runtime: nodejs18
   env_variables:
     DATABASE_URL: "postgresql://user:pass@/db?host=/cloudsql/project:region:instance"
     NEXTAUTH_URL: "https://your-project.appspot.com"
   ```

2. **Using Google Cloud Run**
   ```bash
   gcloud run deploy mission-control \
     --image gcr.io/your-project/mission-control \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### Azure Deployment

1. **Using Azure Container Instances**
   ```bash
   az container create \
     --resource-group myResourceGroup \
     --name mission-control \
     --image your-registry/mission-control:latest \
     --dns-name-label mission-control \
     --ports 3000
   ```

2. **Using Azure App Service**
   - Create App Service Plan
   - Deploy from GitHub Actions
   - Configure PostgreSQL connection

## Monitoring and Logging

### Application Monitoring

1. **Sentry Integration**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Add to next.config.js**
   ```javascript
   const { withSentryConfig } = require('@sentry/nextjs');
   
   module.exports = withSentryConfig({
     // your existing config
   });
   ```

### Server Monitoring

1. **PM2 Monitoring**
   ```bash
   pm2 monitor
   ```

2. **Log Management**
   ```bash
   pm2 install pm2-logrotate
   ```

### Database Monitoring

- Use PostgreSQL built-in monitoring
- Consider tools like pgAdmin or Datadog
- Set up alerts for slow queries

## Backup and Recovery

### Database Backups

```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

### Application Backups

- Regular filesystem backups
- Docker image versioning
- Configuration backup

## Performance Optimization

### Database Optimization

- Index optimization
- Query performance tuning
- Connection pooling

### Application Optimization

- Enable gzip compression
- Implement caching strategies
- Use CDN for static assets

### Scaling Strategies

- Horizontal scaling with load balancers
- Database read replicas
- Redis clustering

## Security Considerations

### Environment Security

- Use strong passwords
- Enable SSL/TLS
- Regular security updates

### Application Security

- Input validation
- SQL injection prevention
- XSS protection

### Infrastructure Security

- Firewall configuration
- Regular security audits
- Vulnerability scanning

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check connection string
   - Verify network access
   - Check credentials

2. **Build Failures**
   - Check Node.js version
   - Clear npm cache
   - Check dependencies

3. **Performance Issues**
   - Monitor resource usage
   - Check database queries
   - Analyze logs

### Support

For deployment issues:
- Check the [troubleshooting guide](../docs/troubleshooting.md)
- Open an issue on GitHub
- Contact support@mission-control.dev

## Next Steps

After successful deployment:
1. Set up monitoring and alerts
2. Configure backup procedures
3. Set up CI/CD pipeline
4. Document your deployment
5. Train your team
6. Plan for scaling