import { useState, useEffect } from 'react'
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Clock3,
  Target
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import './dashboard.css'

function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalMissions: 12,
    activeMissions: 8,
    completedMissions: 4,
    systemHealth: 98
  })

  const [performanceData, setPerformanceData] = useState([
    { time: '00:00', cpu: 45, memory: 62, network: 78 },
    { time: '04:00', cpu: 38, memory: 58, network: 65 },
    { time: '08:00', cpu: 72, memory: 75, network: 82 },
    { time: '12:00', cpu: 85, memory: 88, network: 91 },
    { time: '16:00', cpu: 68, memory: 70, network: 76 },
    { time: '20:00', cpu: 52, memory: 64, network: 69 }
  ])

  const [missionStatus, setMissionStatus] = useState([
    { name: 'Active', value: 8, color: '#10b981' },
    { name: 'Completed', value: 4, color: '#3b82f6' },
    { name: 'Pending', value: 2, color: '#f59e0b' },
    { name: 'Failed', value: 1, color: '#ef4444' }
  ])

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'success', message: 'Mission Alpha completed successfully', time: '2 minutes ago' },
    { id: 2, type: 'info', message: 'New mission scheduled for tomorrow', time: '15 minutes ago' },
    { id: 3, type: 'warning', message: 'System maintenance scheduled', time: '1 hour ago' },
    { id: 4, type: 'error', message: 'Connection timeout on Mission Beta', time: '2 hours ago' }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setMetrics(prev => ({
        ...prev,
        systemHealth: Math.floor(Math.random() * 5) + 95
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getActivityIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="activity-icon success" />
      case 'warning': return <AlertTriangle size={16} className="activity-icon warning" />
      case 'error': return <AlertTriangle size={16} className="activity-icon error" />
      default: return <Clock3 size={16} className="activity-icon info" />
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Mission Control Dashboard</h1>
        <div className="last-updated">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <Target size={24} />
          </div>
          <div className="metric-content">
            <h3>Total Missions</h3>
            <p className="metric-value">{metrics.totalMissions}</p>
            <span className="metric-change positive">+2 this week</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Activity size={24} />
          </div>
          <div className="metric-content">
            <h3>Active Missions</h3>
            <p className="metric-value">{metrics.activeMissions}</p>
            <span className="metric-change positive">+1 today</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <CheckCircle size={24} />
          </div>
          <div className="metric-content">
            <h3>Completed</h3>
            <p className="metric-value">{metrics.completedMissions}</p>
            <span className="metric-change positive">85% success rate</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <h3>System Health</h3>
            <p className="metric-value">{metrics.systemHealth}%</p>
            <div className="health-bar">
              <div 
                className="health-bar-fill"
                style={{ width: `${metrics.systemHealth}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>System Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="network" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Mission Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={missionStatus}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {missionStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <div className="activity-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon-wrapper">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard