import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useSettingsStore, type Theme } from '@/stores/settingsStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  User, 
  Lock, 
  Shield, 
  Bell, 
  Database, 
  Download, 
  Upload,
  RotateCcw,
  AlertTriangle,
  Moon,
  Sun,
  Monitor,
  Terminal,
  Network,
  Clock,
  FileJson,
  Copy,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Theme Selector Component
function ThemeSelector({ value, onChange }: { value: Theme; onChange: (theme: Theme) => void }) {
  const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="flex gap-2">
      {themes.map(({ value: v, label, icon: Icon }) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn(
            'flex items-center gap-2 rounded-lg border px-4 py-2 transition-all',
            value === v
              ? 'border-orange-500 bg-orange-50 text-orange-700'
              : 'border-slate-200 hover:border-slate-300'
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}

// Port Input Component
function PortInput({ 
  label, 
  value, 
  onChange, 
  description 
}: { 
  label: string; 
  value: number; 
  onChange: (value: number) => void;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        min={1024}
        max={65535}
        className="w-32"
      />
      {description && <p className="text-xs text-slate-500">{description}</p>}
    </div>
  );
}

// SSH Settings Section
function SSHSettingsSection() {
  const { settings, updateSSH } = useSettingsStore();
  const ssh = settings.ssh;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">SSH Access</h3>
          <p className="text-sm text-slate-500">Configure SSH tunnel settings</p>
        </div>
        <Switch
          checked={ssh.enabled}
          onCheckedChange={(v) => updateSSH({ enabled: v })}
        />
      </div>

      {ssh.enabled && (
        <div className="space-y-4 rounded-lg border border-slate-200 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <PortInput
              label="SSH Port"
              value={ssh.port}
              onChange={(v) => updateSSH({ port: v })}
              description="Default: 22"
            />
            <div className="space-y-2">
              <Label>Max Connections</Label>
              <Input
                type="number"
                value={ssh.maxConnections}
                onChange={(e) => updateSSH({ maxConnections: parseInt(e.target.value) || 1 })}
                min={1}
                max={100}
                className="w-32"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Idle Timeout (minutes)</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[ssh.idleTimeout]}
                onValueChange={([v]) => updateSSH({ idleTimeout: v })}
                min={5}
                max={120}
                step={5}
                className="flex-1"
              />
              <span className="w-16 text-right font-mono">{ssh.idleTimeout}m</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Authentication Methods</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ssh.allowPasswordAuth}
                  onChange={(e) => updateSSH({ allowPasswordAuth: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <span className="text-sm">Password</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ssh.allowKeyAuth}
                  onChange={(e) => updateSSH({ allowKeyAuth: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <span className="text-sm">SSH Key</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Allowed Users</Label>
            <div className="flex flex-wrap gap-2">
              {ssh.allowedUsers.map((user, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {user}
                  <button
                    onClick={() => updateSSH({ 
                      allowedUsers: ssh.allowedUsers.filter((_, idx) => idx !== i) 
                    })}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add user and press Enter"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = e.currentTarget.value.trim();
                  if (value && !ssh.allowedUsers.includes(value)) {
                    updateSSH({ allowedUsers: [...ssh.allowedUsers, value] });
                    e.currentTarget.value = '';
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Port Configuration Section
function PortConfigSection() {
  const { settings, updatePorts } = useSettingsStore();
  const ports = settings.ports;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium">Port Configuration</h3>
        <p className="text-sm text-slate-500">Configure all service ports</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <PortInput
          label="Dashboard Port"
          value={ports.dashboard}
          onChange={(v) => updatePorts({ dashboard: v })}
          description="Main web interface"
        />
        <PortInput
          label="Gateway Port"
          value={ports.gateway}
          onChange={(v) => updatePorts({ gateway: v })}
          description="OpenClaw gateway"
        />
        <PortInput
          label="WebSocket Port"
          value={ports.websocket}
          onChange={(v) => updatePorts({ websocket: v })}
          description="Real-time updates"
        />
        <PortInput
          label="API Port"
          value={ports.api}
          onChange={(v) => updatePorts({ api: v })}
          description="REST API endpoint"
        />
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Network className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          Current access URL: <code className="bg-blue-100 px-1 rounded">http://localhost:{ports.dashboard}</code>
          <br />
          SSH tunnel: <code className="bg-blue-100 px-1 rounded">ssh -L {ports.dashboard}:localhost:{ports.dashboard} pi@raspberrypi.local</code>
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Security Settings Section
function SecuritySettingsSection() {
  const { settings, updateSecurity } = useSettingsStore();
  const security = settings.security;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium">Security Settings</h3>
        <p className="text-sm text-slate-500">Configure authentication and security policies</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
          <div>
            <p className="font-medium">Require MFA</p>
            <p className="text-sm text-slate-500">Enforce two-factor authentication</p>
          </div>
          <Switch
            checked={security.requireMFA}
            onCheckedChange={(v) => updateSecurity({ requireMFA: v })}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
          <div>
            <p className="font-medium">Audit Logging</p>
            <p className="text-sm text-slate-500">Log all authentication attempts</p>
          </div>
          <Switch
            checked={security.auditLogging}
            onCheckedChange={(v) => updateSecurity({ auditLogging: v })}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Session Timeout (minutes)</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[security.sessionTimeout]}
                onValueChange={([v]) => updateSecurity({ sessionTimeout: v })}
                min={5}
                max={240}
                step={5}
                className="flex-1"
              />
              <span className="w-16 text-right font-mono">{security.sessionTimeout}m</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Max Login Attempts</Label>
            <Input
              type="number"
              value={security.maxLoginAttempts}
              onChange={(e) => updateSecurity({ maxLoginAttempts: parseInt(e.target.value) || 3 })}
              min={1}
              max={10}
              className="w-32"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Lockout Duration (minutes)</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[security.lockoutDuration]}
              onValueChange={([v]) => updateSecurity({ lockoutDuration: v })}
              min={5}
              max={120}
              step={5}
              className="flex-1"
            />
            <span className="w-16 text-right font-mono">{security.lockoutDuration}m</span>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-3">Password Requirements</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Minimum Length</span>
              <Input
                type="number"
                value={security.passwordMinLength}
                onChange={(e) => updateSecurity({ passwordMinLength: parseInt(e.target.value) || 6 })}
                min={6}
                max={32}
                className="w-20"
              />
            </div>
            <label className="flex items-center justify-between">
              <span className="text-sm">Require Special Characters</span>
              <Switch
                checked={security.passwordRequireSpecial}
                onCheckedChange={(v) => updateSecurity({ passwordRequireSpecial: v })}
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Require Numbers</span>
              <Switch
                checked={security.passwordRequireNumbers}
                onCheckedChange={(v) => updateSecurity({ passwordRequireNumbers: v })}
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Require Uppercase</span>
              <Switch
                checked={security.passwordRequireUppercase}
                onCheckedChange={(v) => updateSecurity({ passwordRequireUppercase: v })}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// Notification Settings Section
function NotificationSettingsSection() {
  const { settings, updateNotifications } = useSettingsStore();
  const notifications = settings.notifications;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium">Notifications</h3>
        <p className="text-sm text-slate-500">Configure alert and notification settings</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
          <div>
            <p className="font-medium">Email Notifications</p>
            <p className="text-sm text-slate-500">Send alerts via email</p>
          </div>
          <Switch
            checked={notifications.emailEnabled}
            onCheckedChange={(v) => updateNotifications({ emailEnabled: v })}
          />
        </div>

        {notifications.emailEnabled && (
          <div className="space-y-4 rounded-lg border border-slate-200 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>SMTP Server</Label>
                <Input
                  value={notifications.emailServer || ''}
                  onChange={(e) => updateNotifications({ emailServer: e.target.value })}
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div className="space-y-2">
                <Label>SMTP Port</Label>
                <Input
                  type="number"
                  value={notifications.emailPort || 587}
                  onChange={(e) => updateNotifications({ emailPort: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={notifications.emailUsername || ''}
                onChange={(e) => updateNotifications({ emailUsername: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={notifications.emailPassword || ''}
                onChange={(e) => updateNotifications({ emailPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>From Address</Label>
              <Input
                value={notifications.emailFrom || ''}
                onChange={(e) => updateNotifications({ emailFrom: e.target.value })}
                placeholder="alerts@openclaw.local"
              />
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium">Alert Conditions</h4>
          
          <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <span className="text-sm">Notify on Errors</span>
            <Switch
              checked={notifications.notifyOnErrors}
              onCheckedChange={(v) => updateNotifications({ notifyOnErrors: v })}
            />
          </label>

          <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <span className="text-sm">Notify on Agent Down</span>
            <Switch
              checked={notifications.notifyOnAgentDown}
              onCheckedChange={(v) => updateNotifications({ notifyOnAgentDown: v })}
            />
          </label>

          <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <span className="text-sm">Daily Summary</span>
            <Switch
              checked={notifications.notifyDailySummary}
              onCheckedChange={(v) => updateNotifications({ notifyDailySummary: v })}
            />
          </label>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <span className="text-sm">High Cost Alert Threshold ($)</span>
            <div className="flex items-center gap-2">
              <Switch
                checked={notifications.notifyOnHighCost}
                onCheckedChange={(v) => updateNotifications({ notifyOnHighCost: v })}
              />
              <Input
                type="number"
                value={notifications.highCostThreshold}
                onChange={(e) => updateNotifications({ highCostThreshold: parseFloat(e.target.value) })}
                className="w-24"
                min={1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Backup Settings Section
function BackupSettingsSection() {
  const { settings, updateBackup } = useSettingsStore();
  const backup = settings.backup;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium">Backup & Restore</h3>
        <p className="text-sm text-slate-500">Configure automatic backups</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
          <div>
            <p className="font-medium">Automatic Backups</p>
            <p className="text-sm text-slate-500">Schedule regular backups</p>
          </div>
          <Switch
            checked={backup.autoBackup}
            onCheckedChange={(v) => updateBackup({ autoBackup: v })}
          />
        </div>

        {backup.autoBackup && (
          <div className="space-y-4 rounded-lg border border-slate-200 p-4">
            <div className="space-y-2">
              <Label>Backup Interval</Label>
              <Select
                value={backup.backupInterval}
                onValueChange={(v: 'hourly' | 'daily' | 'weekly') => updateBackup({ backupInterval: v })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Backup Time</Label>
              <Input
                type="time"
                value={backup.backupTime}
                onChange={(e) => updateBackup({ backupTime: e.target.value })}
                className="w-32"
              />
            </div>

            <div className="space-y-2">
              <Label>Retention Period (days)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[backup.backupRetention]}
                  onValueChange={([v]) => updateBackup({ backupRetention: v })}
                  min={1}
                  max={90}
                  step={1}
                  className="flex-1"
                />
                <span className="w-16 text-right font-mono">{backup.backupRetention}d</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Backup Location</Label>
              <Input
                value={backup.backupLocation}
                onChange={(e) => updateBackup({ backupLocation: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <Label>Include in Backup</Label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={backup.includeSessions}
                  onChange={(e) => updateBackup({ includeSessions: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <span className="text-sm">Session Data</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={backup.includeLogs}
                  onChange={(e) => updateBackup({ includeLogs: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <span className="text-sm">Log Files</span>
              </label>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Backup Now
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Restore from Backup
          </Button>
        </div>
      </div>
    </div>
  );
}

// Advanced Settings Section
function AdvancedSettingsSection() {
  const { settings, updateAdvanced } = useSettingsStore();
  const advanced = settings.advanced;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium">Advanced Settings</h3>
        <p className="text-sm text-slate-500">Fine-tune system behavior</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Log Level</Label>
          <Select
            value={advanced.logLevel}
            onValueChange={(v: 'debug' | 'info' | 'warn' | 'error') => updateAdvanced({ logLevel: v })}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="debug">Debug</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warn">Warn</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Log Retention (days)</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[advanced.logRetention]}
              onValueChange={([v]) => updateAdvanced({ logRetention: v })}
              min={1}
              max={30}
              step={1}
              className="flex-1"
            />
            <span className="w-16 text-right font-mono">{advanced.logRetention}d</span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
          <div>
            <p className="font-medium">Enable Metrics</p>
            <p className="text-sm text-slate-500">Collect performance metrics</p>
          </div>
          <Switch
            checked={advanced.enableMetrics}
            onCheckedChange={(v) => updateAdvanced({ enableMetrics: v })}
          />
        </div>

        {advanced.enableMetrics && (
          <div className="space-y-2">
            <Label>Metrics Retention (days)</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[advanced.metricsRetention]}
                onValueChange={([v]) => updateAdvanced({ metricsRetention: v })}
                min={7}
                max={90}
                step={7}
                className="flex-1"
              />
              <span className="w-16 text-right font-mono">{advanced.metricsRetention}d</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
          <div>
            <p className="font-medium">Enable Tracing</p>
            <p className="text-sm text-slate-500">Record detailed request traces</p>
          </div>
          <Switch
            checked={advanced.enableTracing}
            onCheckedChange={(v) => updateAdvanced({ enableTracing: v })}
          />
        </div>

        {advanced.enableTracing && (
          <div className="space-y-2">
            <Label>Trace Sample Rate</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[advanced.traceSampleRate * 100]}
                onValueChange={([v]) => updateAdvanced({ traceSampleRate: v / 100 })}
                min={1}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="w-16 text-right font-mono">{Math.round(advanced.traceSampleRate * 100)}%</span>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Max Concurrent Sessions</Label>
            <Input
              type="number"
              value={advanced.maxConcurrentSessions}
              onChange={(e) => updateAdvanced({ maxConcurrentSessions: parseInt(e.target.value) || 10 })}
              min={1}
              max={1000}
            />
          </div>
          <div className="space-y-2">
            <Label>Request Timeout (seconds)</Label>
            <Input
              type="number"
              value={advanced.requestTimeout}
              onChange={(e) => updateAdvanced({ requestTimeout: parseInt(e.target.value) || 10 })}
              min={5}
              max={300}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>WebSocket Heartbeat (seconds)</Label>
          <Input
            type="number"
            value={advanced.websocketHeartbeat}
            onChange={(e) => updateAdvanced({ websocketHeartbeat: parseInt(e.target.value) || 30 })}
            min={10}
            max={300}
          />
        </div>
      </div>
    </div>
  );
}

// Account Settings Section
function AccountSettingsSection() {
  const { user, logout } = useAuthStore();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium">Profile Information</h3>
        <p className="text-sm text-slate-500">Manage your account details</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-2xl text-white font-bold">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <p className="font-medium text-lg">{user?.username || 'Admin'}</p>
            <Badge variant="secondary" className="capitalize">{user?.role || 'admin'}</Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Username</Label>
            <Input value={user?.username || 'admin'} disabled />
            <p className="text-xs text-slate-500">Username cannot be changed</p>
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input value={user?.role || 'admin'} disabled />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Email (optional)</Label>
          <Input type="email" placeholder="Enter your email" />
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-3">Security</h4>
          <Button variant="outline" onClick={() => setShowPasswordDialog(true)} className="gap-2">
            <Lock className="h-4 w-4" />
            Change Password
          </Button>
        </div>

        <Separator />

        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
          <div>
            <p className="font-medium text-red-900">Sign Out</p>
            <p className="text-sm text-red-600">End your current session</p>
          </div>
          <Button variant="destructive" onClick={logout} className="gap-2">
            <Lock className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current and new password</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                setShowPasswordDialog(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
              disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
            >
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Appearance Settings Section
function AppearanceSettingsSection() {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium">Appearance</h3>
        <p className="text-sm text-slate-500">Customize the dashboard look and feel</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Theme</Label>
          <ThemeSelector
            value={settings.theme}
            onChange={(theme) => updateSettings({ theme })}
          />
        </div>

        <div className="space-y-2">
          <Label>Language</Label>
          <Select
            value={settings.language}
            onValueChange={(v) => updateSettings({ language: v })}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Timezone</Label>
          <Select
            value={settings.timezone}
            onValueChange={(v) => updateSettings({ timezone: v })}
          >
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
              <SelectItem value="Europe/London">London (GMT)</SelectItem>
              <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
              <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date Format</Label>
          <Select
            value={settings.dateFormat}
            onValueChange={(v) => updateSettings({ dateFormat: v })}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="YYYY-MM-DD">2024-02-14</SelectItem>
              <SelectItem value="MM/DD/YYYY">02/14/2024</SelectItem>
              <SelectItem value="DD/MM/YYYY">14/02/2024</SelectItem>
              <SelectItem value="MMM DD, YYYY">Feb 14, 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Time Format</Label>
          <div className="flex gap-2">
            <button
              onClick={() => updateSettings({ timeFormat: '12h' })}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-4 py-2 transition-all',
                settings.timeFormat === '12h'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-slate-200 hover:border-slate-300'
              )}
            >
              <Clock className="h-4 w-4" />
              12-hour (2:30 PM)
            </button>
            <button
              onClick={() => updateSettings({ timeFormat: '24h' })}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-4 py-2 transition-all',
                settings.timeFormat === '24h'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-slate-200 hover:border-slate-300'
              )}
            >
              <Clock className="h-4 w-4" />
              24-hour (14:30)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Import/Export Section
function ImportExportSection() {
  const { exportSettings, importSettings, resetToDefaults } = useSettingsStore();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportSettings());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    const success = importSettings(importText);
    if (success) {
      setShowImportDialog(false);
      setImportText('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium">Import / Export</h3>
        <p className="text-sm text-slate-500">Backup and restore your configuration</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium">Export Configuration</p>
              <p className="text-sm text-slate-500">Download your settings as JSON</p>
            </div>
            <Button variant="outline" onClick={handleCopy} className="gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy JSON'}
            </Button>
          </div>
          <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs overflow-auto max-h-48">
            {exportSettings()}
          </pre>
        </div>

        <div className="rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium">Import Configuration</p>
              <p className="text-sm text-slate-500">Restore from JSON backup</p>
            </div>
            <Button variant="outline" onClick={() => setShowImportDialog(true)} className="gap-2">
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-900">Reset to Defaults</p>
              <p className="text-sm text-red-600">This will erase all custom settings</p>
            </div>
            <Button variant="destructive" onClick={() => setShowResetDialog(true)} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Configuration</DialogTitle>
            <DialogDescription>Paste your JSON configuration below</DialogDescription>
          </DialogHeader>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="w-full h-64 rounded-lg border border-slate-300 p-3 font-mono text-sm"
            placeholder="Paste JSON here..."
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>Cancel</Button>
            <Button onClick={handleImport} disabled={!importText.trim()}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Reset All Settings?
            </DialogTitle>
            <DialogDescription>
              This will permanently delete all your custom settings and restore defaults. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                resetToDefaults();
                setShowResetDialog(false);
              }}
            >
              Yes, Reset Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Main Settings Page
export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('appearance');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500">Configure your OpenClaw Dashboard</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-1">
          <TabsTrigger value="appearance" className="gap-1 text-xs lg:text-sm">
            <Monitor className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-1 text-xs lg:text-sm">
            <User className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="ports" className="gap-1 text-xs lg:text-sm">
            <Network className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">Ports</span>
          </TabsTrigger>
          <TabsTrigger value="ssh" className="gap-1 text-xs lg:text-sm">
            <Terminal className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">SSH</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1 text-xs lg:text-sm">
            <Shield className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1 text-xs lg:text-sm">
            <Bell className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="gap-1 text-xs lg:text-sm">
            <Database className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">Backup</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-1 text-xs lg:text-sm">
            <FileJson className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">Advanced</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <AppearanceSettingsSection />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <AccountSettingsSection />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ports" className="space-y-6">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <PortConfigSection />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ssh" className="space-y-6">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <SSHSettingsSection />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <SecuritySettingsSection />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <NotificationSettingsSection />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <BackupSettingsSection />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <AdvancedSettingsSection />
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <ImportExportSection />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
