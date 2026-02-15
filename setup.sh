#!/bin/bash

# Mission Control Setup Script
# This script sets up the Mission Control dashboard for both local development and production deployment

set -e

echo "🚀 Mission Control Setup Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_nodejs() {
    print_status "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
        
        # Check if version is 16+
        if [[ "${NODE_VERSION#v}" < "16" ]]; then
            print_error "Node.js version 16+ is required. Current version: $NODE_VERSION"
            exit 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 16+ first."
        print_status "Visit: https://nodejs.org/"
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ -f "package.json" ]; then
        npm install
        print_success "Dependencies installed successfully"
    else
        print_error "package.json not found. Are you in the correct directory?"
        exit 1
    fi
}

# Create environment file
create_env_file() {
    print_status "Creating environment configuration..."
    
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# Mission Control Environment Variables
VITE_APP_TITLE=Mission Control
VITE_APP_VERSION=1.0.0
VITE_API_URL=http://localhost:3000
VITE_ENABLE_ANALYTICS=true
EOF
        print_success "Environment file created (.env)"
    else
        print_warning "Environment file already exists (.env)"
    fi
}

# Setup local network access
setup_network_access() {
    print_status "Setting up local network access..."
    
    # Get local IP address
    if command -v ip &> /dev/null; then
        LOCAL_IP=$(ip route get 1 | awk '{print $7; exit}')
    elif command -v ifconfig &> /dev/null; then
        LOCAL_IP=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -1)
    else
        LOCAL_IP="YOUR_LOCAL_IP"
    fi
    
    print_success "Local IP detected: $LOCAL_IP"
    print_status "You can access the dashboard at: http://$LOCAL_IP:3000"
}

# Create systemd service for Raspberry Pi
create_systemd_service() {
    print_status "Creating systemd service for auto-start..."
    
    cat > mission-control.service << EOF
[Unit]
Description=Mission Control Dashboard
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/npm run dev
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    print_success "Systemd service file created (mission-control.service)"
    print_status "To install the service, run: sudo cp mission-control.service /etc/systemd/system/"
    print_status "Then: sudo systemctl enable mission-control && sudo systemctl start mission-control"
}

# Create startup script
create_startup_script() {
    print_status "Creating startup script..."
    
    cat > start-mission-control.sh << 'EOF'
#!/bin/bash

# Mission Control Startup Script

cd "$(dirname "$0")"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed or not in PATH"
    exit 1
fi

# Start the development server
echo "Starting Mission Control Dashboard..."
echo "Access the dashboard at: http://localhost:3000"
echo "For LAN access, use: http://YOUR_RASPBERRY_PI_IP:3000"
echo ""

npm run dev -- --host 0.0.0.0 --port 3000
EOF
    
    chmod +x start-mission-control.sh
    print_success "Startup script created (start-mission-control.sh)"
}

# Create deployment guide
create_deployment_guide() {
    print_status "Creating deployment guide..."
    
    cat > DEPLOYMENT.md << 'EOF'
# Mission Control Deployment Guide

## 🏠 Local Development Setup

### Quick Start
```bash
# Start the development server
npm run dev

# Access the dashboard
# Local: http://localhost:3000
# LAN: http://YOUR_RASPBERRY_PI_IP:3000
```

### Local Network Access
To access from other devices on your network:

1. **Find your Raspberry Pi IP address:**
   ```bash
   hostname -I
   ```

2. **Start the server with LAN access:**
   ```bash
   npm run dev -- --host 0.0.0.0 --port 3000
   ```

3. **Access from any device:**
   - Open browser and go to: `http://YOUR_RASPBERRY_PI_IP:3000`
   - Replace `YOUR_RASPBERRY_PI_IP` with your actual IP address

## 🚀 Production Deployment

### Vercel Deployment (Recommended)
1. **Connect GitHub to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/in with GitHub
   - Click "New Project"

2. **Import your repository:**
   - Select your Mission Control repository
   - Vercel will auto-detect settings
   - Click "Deploy"

3. **One-Click Deploy:**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/mission-control)

### Self-Hosting Options

#### Option 1: Static File Hosting
```bash
# Build for production
npm run build

# Serve static files
npm run preview
```

#### Option 2: Node.js Server
```bash
# Install a simple HTTP server
npm install -g serve

# Build and serve
npm run build
serve -s dist -p 8080
```

#### Option 3: Docker (Advanced)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔧 Raspberry Pi Auto-Start Setup

