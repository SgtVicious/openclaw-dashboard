# Deployment Guide

This guide covers deploying the OpenClaw Dashboard to various environments.

## Table of Contents

- [Raspberry Pi Deployment](#raspberry-pi-deployment)
- [SSH Tunnel Setup](#ssh-tunnel-setup)
- [Docker Deployment](#docker-deployment)
- [GitHub Pages Deployment](#github-pages-deployment)
- [Reverse Proxy Setup](#reverse-proxy-setup)
- [Systemd Service](#systemd-service)

## Raspberry Pi Deployment

### Prerequisites

- Raspberry Pi 3B+ or newer
- Raspberry Pi OS (64-bit recommended)
- Node.js 22+
- OpenClaw installed and running

### Step 1: Install Node.js

```bash
# Using NodeSource
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v22.x.x
npm --version
```

### Step 2: Clone and Build

```bash
# Clone repository
cd ~
git clone https://github.com/yourusername/openclaw-dashboard.git
cd openclaw-dashboard

# Install dependencies
npm ci

# Build for production
npm run build
```

### Step 3: Serve with Static Server

```bash
# Using Python (simple)
cd dist
python3 -m http.server 28471

# Or using serve (Node.js)
npm install -g serve
serve -s dist -l 28471

# Or using nginx (recommended for production)
# See Reverse Proxy Setup section
```

### Step 4: Auto-start on Boot

Create a systemd service (see [Systemd Service](#systemd-service) section).

## SSH Tunnel Setup

Access your Raspberry Pi dashboard securely from your laptop via SSH tunnel.

### One-Time Tunnel

From your laptop:

```bash
# Create tunnel
ssh -L 28471:localhost:28471 pi@raspberrypi.local

# Keep terminal open
# Access dashboard at http://localhost:28471 on laptop
```

### Persistent Tunnel with autossh

```bash
# Install autossh
sudo apt-get install autossh

# Create persistent tunnel
autossh -M 0 -N -L 28471:localhost:28471 pi@raspberrypi.local
```

### SSH Config (Recommended)

Add to `~/.ssh/config` on your laptop:

```
Host openclaw-tunnel
    HostName raspberrypi.local
    User pi
    LocalForward 28471 localhost:28471
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

Then connect with:

```bash
ssh openclaw-tunnel
```

## Docker Deployment

### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 28471

CMD ["nginx", "-g", "daemon off;"]
```

### Build and Run

```bash
# Build image
docker build -t openclaw-dashboard .

# Run container
docker run -d \
  --name openclaw-dashboard \
  -p 28471:28471 \
  -e VITE_GATEWAY_URL=ws://host.docker.internal:18789 \
  openclaw-dashboard
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  dashboard:
    build: .
    container_name: openclaw-dashboard
    ports:
      - "28471:28471"
    environment:
      - VITE_GATEWAY_URL=ws://host.docker.internal:18789
    restart: unless-stopped
    networks:
      - openclaw

networks:
  openclaw:
    external: true
```

Run with:

```bash
docker-compose up -d
```

## GitHub Pages Deployment

The repository includes a GitHub Actions workflow for automatic deployment.

### Setup

1. Go to repository Settings → Pages
2. Source: GitHub Actions
3. Push to main branch triggers deployment

### Manual Deployment

```bash
# Install gh-pages
npm install -g gh-pages

# Deploy
npm run build
gh-pages -d dist
```

### Configuration

Update `vite.config.ts` for GitHub Pages:

```typescript
export default defineConfig({
  base: '/openclaw-dashboard/',
  // ... rest of config
});
```

## Reverse Proxy Setup

### Nginx

Install nginx:

```bash
sudo apt-get update
sudo apt-get install nginx
```

Create config `/etc/nginx/sites-available/openclaw-dashboard`:

```nginx
server {
    listen 28471;
    server_name _;

    root /home/pi/openclaw-dashboard/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # WebSocket proxy to OpenClaw gateway
    location /gateway {
        proxy_pass http://localhost:18789;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/openclaw-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Apache

Create config `/etc/apache2/sites-available/openclaw-dashboard.conf`:

```apache
<VirtualHost *:28471>
    DocumentRoot /home/pi/openclaw-dashboard/dist
    
    <Directory /home/pi/openclaw-dashboard/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Handle client-side routing
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # WebSocket proxy
    ProxyPass /gateway ws://localhost:18789
    ProxyPassReverse /gateway ws://localhost:18789
</VirtualHost>
```

Enable site:

```bash
sudo a2enmod rewrite proxy proxy_http proxy_wstunnel
sudo a2ensite openclaw-dashboard
sudo systemctl restart apache2
```

## Systemd Service

Create service file:

```bash
sudo nano /etc/systemd/system/openclaw-dashboard.service
```

Add content:

```ini
[Unit]
Description=OpenClaw Dashboard
After=network.target openclaw-gateway.service

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/openclaw-dashboard
Environment=NODE_ENV=production
Environment=VITE_GATEWAY_URL=ws://localhost:18789

# Using serve
ExecStart=/usr/bin/serve -s dist -l 28471

# Or using Python
# ExecStart=/usr/bin/python3 -m http.server 28471 --directory dist

# Or using Node directly
# ExecStart=/usr/bin/node server.js

Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable openclaw-dashboard
sudo systemctl start openclaw-dashboard

# Check status
sudo systemctl status openclaw-dashboard

# View logs
sudo journalctl -u openclaw-dashboard -f
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Certbot)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

### Self-Signed Certificate (Local/LAN)

```bash
# Generate certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/openclaw-dashboard.key \
  -out /etc/ssl/certs/openclaw-dashboard.crt

# Update nginx config to use HTTPS
```

## Production Checklist

- [ ] Node.js 22+ installed
- [ ] Dashboard built with `npm run build`
- [ ] Environment variables configured
- [ ] Firewall configured (ufw/iptables)
- [ ] SSL certificate installed (for external access)
- [ ] Systemd service created and enabled
- [ ] Log rotation configured
- [ ] Monitoring/alerts set up
- [ ] Backup strategy in place
- [ ] Documentation updated

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
sudo lsof -i :28471

# Kill process
sudo kill -9 <PID>
```

### Permission Denied

```bash
# Fix permissions
sudo chown -R pi:pi /home/pi/openclaw-dashboard
```

### Service Won't Start

```bash
# Check logs
sudo journalctl -u openclaw-dashboard -n 50

# Test manually
cd /home/pi/openclaw-dashboard
npm run preview
```

### Gateway Connection Failed

1. Verify OpenClaw gateway is running
2. Check firewall rules
3. Verify CORS configuration
4. Check WebSocket URL in settings

## Performance Optimization

### Enable Gzip

Nginx config:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### Enable Browser Caching

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Use CDN (Optional)

For production deployments, consider using a CDN for static assets:

- Cloudflare
- AWS CloudFront
- Vercel Edge Network

---

For more information, see:
- [Configuration Guide](./CONFIGURATION.md)
- [API Reference](./API.md)
- [OpenClaw Documentation](https://docs.openclaw.ai)
