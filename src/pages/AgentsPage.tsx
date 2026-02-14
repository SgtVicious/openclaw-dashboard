import { useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Bot, 
  Play, 
  Square, 
  Trash2, 
  Edit, 
  Plus, 
  Search, 
  Folder,
  Clock,
  CheckCircle,
  AlertCircle,
  TreePine
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Agent } from '@/types';

// Agent Status Badge
function StatusBadge({ status }: { status: Agent['status'] }) {
  const configs = {
    running: { bg: 'bg-green-100', text: 'text-green-700', icon: Play },
    idle: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
    stopped: { bg: 'bg-slate-100', text: 'text-slate-700', icon: Square },
    error: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle },
  };
  const config = configs[status];
  const Icon = config.icon;
  
  return (
    <Badge className={cn('gap-1 font-medium', config.bg, config.text)}>
      <Icon className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

// Agent Card Component
function AgentCard({ agent, onSelect }: { agent: Agent; onSelect: (agent: Agent) => void }) {
  return (
    <Card 
      className="cursor-pointer border-slate-200 transition-all hover:border-orange-300 hover:shadow-md"
      onClick={() => onSelect(agent)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 text-2xl">
              {agent.identity.emoji}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{agent.name}</h3>
              <p className="text-xs text-slate-500">{agent.id}</p>
            </div>
          </div>
          <StatusBadge status={agent.status} />
        </div>
        
        <p className="mt-3 text-sm text-slate-600 line-clamp-2">{agent.description}</p>
        
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Folder className="h-3.5 w-3.5" />
            <span className="truncate max-w-[120px]">{agent.workspacePath}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{agent.sessionCount} sessions</span>
          </div>
        </div>
        
        {agent.subAgentIds.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <TreePine className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs text-slate-500">{agent.subAgentIds.length} sub-agents</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Agent Detail Dialog
function AgentDetailDialog({ agent, open, onClose }: { agent: Agent | null; open: boolean; onClose: () => void }) {
  if (!agent) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 text-3xl">
              {agent.identity.emoji}
            </div>
            <div>
              <DialogTitle className="text-xl">{agent.name}</DialogTitle>
              <DialogDescription>{agent.id}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status & Actions */}
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <StatusBadge status={agent.status} />
              <span className="text-sm text-slate-500">
                Last active: {agent.lastActiveAt ? new Date(agent.lastActiveAt).toLocaleString() : 'Never'}
              </span>
            </div>
            <div className="flex gap-2">
              {agent.status === 'running' ? (
                <Button variant="outline" size="sm" className="gap-1">
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
              ) : (
                <Button variant="default" size="sm" className="gap-1 bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4" />
                  Start
                </Button>
              )}
              <Button variant="outline" size="sm" className="gap-1">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-slate-200 p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{agent.sessionCount}</p>
              <p className="text-xs text-slate-500">Total Sessions</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{agent.totalTasksCompleted}</p>
              <p className="text-xs text-slate-500">Tasks Completed</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{agent.averageResponseTime}s</p>
              <p className="text-xs text-slate-500">Avg Response</p>
            </div>
          </div>
          
          {/* Identity */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-900">Identity</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Name</p>
                <p className="text-sm font-medium">{agent.identity.name}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Theme</p>
                <p className="text-sm font-medium">{agent.identity.theme || 'default'}</p>
              </div>
            </div>
          </div>
          
          {/* Workspace */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-900">Workspace</h4>
            <code className="block rounded-lg bg-slate-900 p-3 text-xs text-slate-300">
              {agent.workspacePath}
            </code>
          </div>
          
          {/* Sub-agents */}
          {agent.subAgentIds.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Sub-agents</h4>
              <div className="flex flex-wrap gap-2">
                {agent.subAgentIds.map((subId) => (
                  <Badge key={subId} variant="secondary">{subId}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="destructive" size="sm" className="gap-1">
            <Trash2 className="h-4 w-4" />
            Delete Agent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AgentsPage() {
  const { agents } = useDashboardStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const runningAgents = filteredAgents.filter(a => a.status === 'running');
  const idleAgents = filteredAgents.filter(a => a.status === 'idle');
  const stoppedAgents = filteredAgents.filter(a => a.status === 'stopped' || a.status === 'error');

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Agents</h2>
          <p className="text-slate-500">Manage your OpenClaw agents and sub-agents</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-orange-500 to-red-600">
          <Plus className="h-4 w-4" />
          New Agent
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search agents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All ({filteredAgents.length})
          </TabsTrigger>
          <TabsTrigger value="running">
            Running ({runningAgents.length})
          </TabsTrigger>
          <TabsTrigger value="idle">
            Idle ({idleAgents.length})
          </TabsTrigger>
          <TabsTrigger value="stopped">
            Stopped ({stoppedAgents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onSelect={handleSelectAgent} />
            ))}
          </div>
          {filteredAgents.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 p-12">
              <Bot className="h-12 w-12 text-slate-300" />
              <p className="mt-4 text-lg font-medium text-slate-900">No agents found</p>
              <p className="text-sm text-slate-500">Try adjusting your search</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="running" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {runningAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onSelect={handleSelectAgent} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="idle" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {idleAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onSelect={handleSelectAgent} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stopped" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stoppedAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onSelect={handleSelectAgent} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Agent Detail Dialog */}
      <AgentDetailDialog 
        agent={selectedAgent} 
        open={detailOpen} 
        onClose={() => setDetailOpen(false)} 
      />
    </div>
  );
}