### Method 1: Systemd Service (Recommended)
```bash
# Copy service file
sudo cp mission-control.service /etc/systemd/system/

# Enable and start service
sudo systemctl enable mission-control
sudo systemctl start mission-control

# Check status
sudo systemctl status mission-control
```

### Method 2: Crontab
```bash
# Edit crontab
crontab -e

# Add this line (starts on boot)
@reboot cd /path/to/mission-control && npm run dev -- --host 0.0.0.0 --port 3000
```

### Method 3: Desktop Autostart
```bash
# Create autostart directory
mkdir -p ~/.config/autostart

# Create desktop entry
cat > ~/.config/autostart/mission-control.desktop << EOL
[Desktop Entry]
Type=Application
Name=Mission Control
Exec=/home/pi/start-mission-control.sh
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
EOL
```

## 🔒 Security Best Practices

### Production Security
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up proper CORS headers
- [ ] Configure CSP headers
- [ ] Implement rate limiting
- [ ] Input validation and sanitization
- [ ] Environment variable protection

### Local Network Security
- [ ] Use strong WiFi password
- [ ] Consider VPN for remote access
- [ ] Firewall configuration
- [ ] Regular security updates
- [ ] Network segmentation

### Raspberry Pi Security
```bash
# Change default password
passwd

# Update system
sudo apt update && sudo apt upgrade -y

# Install firewall
sudo apt install ufw
sudo ufw allow 3000/tcp
sudo ufw enable

# Disable unnecessary services
sudo systemctl disable bluetooth
sudo systemctl disable avahi-daemon
```

## 📱 Browser Access Instructions

### Chrome Browser (Recommended)
1. **On your laptop/desktop:**
   - Open Chrome browser
   - Type: `http://YOUR_RASPBERRY_PI_IP:3000`
   - Bookmark for easy access

2. **Chrome Mobile:**
   - Open Chrome app
   - Type the IP address with port
   - Add to home screen for app-like experience

### Other Browsers
- **Firefox:** Same process as Chrome
- **Safari:** Same process as Chrome
- **Edge:** Same process as Chrome

### Troubleshooting Connection Issues
1. **Check if server is running:**
   ```bash
   ps aux | grep node
   ```

2. **Check port 3000 is open:**
   ```bash
   sudo netstat -tlnp | grep 3000
   ```

3. **Check firewall settings:**
   ```bash
   sudo ufw status
   ```

4. **Test local connection:**
   ```bash
   curl http://localhost:3000
   ```

## 🌍 Network Configuration

### Find Your Raspberry Pi IP
```bash
# Method 1
hostname -I

# Method 2
ip addr show

# Method 3 (if connected to WiFi)
iwconfig
```

### Set Static IP (Optional)
Edit `/etc/dhcpcd.conf`:
```
interface eth0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1 8.8.8.8
```

## 📊 Performance Optimization

### For Raspberry Pi
- Use wired connection instead of WiFi
- Close unnecessary browser tabs
- Consider using a lightweight browser
- Monitor system resources

### For Production
- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Monitor performance metrics

## 🆘 Troubleshooting

### Common Issues
1. **Port already in use:**
   ```bash
   sudo lsof -i :3000
   kill -9 <PID>
   ```

2. **Permission denied:**
   ```bash
   sudo chown -R pi:pi /path/to/mission-control
   ```

3. **Node modules issues:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review logs in the browser console
- Check system logs: `journalctl -u mission-control`
- Create an issue on GitHub

---

**Need help?** Check the [GitHub repository](https://github.com/your-username/mission-control) for updates and support.
EOF
    
    print_success "Deployment guide created (DEPLOYMENT.md)"
}

# Main installation process
main() {
    print_status "Starting Mission Control setup..."
    
    check_nodejs
    check_npm
    install_dependencies
    create_env_file
    setup_network_access
    create_systemd_service
    create_startup_script
    create_deployment_guide
    
    print_success "Mission Control setup completed successfully!"
    echo ""
    echo "🎉 Setup Complete!"
    echo "==================="
    echo ""
    echo "Next steps:"
    echo "1. Start development: npm run dev"
    echo "2. Access locally: http://localhost:3000"
    echo "3. For LAN access: npm run dev -- --host 0.0.0.0 --port 3000"
    echo "4. Read DEPLOYMENT.md for detailed instructions"
    echo ""
    echo "For Raspberry Pi auto-start:"
    echo "sudo cp mission-control.service /etc/systemd/system/"
    echo "sudo systemctl enable mission-control"
    echo "sudo systemctl start mission-control"
    echo ""
    echo "Happy mission controlling! 🚀"
}

# Run main function
main "$@"