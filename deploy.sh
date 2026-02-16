#!/bin/bash
# Vercel deployment script for Mission Control

echo "🚀 Deploying Mission Control to Vercel..."

# Navigate to project directory
cd /home/epharr/.openclaw/workspace/mission-control

# Create vercel.json for deployment configuration
cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
EOF

# Create package.json for Vercel
if [ ! -f package.json ]; then
  cat > package.json << 'EOF'
{
  "name": "mission-control-factory",
  "version": "1.0.0",
  "description": "Factory floor dashboard for AI agent monitoring",
  "main": "index.html",
  "scripts": {
    "dev": "python3 -m http.server 3000",
    "build": "echo 'Static build complete'",
    "start": "python3 -m http.server $PORT"
  },
  "dependencies": {},
  "devDependencies": {}
}
EOF
fi

echo "✅ Vercel configuration created"
echo "✅ Ready for deployment"
echo ""
echo "📋 DEPLOYMENT INSTRUCTIONS:"
echo "1. cd /home/epharr/.openclaw/workspace/mission-control"
echo "2. npm install -g vercel"
echo "3. vercel login"
echo "4. vercel --prod"
echo ""
echo "🎯 MISSION CONTROL FEATURES:"
echo "✅ Factory floor aesthetic with industrial design"
echo "✅ Real-time agent status monitoring"
echo "✅ Office overview with working/idle indicators"
echo "✅ Live activity feed"
echo "✅ Performance metrics dashboard"
echo "✅ Mobile responsive design"
echo "✅ Open source ready"
echo ""
echo "🏭 FACTORY FLOOR VISUALIZATION:"
echo "• BodyPulse Dev Agent (75% progress)"
echo "• TradeNavAI Research (idle)"
echo "• Sourdough Ops Agent (45% progress)"
echo "• Farm Management (60% progress)"
echo "• Content Creation Bot (idle)"
echo ""
echo "🚀 READY FOR IMMEDIATE DEPLOYMENT!"