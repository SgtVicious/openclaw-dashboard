import { useState } from 'react'
import { Plus, Search, Filter, Calendar, User, StatusIndicator } from 'lucide-react'
import './missions.css'

function Missions() {
  const [missions, setMissions] = useState([
    {
      id: 1,
      name: 'Operation Starlight',
      status: 'active',
      priority: 'high',
      assignedTo: 'Team Alpha',
      progress: 75,
      deadline: '2024-02-20',
      description: 'Deep space exploration mission'
    },
    {
      id: 2,
      name: 'Project Nebula',
      status: 'completed',
      priority: 'medium',
      assignedTo: 'Team Beta',
      progress: 100,
      deadline: '2024-02-15',
      description: 'Data analysis and research'
    },
    {
      id: 3,
      name: 'Mission Quantum',
      status: 'pending',
      priority: 'low',
      assignedTo: 'Team Gamma',
      progress: 25,
      deadline: '2024-02-25',
      description: 'Experimental technology testing'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981'
      case 'completed': return '#3b82f6'
      case 'pending': return '#f59e0b'
      case 'failed': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const filteredMissions = missions.filter(mission => {
    const matchesSearch = mission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mission.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || mission.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="missions">
      <div className="missions-header">
        <h1>Mission Management</h1>
        <button className="add-mission-btn">
          <Plus size={20} />
          New Mission
        </button>
      </div>

      <div className="missions-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search missions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <Filter size={20} />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="missions-grid">
        {filteredMissions.map((mission) => (
          <div key={mission.id} className="mission-card">
            <div className="mission-header">
              <h3>{mission.name}</h3>
              <span 
                className="mission-status"
                style={{ backgroundColor: getStatusColor(mission.status) }}
              >
                {mission.status}
              </span>
            </div>

            <p className="mission-description">{mission.description}</p>

            <div className="mission-details">
              <div className="detail-item">
                <User size={16} />
                <span>{mission.assignedTo}</span>
              </div>
              <div className="detail-item">
                <Calendar size={16} />
                <span>{mission.deadline}</span>
              </div>
            </div>

            <div className="mission-progress">
              <div className="progress-header">
                <span>Progress</span>
                <span>{mission.progress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${mission.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="mission-priority">
              <span 
                className="priority-badge"
                style={{ backgroundColor: getPriorityColor(mission.priority) }}
              >
                {mission.priority} priority
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Missions