import { useState, useEffect, useRef } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  ScrollText, 
  Search, 
  Download, 
  Trash2, 
  Pause,
  RotateCcw,
  AlertCircle,
  Info,
  Bug,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LogEntry } from '@/types';

// Mock log data generator
function generateMockLog(): LogEntry {
  const levels: LogEntry['level'][] = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
  const level = levels[Math.floor(Math.random() * levels.length)];
  const messages = {
    DEBUG: [
      'Session context updated',
      'Tool call completed in 120ms',
      'Memory compaction started',
      'WebSocket ping received',
    ],
    INFO: [
      'Gateway started on port 18789',
      'Agent session initialized',
      'Message received from Telegram',
      'Response sent to user',
      'Session saved to disk',
    ],
    WARN: [
      'High memory usage detected: 85%',
      'Slow response time: 3.2s',
      'Retrying failed request (attempt 2/3)',
      'Token limit approaching',
    ],
    ERROR: [
      'Failed to connect to LLM API',
      'Session save failed: disk full',
      'WebSocket connection lost',
      'Tool execution timeout',
    ],
  };
  
  return {
    timestamp: new Date().toISOString(),
    level,
    message: messages[level][Math.floor(Math.random() * messages[level].length)],
    agentId: Math.random() > 0.5 ? 'main' : 'coder',
  };
}

// Log Level Badge
function LogLevelBadge({ level }: { level: LogEntry['level'] }) {
  const configs = {
    DEBUG: { bg: 'bg-slate-100', text: 'text-slate-600', icon: Bug },
    INFO: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Info },
    WARN: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: AlertTriangle },
    ERROR: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle },
  };
  const config = configs[level];
  const Icon = config.icon;
  
  return (
    <Badge className={cn('gap-1 font-medium', config.bg, config.text)}>
      <Icon className="h-3 w-3" />
      {level}
    </Badge>
  );
}

export function LogsPage() {
  const { logs, addLog } = useDashboardStore();
  const [isLive, setIsLive] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<LogEntry['level'] | 'all'>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  // Live log simulation
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      const newLog = generateMockLog();
      addLog(newLog);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isLive, addLog]);
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (logContainerRef.current && isLive) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, isLive]);
  
  const filteredLogs = logs.filter((log: LogEntry) => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesAgent = agentFilter === 'all' || log.agentId === agentFilter;
    return matchesSearch && matchesLevel && matchesAgent;
  });
  
  const agents = ['main', 'coder', 'helper'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Logs</h2>
          <p className="text-slate-500">View and filter OpenClaw gateway logs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Level Filter */}
              <div className="flex gap-1">
                {(['all', 'DEBUG', 'INFO', 'WARN', 'ERROR'] as const).map((level) => (
                  <Button
                    key={level}
                    variant={levelFilter === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLevelFilter(level)}
                    className="text-xs"
                  >
                    {level}
                  </Button>
                ))}
              </div>
              
              {/* Agent Filter */}
              <div className="flex gap-1">
                <Button
                  variant={agentFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAgentFilter('all')}
                  className="text-xs"
                >
                  All Agents
                </Button>
                {agents.map((agent) => (
                  <Button
                    key={agent}
                    variant={agentFilter === agent ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAgentFilter(agent)}
                    className="text-xs"
                  >
                    {agent}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Live Toggle */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <Switch
                id="live-mode"
                checked={isLive}
                onCheckedChange={setIsLive}
              />
              <Label htmlFor="live-mode" className="flex items-center gap-2 cursor-pointer">
                {isLive ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Live
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4" />
                    Paused
                  </>
                )}
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Viewer */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Log Output</CardTitle>
              <CardDescription>
                {filteredLogs.length} entries • {logs.length} total
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              <RotateCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            ref={logContainerRef}
            className="h-96 overflow-auto rounded-lg bg-slate-900 p-4 font-mono text-sm"
          >
            {filteredLogs.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-slate-500">
                <ScrollText className="h-12 w-12 mb-2" />
                <p>No logs to display</p>
                {isLive && <p className="text-xs">Waiting for new entries...</p>}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredLogs.map((log: LogEntry, index: number) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 py-1 border-b border-slate-800/50 last:border-0"
                  >
                    <span className="text-slate-500 text-xs whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <LogLevelBadge level={log.level} />
                    {log.agentId && (
                      <Badge variant="outline" className="text-xs">
                        {log.agentId}
                      </Badge>
                    )}
                    <span className={cn(
                      'flex-1',
                      log.level === 'ERROR' ? 'text-red-400' :
                      log.level === 'WARN' ? 'text-yellow-400' :
                      log.level === 'DEBUG' ? 'text-slate-400' :
                      'text-slate-200'
                    )}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
