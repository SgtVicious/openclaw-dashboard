import React, { useState, useEffect } from 'react'
import { Factory, Users, Activity, Clock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

// Factory Floor Dashboard Component
const MissionControl = () => {
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: "BodyPulse Dev Agent",
      status: "working",
      currentTask: "Building authentication system",
      progress: 75,
      lastUpdate: "2 min ago",
      category: "development",
      metrics: { tasksCompleted: 12, errors: 0, uptime: "99.9%" }
    },
    {
      id: 2,
      name: "TradeNavAI Research",
      status: "idle",
      currentTask: "Market analysis complete",
      progress: 100,
      lastUpdate: "5 min ago",
      category: "research",
      metrics: { insightsFound: 8, sourcesAnalyzed: 23, confidence: 0.87 }
    },
    {
      id: 3,
      name: "Sourdough Ops Agent",
      status: "working",
      currentTask: "Processing weekend orders",
      progress: 45,
      lastUpdate: "1 min ago",
      category: "operations",
      metrics: { ordersProcessed: 15, revenue: "$230", customers: 8 }
    },
    {
      id: 4,
      name: "Farm Management",
      status: "working",
      currentTask: "Equipment maintenance scheduling",
      progress: 60,
      lastUpdate: "3 min ago",
      category: "management",
      metrics: { equipmentChecked: 5, maintenanceDue: 2, efficiency: 92 }
    },
    {
      id: 5,
      name: "Content Creation Bot",
      status: "idle",
      currentTask: "Awaiting content calendar",
      progress: 0,
      lastUpdate: "10 min ago",
      category: "marketing",
      metrics: { postsCreated: 0, engagement: 0, reach: 0 }
    }
  ])

  const [factoryStats, setFactoryStats] = useState({
    totalAgents: 5,
    activeAgents: 3,
    completedTasks: 47,
    revenue: "$2,847",
    uptime: "99.9%",
    efficiency: 87
  })

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      
      // Simulate real-time updates
      setAgents(prev => prev.map(agent => ({
        ...agent,
        lastUpdate: Math.random() > 0.7 ? `${Math.floor(Math.random() * 5) + 1} min ago` : agent.lastUpdate
      })))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(timer)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'working': return 'active'
      case 'idle': return 'idle'
      case 'error': return 'error'
      default: return 'idle'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'working': return <Activity className="w-4 h-4" />
      case 'idle': return <Clock className="w-4 h-4" />
      case 'error': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="factory-floor">
      <div className="factory-grid">
        {/* Header */}
        <header className="factory-header">
          <div className="factory-title">
            <Factory className="w-6 h-6 mr-2" />
            MISSION CONTROL
          </div>
          <div className="factory-status">
            <div className={`status-indicator ${getStatusColor('working')}`}></div>
            <span>FACTORY ACTIVE</span>
            <span className="text-sm text-gray-400">{currentTime.toLocaleTimeString()}</span>
          </div>
        </header>

        {/* Sidebar - Control Panel */}
        <aside className="factory-sidebar">
          <div className="control-panel">
            <h3 className="control-title">CONTROL PANEL</h3>
            <div className="control-buttons">
              <button className="control-button">NEW TASK</button>
              <button className="control-button">DEPLOY</button>
              <button className="control-button">SCALE</button>
              <button className="control-button">MONITOR</button>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">QUICK ACTIONS</h4>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded">
                🚀 BodyPulse Sprint
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded">
                📊 TradeNav Research
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded">
                🍞 Sourdough Orders
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded">
                🚜 Farm Operations
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="factory-main">
          {/* Factory Stats */}
          <div className="factory-stats">
            <div className="stat-card">
              <div className="stat-value">{factoryStats.activeAgents}</div>
              <div className="stat-label">Active Agents</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{factoryStats.completedTasks}</div>
              <div className="stat-label">Tasks Today</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{factoryStats.revenue}</div>
              <div className="stat-label">Revenue</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{factoryStats.efficiency}%</div>
              <div className="stat-label">Efficiency</div>
            </div>
          </div>

          {/* Agent Floor */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              FACTORY FLOOR - LIVE STATUS
            </h2>
            
            <div className="grid gap-4">
              {agents.map(agent => (
                <div key={agent.id} className={`agent-card ${agent.status}`}>
                  <div className="agent-header">
                    <div className="agent-name">{agent.name}</div>
                    <div className="agent-status">
                      {getStatusIcon(agent.status)}
                      <span className="capitalize">{agent.status}</span>
                    </div>
                  </div>
                  
                  <div className="agent-task">{agent.currentTask}</div>
                  
                  <div className="agent-metrics">
                    <div className="metric">
                      <span className="metric-value">{agent.progress}%</span>
                      <span>Progress</span>
                    </div>
                    <div className="metric">
                      <span>{agent.lastUpdate}</span>
                    </div>
                    <div className="metric">
                      <span className="capitalize">{agent.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Activity Feed */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              LIVE ACTIVITY FEED
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">BodyPulse auth system: 75% complete</span>
                <span className="text-xs text-gray-500 ml-auto">2 min ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-sm">TradeNavAI analyzing market trends</span>
                <span className="text-xs text-gray-500 ml-auto">5 min ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Sourdough weekend orders processed</span>
                <span className="text-xs text-gray-500 ml-auto">8 min ago</span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="factory-footer">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              System Status: <span className="text-green-400">OPERATIONAL</span>
            </div>
            <div className="text-sm text-gray-400">
              Uptime: <span className="text-green-400">99.9%</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Mission Control v1.0.0 | Open Source
          </div>
        </footer>
      </div>
    </div>
  )
}

export default MissionControl