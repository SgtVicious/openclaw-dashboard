import { useState } from 'react';
import { useCollaborationStore, type WorkspaceAgent, type CollaborationMode } from '@/stores/collaborationStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  GitBranch,
  Cpu,
  Code,
  BookOpen,
  Eye,
  Coffee,
  Send,
  Network,
  ChevronRight,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Agent Desk Component
function AgentDesk({ 
  agent, 
  isSelected, 
  onClick
}: { 
  agent: WorkspaceAgent; 
  isSelected: boolean;
  onClick: () => void;
}) {

  const activityIcons = {
    coding: <Code className="h-4 w-4" />,
    researching: <BookOpen className="h-4 w-4" />,
    writing: <BookOpen className="h-4 w-4" />,
    reviewing: <Eye className="h-4 w-4" />,
    discussing: <MessageSquare className="h-4 w-4" />,
    idle: <Coffee className="h-4 w-4" />,
  };

  const statusColors = {
    idle: 'bg-slate-100 border-slate-300',
    working: 'bg-blue-50 border-blue-300',
    discussing: 'bg-yellow-50 border-yellow-300',
    reviewing: 'bg-purple-50 border-purple-300',
    waiting: 'bg-orange-50 border-orange-300',
  };

  return (
    <div
      className={cn(
        'absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all',
        isSelected && 'z-10 scale-110'
      )}
      style={{ left: `${agent.location.x}%`, top: `${agent.location.y}%` }}
      onClick={onClick}
    >
      <div className={cn(
        'relative p-3 rounded-xl border-2 shadow-lg transition-all hover:shadow-xl',
        statusColors[agent.status],
        isSelected && 'ring-2 ring-orange-500 ring-offset-2'
      )}>
        {/* Agent Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="text-4xl">{agent.emoji}</div>
            {/* Status Indicator */}
            <div className={cn(
              'absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white',
              agent.status === 'working' ? 'bg-green-500 animate-pulse' :
              agent.status === 'discussing' ? 'bg-yellow-500' :
              agent.status === 'reviewing' ? 'bg-purple-500' :
              'bg-slate-400'
            )} />
          </div>
          <p className="mt-2 font-semibold text-sm text-slate-900">{agent.name}</p>
          <p className="text-xs text-slate-500">{agent.role}</p>
        </div>

        {/* Activity Badge */}
        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-slate-600">
          {activityIcons[agent.activity]}
          <span className="capitalize">{agent.activity}</span>
        </div>

        {/* Current Task */}
        {agent.currentTask && (
          <div className="mt-2 max-w-[150px] truncate text-xs text-slate-500 bg-white/50 px-2 py-1 rounded">
            {agent.currentTask}
          </div>
        )}

        {/* Model Badge */}
        <div className="mt-2 flex items-center justify-center gap-1 text-xs">
          <Cpu className="h-3 w-3 text-slate-400" />
          <span className="text-slate-500">{agent.model}</span>
        </div>
      </div>

      {/* Connection Lines (if has parent) */}
      {agent.parentAgentId && (
        <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-slate-300 -translate-y-full" />
      )}
    </div>
  );
}

// Agent Detail Dialog
function AgentDetailDialog({ 
  agent, 
  open, 
  onClose,
  subAgents,
  messages,
  onSendMessage
}: { 
  agent: WorkspaceAgent | null; 
  open: boolean; 
  onClose: () => void;
  subAgents: WorkspaceAgent[];
  messages: any[];
  onSendMessage: (content: string, toAgentId?: string) => void;
}) {
  const [messageText, setMessageText] = useState('');

  if (!agent) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{agent.emoji}</div>
            <div>
              <DialogTitle className="text-2xl">{agent.name}</DialogTitle>
              <p className="text-slate-500">{agent.role} • {agent.model}</p>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="subagents">Sub-Agents ({subAgents.length})</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Badge className={cn(
                  agent.status === 'working' ? 'bg-green-100 text-green-700' :
                  agent.status === 'discussing' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-slate-100 text-slate-700'
                )}>
                  {agent.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label>Activity</Label>
                <p className="capitalize">{agent.activity}</p>
              </div>
              <div className="space-y-2">
                <Label>Current Task</Label>
                <p className="text-sm text-slate-600">{agent.currentTask || 'None'}</p>
              </div>
              <div className="space-y-2">
                <Label>Last Active</Label>
                <p className="text-sm text-slate-600">{new Date(agent.lastActive).toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Specializations</Label>
              <div className="flex flex-wrap gap-2">
                {agent.specialization.map((spec, i) => (
                  <Badge key={i} variant="secondary">{spec}</Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Send Message</Label>
              <div className="flex gap-2">
                <Input 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                />
                <Button 
                  onClick={() => {
                    onSendMessage(messageText);
                    setMessageText('');
                  }}
                  disabled={!messageText.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <p className="text-slate-500">Task history and assignments would appear here.</p>
          </TabsContent>

          <TabsContent value="subagents" className="space-y-4">
            {subAgents.length > 0 ? (
              <div className="grid gap-2">
                {subAgents.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200">
                    <span className="text-2xl">{sub.emoji}</span>
                    <div className="flex-1">
                      <p className="font-medium">{sub.name}</p>
                      <p className="text-sm text-slate-500">{sub.role}</p>
                    </div>
                    <Badge variant="outline">{sub.model}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No sub-agents assigned.</p>
            )}
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <div className="space-y-2 max-h-64 overflow-auto">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    'p-3 rounded-lg',
                    msg.fromAgentId === agent.id ? 'bg-blue-50 ml-8' : 'bg-slate-50 mr-8'
                  )}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>{msg.fromAgentName}</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm">{msg.content}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Collaboration Controls
function CollaborationControls() {
  const { collaborationMode, setCollaborationMode, collaborations, updateCollaboration } = useCollaborationStore();

  const modes: { value: CollaborationMode; label: string; description: string }[] = [
    { value: 'independent', label: 'Independent', description: 'Agents work alone, no communication' },
    { value: 'consultative', label: 'Consultative', description: 'Agents can ask others for help' },
    { value: 'consensus', label: 'Consensus', description: 'Agents must agree on decisions' },
    { value: 'hierarchical', label: 'Hierarchical', description: 'Chief of Staff directs all agents' },
  ];

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Network className="h-5 w-5" />
          Collaboration Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={collaborationMode} onValueChange={(v: CollaborationMode) => setCollaborationMode(v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {modes.map((mode) => (
              <SelectItem key={mode.value} value={mode.value}>
                {mode.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-slate-500">
          {modes.find(m => m.value === collaborationMode)?.description}
        </p>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Communication Permissions</h4>
          <div className="space-y-2 max-h-48 overflow-auto">
            {collaborations.map((collab) => (
              <div key={collab.agentId} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-sm">
                <div className="flex items-center gap-2">
                  <span>{collab.emoji}</span>
                  <span>{collab.agentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      checked={collab.autoRespond}
                      onChange={(e) => updateCollaboration(collab.agentId, { autoRespond: e.target.checked })}
                    />
                    <span className="text-xs">Auto</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      checked={collab.requiresApproval}
                      onChange={(e) => updateCollaboration(collab.agentId, { requiresApproval: e.target.checked })}
                    />
                    <span className="text-xs">Approve</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Message Feed
function MessageFeed() {
  const { messages, agents } = useCollaborationStore();

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Inter-Agent Messages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-64 overflow-auto">
          {messages.slice(0, 10).map((msg) => {
            const fromAgent = agents.find(a => a.id === msg.fromAgentId);
            const toAgent = msg.toAgentId ? agents.find(a => a.id === msg.toAgentId) : null;
            
            return (
              <div key={msg.id} className="p-2 rounded-lg bg-slate-50 text-sm">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="flex items-center gap-1">
                    {fromAgent?.emoji} {fromAgent?.name}
                  </span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="flex items-center gap-1">
                    {toAgent ? <>{toAgent.emoji} {toAgent.name}</> : 'All'}
                  </span>
                  <span className="ml-auto">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-slate-700">{msg.content}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Import Input component
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function WorkspaceVizPage() {
  const { agents, selectedAgent, selectAgent, sendMessage, getSubAgents, getAgentMessages } = useCollaborationStore();
  const [detailOpen, setDetailOpen] = useState(false);

  const handleAgentClick = (agent: WorkspaceAgent) => {
    selectAgent(agent);
    setDetailOpen(true);
  };

  const handleSendMessage = (content: string, toAgentId?: string) => {
    if (selectedAgent) {
      sendMessage({
        fromAgentId: selectedAgent.id,
        fromAgentName: selectedAgent.name,
        toAgentId,
        type: 'task',
        content,
      });
    }
  };

  const selectedSubAgents = selectedAgent ? getSubAgents(selectedAgent.id) : [];
  const selectedMessages = selectedAgent ? getAgentMessages(selectedAgent.id) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Agent Workspace</h2>
          <p className="text-slate-500">Visualize and orchestrate your AI agent team</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1">
            <Users className="h-3 w-3" />
            {agents.length} Agents
          </Badge>
          <Badge variant="outline" className="gap-1">
            <GitBranch className="h-3 w-3" />
            {agents.filter(a => a.subAgentIds.length > 0).length} Leaders
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Workspace Visualization */}
        <div className="lg:col-span-3">
          <Card className="border-slate-200 h-[600px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Live Workspace
              </CardTitle>
            </CardHeader>
            <CardContent className="relative h-[500px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden">
              {/* Office Grid Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="h-full w-full" style={{
                  backgroundImage: `
                    linear-gradient(to right, #cbd5e1 1px, transparent 1px),
                    linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px'
                }} />
              </div>

              {/* Agent Desks */}
              {agents.map((agent) => (
                <AgentDesk
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgent?.id === agent.id}
                  onClick={() => handleAgentClick(agent)}

                />
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg">
                <p className="text-xs font-medium text-slate-500 mb-2">Status</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span>Working</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <span>Discussing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <span>Reviewing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-slate-400" />
                    <span>Idle</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <CollaborationControls />
          <MessageFeed />
        </div>
      </div>

      <AgentDetailDialog
        agent={selectedAgent}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        subAgents={selectedSubAgents}
        messages={selectedMessages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
