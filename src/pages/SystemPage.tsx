import { useEffect } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Cpu, 
  Activity, 
  HardDrive, 
  Thermometer, 
  Server,
  Wifi,
  RotateCcw,
  Power,
  Clock,
  Zap,
  Code,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Resource Card Component
interface ResourceCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  progress?: number;
}

function ResourceCard({ title, value, subtitle, icon: Icon, color, progress }: ResourceCardProps) {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg text-white', color)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {progress !== undefined && (
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Status Row Component
function StatusRow({ 
  label, 
  status, 
  value, 
  icon: Icon 
}: { 
  label: string; 
  status: 'healthy' | 'warning' | 'error' | 'neutral'; 
  value: string;
  icon: React.ElementType;
}) {
  const statusConfigs = {
    healthy: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    warning: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    error: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
    neutral: { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' },
  };
  const config = statusConfigs[status];
  
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
      <div className="flex items-center gap-3">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', config.bg)}>
          <Icon className={cn('h-5 w-5', config.text)} />
        </div>
        <div>
          <p className="font-medium text-slate-900">{label}</p>
          <div className="flex items-center gap-2">
            <span className={cn('h-2 w-2 rounded-full', config.dot)} />
            <span className="text-sm text-slate-500">{value}</span>
          </div>
        </div>
      </div>
      <Badge variant={status === 'healthy' ? 'default' : status === 'warning' ? 'secondary' : 'destructive'}>
        {status === 'healthy' ? 'Healthy' : status === 'warning' ? 'Warning' : status === 'error' ? 'Error' : 'Unknown'}
      </Badge>
    </div>
  );
}

export function SystemPage() {
  const { systemStatus, fetchSystemStatus } = useDashboardStore();
  
  useEffect(() => {
    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!systemStatus) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <RotateCcw className="h-5 w-5 animate-spin" />
          Loading system status...
        </div>
      </div>
    );
  }

  const formatBytes = (bytes: number) => {
    const gb = bytes / 1024;
    return `${gb.toFixed(1)} GB`;
  };

  const formatDuration = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">System Status</h2>
          <p className="text-slate-500">Monitor your Raspberry Pi and OpenClaw services</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="default" className="gap-2 bg-green-600 hover:bg-green-700">
            <Power className="h-4 w-4" />
            Restart Gateway
          </Button>
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ResourceCard
          title="CPU Usage"
          value={`${systemStatus.cpu.usage}%`}
          subtitle={`Temperature: ${systemStatus.cpu.temperature}°C`}
          icon={Cpu}
          color="bg-gradient-to-br from-blue-500 to-cyan-500"
          progress={systemStatus.cpu.usage}
        />
        <ResourceCard
          title="Memory"
          value={formatBytes(systemStatus.memory.used)}
          subtitle={`of ${formatBytes(systemStatus.memory.total)} used`}
          icon={Activity}
          color="bg-gradient-to-br from-purple-500 to-pink-500"
          progress={systemStatus.memory.percentage}
        />
        <ResourceCard
          title="Disk"
          value={formatBytes(systemStatus.disk.used)}
          subtitle={`of ${formatBytes(systemStatus.disk.total)} used`}
          icon={HardDrive}
          color="bg-gradient-to-br from-green-500 to-emerald-500"
          progress={systemStatus.disk.percentage}
        />
        <ResourceCard
          title="Uptime"
          value={formatDuration(systemStatus.openclaw.uptime)}
          subtitle={`Version: ${systemStatus.openclaw.version}`}
          icon={Clock}
          color="bg-gradient-to-br from-orange-500 to-red-500"
        />
      </div>

      {/* Service Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Service Status</CardTitle>
            <CardDescription>OpenClaw and gateway health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusRow
              label="OpenClaw Gateway"
              status={systemStatus.openclaw.status === 'running' ? 'healthy' : 'error'}
              value={`Port 18789 • ${systemStatus.openclaw.status}`}
              icon={Server}
            />
            <StatusRow
              label="WebSocket Connection"
              status={systemStatus.gateway.status === 'connected' ? 'healthy' : 'error'}
              value={`Latency: ${systemStatus.gateway.latency}ms`}
              icon={Wifi}
            />
            <StatusRow
              label="CPU Temperature"
              status={systemStatus.cpu.temperature > 70 ? 'warning' : 'healthy'}
              value={`${systemStatus.cpu.temperature}°C`}
              icon={Thermometer}
            />
            <StatusRow
              label="Memory Usage"
              status={systemStatus.memory.percentage > 80 ? 'warning' : 'healthy'}
              value={`${systemStatus.memory.percentage.toFixed(1)}%`}
              icon={Activity}
            />
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common system operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start gap-2 h-auto py-3">
                <RotateCcw className="h-4 w-4" />
                <div className="text-left">
                  <p className="font-medium">Restart Gateway</p>
                  <p className="text-xs text-slate-500">Reload all services</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start gap-2 h-auto py-3">
                <Zap className="h-4 w-4" />
                <div className="text-left">
                  <p className="font-medium">Clear Cache</p>
                  <p className="text-xs text-slate-500">Free up memory</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start gap-2 h-auto py-3">
                <Code className="h-4 w-4" />
                <div className="text-left">
                  <p className="font-medium">View Config</p>
                  <p className="text-xs text-slate-500">Edit openclaw.json</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start gap-2 h-auto py-3">
                <Globe className="h-4 w-4" />
                <div className="text-left">
                  <p className="font-medium">Update</p>
                  <p className="text-xs text-slate-500">Check for updates</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">System Information</CardTitle>
          <CardDescription>Detailed system and environment info</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase">Platform</p>
              <p className="font-medium">Raspberry Pi 4 (ARM64)</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase">OS</p>
              <p className="font-medium">Raspberry Pi OS (Debian 12)</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase">Node.js</p>
              <p className="font-medium">v22.0.0</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase">OpenClaw</p>
              <p className="font-medium">v{systemStatus.openclaw.version}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase">Dashboard</p>
              <p className="font-medium">v1.0.0 (Port 28471)</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase">Gateway</p>
              <p className="font-medium">Port 18789</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
