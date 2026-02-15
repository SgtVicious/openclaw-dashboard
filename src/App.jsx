import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Missions from './components/Missions'
import Analytics from './components/Analytics'
import Settings from './components/Settings'
import './styles/app.css'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const savedSidebarState = localStorage.getItem('sidebar-collapsed')
    
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
    
    if (savedSidebarState === 'true') {
      setIsSidebarCollapsed(true)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed
    setIsSidebarCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', newState)
  }

  return (
    <div className={`app ${isDarkMode ? 'dark' : ''}`}>
      <Header 
        toggleTheme={toggleTheme}
        toggleSidebar={toggleSidebar}
        isDarkMode={isDarkMode}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      
      <div className="app-body">
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          isDarkMode={isDarkMode}
        />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/missions" element={<Missions />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App