# Mission Control - Quick Setup Guide for Eric

## 🎯 Eric's Immediate Setup (Raspberry Pi)

### Step 1: Quick Start (5 minutes)
```bash
# Navigate to the mission-control directory
cd mission-control

# Run the automated setup
./setup.sh

# Start the dashboard
npm run dev -- --host 0.0.0.0 --port 3000
```

### Step 2: Find Your Raspberry Pi IP Address
```bash
# Get your local IP
hostname -I

# Example output: 192.168.1.150
```

### Step 3: Access from Your Laptop
**On your laptop browser, go to:**
```
http://YOUR_RASPBERRY_PI_IP:3000
```

**Example:** `http://192.168.1.150:3000`

## 🚀 Chrome Browser Instructions

### Desktop/Laptop Chrome
1. Open Chrome browser
2. Type your Raspberry Pi IP with port 3000
3. Press Enter
4. Bookmark the page for easy access

### Chrome Mobile
1. Open Chrome app
2. Type the IP address: `192.168.1.150:3000`
3. Tap the menu (3 dots)
4. "Add to Home Screen" for app-like experience

## 📱 Alternative Browsers
- **Safari:** Same process as Chrome
- **Firefox:** Same process as Chrome  
- **Edge:** Same process as Chrome

## 🔧 Auto-Start Setup (Optional)

### Method 1: Systemd Service (Recommended)
```bash
# Copy service file
sudo cp mission-control.service /etc/systemd/system/

# Enable auto-start
sudo systemctl enable mission-control

# Start now
sudo systemctl start mission-control

# Check status
sudo systemctl status mission-control
```

### Method 2: Simple Startup Script
```bash
# Make script executable
chmod +x start-mission-control.sh

# Run the startup script
./start-mission-control.sh
```

## 🌐 Network Access Troubleshooting

### Connection Issues?
1. **Check if server is running:**
   ```bash
   ps aux | grep node
   ```

2. **Check port 3000:**
   ```bash
   sudo netstat -tlnp | grep 3000
   ```

3. **Test local connection:**
   ```bash
   curl http://localhost:3000
   ```

4. **Check firewall:**
   ```bash
   sudo ufw status
   sudo ufw allow 3000/tcp
   ```

### Find IP Address (Multiple Methods)
```bash
# Method 1
hostname -I

# Method 2
ip addr show

# Method 3
ifconfig
```

## 🔒 Security for Local Network

### Basic Security Steps
1. **Change default password:**
   ```bash
   passwd
   ```

2. **Update your Pi:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Enable firewall (optional):**
   ```bash
   sudo apt install ufw
   sudo ufw allow 3000/tcp
   sudo ufw enable
   ```

## 🎯 Dashboard Features

### What You'll See
- **Real-time Metrics:** Mission status, system health
- **Interactive Charts:** Performance monitoring
- **Mission Management:** Track projects and tasks
- **Analytics:** Data visualization and reports
- **Settings:** Customize your dashboard

### Quick Tour
1. **Dashboard:** Overview of all missions and system status
2. **Missions:** Manage individual missions and projects
3. **Analytics:** View detailed reports and charts
4. **Settings:** Configure appearance and preferences

## 📊 Performance Tips

### For Raspberry Pi
- Use wired connection instead of WiFi when possible
- Close unnecessary browser tabs
- Monitor system resources
- Consider using lightweight browser

### For Network Access
- Ensure strong WiFi signal
- Use 5GHz WiFi if available
- Position Pi closer to router
- Check for network interference

## 🆘 Quick Help

### Common Commands
```bash
# Start dashboard
npm run dev -- --host 0.0.0.0 --port 3000

# Stop dashboard
Ctrl+C

# Check if running
ps aux | grep node

# View logs
journalctl -u mission-control
```

### Need More Help?
- Check `DEPLOYMENT.md` for detailed instructions
- Review `README.md` for full documentation
- Look at browser console for errors
- Ensure all dependencies are installed

## 🎉 Success Indicators

### Working Setup
- ✅ Dashboard loads on `localhost:3000`
- ✅ Can access from laptop via IP address
- ✅ All charts and data load properly
- ✅ No errors in browser console
- ✅ Responsive design works on mobile

### Next Steps
1. **Explore the dashboard features**
2. **Customize settings to your preference**
3. **Set up auto-start if desired**
4. **Share with others on your network**
5. **Consider GitHub deployment for public access**

---

**🚀 You're all set! Enjoy your Mission Control dashboard!**

**Questions?** Check the detailed `DEPLOYMENT.md` file or create an issue on GitHub.