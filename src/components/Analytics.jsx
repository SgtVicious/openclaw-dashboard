import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { TrendingUp, TrendingDown, Activity, Users } from 'lucide-react'
import './analytics.css'

function Analytics() {
  const performanceData = [
    { month: 'Jan', missions: 12, success: 10, failure: 2 },
    { month: 'Feb', missions: 15, success: 13, failure: 2 },
    { month: 'Mar', missions: 18, success: 16, failure: 2 },
    { month: 'Apr', missions: 14, success: 12, failure: 2 },
    { month: 'May', missions: 20, success: 18, failure: 2 },
    { month: 'Jun', missions: 22, success: 20, failure: 2 }
  ]

  const systemLoadData = [
    { time: '00:00', load: 45 },
    { time: '04:00', load: 38 },
    { time: '08:00', load: 72 },
    { time: '12:00', load: 85 },
    { time: '16:00', load: 68 },
    { time: '20:00', load: 52 }
  ]

  const kpiData = [
    {
      title: 'Mission Success Rate',
      value: '89.2%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'Average Response Time',
      value: '1.2s',
      change: '-0.3s',
      trend: 'down',
      icon: Activity
    },
    {
      title: 'Active Users',
      value: '1,247',
      change: '+124',
      trend: 'up',
      icon: Users
    }
  ]

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h1>Analytics & Reports</h1>
        <div className="date-range">
          Last 30 days
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <div key={index} className="kpi-card">
              <div className="kpi-icon">
                <Icon size={24} />
              </div>
              <div className="kpi-content">
                <h3>{kpi.title}</h3>
                <p className="kpi-value">{kpi.value}</p>
                <div className={`kpi-change ${kpi.trend}`}>
                  {kpi.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{kpi.change}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Mission Performance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="success" fill="#10b981" name="Successful" />
              <Bar dataKey="failure" fill="#ef4444" name="Failed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>System Load Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={systemLoadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="load" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
                name="System Load %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="reports-section">
        <div className="report-card">
          <h3>Monthly Summary</h3>
          <div className="report-stats">
            <div className="stat-item">
              <span className="stat-label">Total Missions</span>
              <span className="stat-value">101</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Success Rate</span>
              <span className="stat-value">89.2%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg. Duration</span>
              <span className="stat-value">2.4 hours</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">System Uptime</span>
              <span className="stat-value">99.8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics