import { useState } from 'react'
import { Moon, Sun, Menu, Rocket } from 'lucide-react'
import './header.css'

function Header({ toggleTheme, toggleSidebar, isDarkMode, isSidebarCollapsed }) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="menu-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        
        <div className="logo">
          <Rocket size={24} />
          <span>Mission Control</span>
        </div>
      </div>

      <div className="header-center">
        <div className="system-status">
          <span className="status-indicator active"></span>
          <span>All Systems Operational</span>
        </div>
      </div>

      <div className="header-right">
        <div className="current-time">
          {currentTime.toLocaleTimeString()}
        </div>
        
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  )
}

export default Header