import { useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Search, 
  Download, 
  Trash2, 
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Session } from '@/types';

// Session Detail Dialog
function SessionDetailDialog({ session, open, onClose }: { session: Session | null; open: boolean; onClose: () => void }) {
  if (!session) return null;
  
  // Mock transcript data
  const transcript = [
    { role: 'user', content: 'Hello, can you help me with a coding task?', timestamp: '10:00:00' },
    { role: 'assistant', content: 'Of course! I\'d be happy to help. What do you need assistance with?', timestamp: '10:00:05' },
    { role: 'user', content: 'I need to write a Python script to process CSV files.', timestamp: '10:00:15' },
    { role: 'assistant', content: 'I can help with that. Let me create a script for you...', timestamp: '10:00:20' },
  ];
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Session Details</DialogTitle>
              <p className="text-sm text-slate-500 mt-1">{session.id}</p>
            </div>
            <Badge 
              variant={session.status === 'active' ? 'default' : session.status === 'completed' ? 'secondary' : 'destructive'}
            >
              {session.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Session Info */}
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">
            <div>
              <p className="text-xs text-slate-500">Agent</p>
              <p className="font-medium">{session.agentName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Session Key</p>
              <p className="font-medium">{session.sessionKey}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Started</p>
              <p className="font-medium">{new Date(session.startTime).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Channel</p>
              <p className="font-medium">{session.origin?.channel || 'web'}</p>
            </div>
          </div>
          
          {/* Token Usage */}
          <div className="grid grid-cols-4 gap-2">
            <div className="rounded-lg border border-slate-200 p-3 text-center">
              <p className="text-lg font-bold">{session.inputTokens.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Input Tokens</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3 text-center">
              <p className="text-lg font-bold">{session.outputTokens.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Output Tokens</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3 text-center">
              <p className="text-lg font-bold">{session.totalTokens.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Total Tokens</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3 text-center">
              <p className="text-lg font-bold">{session.contextTokens.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Context Tokens</p>
            </div>
          </div>
          
          {/* Transcript */}
          <div>
            <h4 className="font-medium mb-2">Transcript</h4>
            <div className="rounded-lg bg-slate-900 p-4 space-y-3 max-h-64 overflow-auto">
              {transcript.map((msg, i) => (
                <div key={i} className={cn(
                  'p-3 rounded-lg',
                  msg.role === 'user' ? 'bg-blue-900/50 ml-8' : 'bg-slate-800 mr-8'
                )}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn(
                      'text-xs font-medium',
                      msg.role === 'user' ? 'text-blue-400' : 'text-green-400'
                    )}>
                      {msg.role === 'user' ? 'User' : 'Assistant'}
                    </span>
                    <span className="text-xs text-slate-500">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm text-slate-200">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              Export JSONL
            </Button>
            <Button variant="destructive" className="gap-1">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SessionsPage() {
  const { sessions } = useDashboardStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const filteredSessions = sessions.filter((session: Session) => {
    const matchesSearch = 
      session.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectSession = (session: Session) => {
    setSelectedSession(session);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sessions</h2>
          <p className="text-slate-500">View and manage agent sessions</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export All
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'completed', 'error'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Sessions Table */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Agent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Channel</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Started</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tokens</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredSessions.map((session: Session) => (
                  <tr 
                    key={session.id} 
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => handleSelectSession(session)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-900">{session.agentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge 
                        variant={session.status === 'active' ? 'default' : session.status === 'completed' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {session.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">{session.origin?.channel || 'web'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">
                        {new Date(session.startTime).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">
                        {session.totalTokens.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <ChevronRight className="h-4 w-4" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredSessions.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12">
              <MessageSquare className="h-12 w-12 text-slate-300" />
              <p className="mt-4 text-lg font-medium text-slate-900">No sessions found</p>
              <p className="text-sm text-slate-500">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Detail Dialog */}
      <SessionDetailDialog 
        session={selectedSession} 
        open={detailOpen} 
        onClose={() => setDetailOpen(false)} 
      />
    </div>
  );
}
