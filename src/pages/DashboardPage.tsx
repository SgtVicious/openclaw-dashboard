import { useEffect } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import type { Session } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  MessageSquare, 
  Clock, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Thermometer,
  Cpu,
  HardDrive,
  RotateCcw,
  Download,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Simple bar chart component (since we don't have recharts yet)
function SimpleBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="flex h-32 items-end gap-2">
      {data.map((item, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t bg-gradient-to-t from-orange-500 to-orange-400 transition-all"
            style={{ height: `${(item.value / max) * 100}%` }}
          />
          <span className="text-xs text-slate-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color: 'orange' | 'blue' | 'green' | 'purple';
}

function KPICard({ title, value, description, icon: Icon, trend, trendValue, color }: KPICardProps) {
  const colorClasses = {
    orange: 'from-orange-500 to-red-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
  };

  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
            {description && (
              <p className="mt-1 text-xs text-slate-400">{description}</p>
            )}
            {trend && trendValue && (
              <div className="mt-2 flex items-center gap-1">
                {trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : trend === 'down' ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : null}
                <span className={cn(
                  'text-xs',
                  trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-slate-500'
                )}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br text-white', colorClasses[color])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Resource Bar Component
function ResourceBar({ label, value, max, unit, icon: Icon, color }: { 
  label: string; 
  value: number; 
  max: number; 
  unit: string;
  icon: React.ElementType;
  color: string;
}) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
        <span className="text-sm text-slate-500">
          {value}{unit} / {max}{unit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div 
          className={cn('h-full rounded-full transition-all', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { stats, systemStatus, sessions, fetchAgents, fetchSessions, fetchSystemStatus } = useDashboardStore();

  useEffect(() => {
    fetchAgents();
    fetchSessions();
    fetchSystemStatus();
  }, []);

  // Mock activity data
  const activityData = [
    { label: '00:00', value: 12 },
    { label: '04:00', value: 8 },
    { label: '08:00', value: 24 },
    { label: '12:00', value: 32 },
    { label: '16:00', value: 28 },
    { label: '20:00', value: 18 },
    { label: 'Now', value: 15 },
  ];

  // const activeAgents = agents.filter((a: Agent) => a.status === 'running');
  const recentSessions = sessions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Agents"
          value={stats.activeAgents}
          description={`of ${stats.totalAgents} total agents`}
          icon={Bot}
          trend="up"
          trendValue="+2 this week"
          color="orange"
        />
        <KPICard
          title="Running Sessions"
          value={stats.runningSessions}
          description={`of ${stats.totalSessions} total sessions`}
          icon={MessageSquare}
          trend="neutral"
          trendValue="Stable"
          color="blue"
        />
        <KPICard
          title="Avg Response"
          value={`${stats.avgResponseTime}s`}
          description="Average response time"
          icon={Clock}
          trend="down"
          trendValue="-0.3s improvement"
          color="green"
        />
        <KPICard
          title="Tokens Used"
          value={stats.tokensUsed.toLocaleString()}
          description="Total tokens consumed"
          icon={Zap}
          trend="up"
          trendValue="+12% from last week"
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity Chart */}
        <Card className="lg:col-span-2 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Agent Activity (24h)</CardTitle>
            <CardDescription>Session activity over the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={activityData} />
          </CardContent>
        </Card>

        {/* Resource Monitor */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Pi Resources</CardTitle>
            <CardDescription>System resource usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {systemStatus && (
              <>
                <ResourceBar
                  label="CPU Usage"
                  value={systemStatus.cpu.usage}
                  max={100}
                  unit="%"
                  icon={Cpu}
                  color="bg-gradient-to-r from-blue-500 to-cyan-500"
                />
                <ResourceBar
                  label="Memory"
                  value={systemStatus.memory.used}
                  max={systemStatus.memory.total}
                  unit=" MB"
                  icon={Activity}
                  color="bg-gradient-to-r from-purple-500 to-pink-500"
                />
                <ResourceBar
                  label="Disk"
                  value={systemStatus.disk.used}
                  max={systemStatus.disk.total}
                  unit=" MB"
                  icon={HardDrive}
                  color="bg-gradient-to-r from-green-500 to-emerald-500"
                />
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-slate-600">Temperature</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    {systemStatus.cpu.temperature}°C
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Sessions */}
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Sessions</CardTitle>
              <CardDescription>Latest agent sessions</CardDescription>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSessions.map((session: Session) => (
                <div 
                  key={session.id} 
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full',
                      session.status === 'active' ? 'bg-green-100 text-green-600' :
                      session.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                      'bg-red-100 text-red-600'
                    )}>
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{session.agentName}</p>
                      <p className="text-xs text-slate-500">
                        {session.origin?.channel || 'web'} • {new Date(session.startTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={session.status === 'active' ? 'default' : session.status === 'completed' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {session.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Live Logs */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Restart Gateway
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear Logs
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <Download className="h-4 w-4" />
                  Backup Config
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <Bot className="h-4 w-4" />
                  New Agent
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Live Log Preview */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Live Logs</CardTitle>
              <CardDescription>Recent log entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 overflow-auto rounded-lg bg-slate-900 p-3 font-mono text-xs">
                <div className="space-y-1">
                  <div className="text-green-400">[INFO] Gateway started on port 18789</div>
                  <div className="text-blue-400">[DEBUG] WebSocket connection established</div>
                  <div className="text-slate-400">[INFO] Agent 'main' session started</div>
                  <div className="text-yellow-400">[WARN] High memory usage detected</div>
                  <div className="text-green-400">[INFO] Task completed successfully</div>
                  <div className="text-blue-400">[DEBUG] Session saved to disk</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
