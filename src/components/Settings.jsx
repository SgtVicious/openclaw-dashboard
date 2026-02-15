import { useState } from 'react'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Save,
  RefreshCw
} from 'lucide-react'
import './settings.css'

function Settings() {
  const [settings, setSettings] = useState({
    theme: 'auto',
    language: 'en',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 30,
    dataRetention: 30,
    enableAnalytics: true
  })

  const [hasChanges, setHasChanges] = useState(false)

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // Save settings to localStorage or API
    localStorage.setItem('mission-control-settings', JSON.stringify(settings))
    setHasChanges(false)
    
    // Show success message
    alert('Settings saved successfully!')
  }

  const handleReset = () => {
    const defaultSettings = {
      theme: 'auto',
      language: 'en',
      notifications: true,
      autoRefresh: true,
      refreshInterval: 30,
      dataRetention: 30,
      enableAnalytics: true
    }
    setSettings(defaultSettings)
    setHasChanges(true)
  }

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Settings</h1>
        {hasChanges && (
          <div className="unsaved-changes">
            <span>Unsaved changes</span>
            <button className="save-btn" onClick={handleSave}>
              <Save size={16} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="settings-content">
        {/* Appearance Settings */}
        <div className="settings-section">
          <div className="section-header">
            <Palette size={20} />
            <h2>Appearance</h2>
          </div>
          
          <div className="setting-item">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
            >
              <option value="auto">Auto (System)</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="settings-section">
          <div className="section-header">
            <Bell size={20} />
            <h2>Notifications</h2>
          </div>
          
          <div className="setting-item">
            <label htmlFor="notifications">Enable Notifications</label>
            <input
              type="checkbox"
              id="notifications"
              checked={settings.notifications}
              onChange={(e) => handleSettingChange('notifications', e.target.checked)}
            />
          </div>
        </div>

        {/* System Settings */}
        <div className="settings-section">
          <div className="section-header">
            <RefreshCw size={20} />
            <h2>System</h2>
          </div>
          
          <div className="setting-item">
            <label htmlFor="autoRefresh">Auto Refresh</label>
            <input
              type="checkbox"
              id="autoRefresh"
              checked={settings.autoRefresh}
              onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
            />
          </div>

          {settings.autoRefresh && (
            <div className="setting-item">
              <label htmlFor="refreshInterval">Refresh Interval (seconds)</label>
              <input
                type="number"
                id="refreshInterval"
                min="5"
                max="300"
                value={settings.refreshInterval}
                onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
              />
            </div>
          )}

          <div className="setting-item">
            <label htmlFor="dataRetention">Data Retention (days)</label>
            <input
              type="number"
              id="dataRetention"
              min="1"
              max="365"
              value={settings.dataRetention}
              onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
            />
          </div>

          <div className="setting-item">
            <label htmlFor="enableAnalytics">Enable Analytics</label>
            <input
              type="checkbox"
              id="enableAnalytics"
              checked={settings.enableAnalytics}
              onChange={(e) => handleSettingChange('enableAnalytics', e.target.checked)}
            />
          </div>
        </div>

        {/* Language Settings */}
        <div className="settings-section">
          <div className="section-header">
            <Globe size={20} />
            <h2>Language & Region</h2>
          </div>
          
          <div className="setting-item">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
            </select>
          </div>
        </div>

        {/* Security Settings */}
        <div className="settings-section">
          <div className="section-header">
            <Shield size={20} />
            <h2>Security</h2>
          </div>
          
          <div className="setting-item">
            <p>Security settings and preferences are managed by your system administrator.</p>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <button className="reset-btn" onClick={handleReset}>
          <RefreshCw size={16} />
          Reset to Defaults
        </button>
        <div className="version-info">
          <span>Mission Control v1.0.0</span>
          <span>Build: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}

export default Settings