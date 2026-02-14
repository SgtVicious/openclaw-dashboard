import { useState } from 'react';
import { useCronStore, type CronJob, type CronScheduleType, type SessionTarget, type WakeMode, type DeliveryMode } from '@/stores/cronStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Clock, 
  Play, 
  Pause, 
  Trash2, 
  Plus, 
  Edit, 
  RotateCcw,
  CheckCircle,
  XCircle,
  Calendar,
  Timer,
  MessageSquare,
  Terminal,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Status Badge Component
function StatusBadge({ status }: { status: CronJob['status'] }) {
  const configs = {
    pending: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock },
    running: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Play },
    completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
    failed: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
    disabled: { bg: 'bg-slate-100', text: 'text-slate-500', icon: Pause },
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

// Schedule Display Component
function ScheduleDisplay({ schedule }: { schedule: CronJob['schedule'] }) {
  if (schedule.kind === 'at' && schedule.at) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Calendar className="h-4 w-4" />
        At {new Date(schedule.at).toLocaleString()}
      </div>
    );
  }
  if (schedule.kind === 'every' && schedule.every) {
    const hours = Math.floor(schedule.every / 3600000);
    const minutes = Math.floor((schedule.every % 3600000) / 60000);
    return (
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Timer className="h-4 w-4" />
        Every {hours > 0 ? `${hours}h ` : ''}{minutes > 0 ? `${minutes}m` : ''}
      </div>
    );
  }
  if (schedule.kind === 'cron' && schedule.cron) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Clock className="h-4 w-4" />
        <code className="bg-slate-100 px-1 rounded text-xs">{schedule.cron}</code>
        {schedule.tz && <span className="text-xs text-slate-400">({schedule.tz})</span>}
      </div>
    );
  }
  return null;
}

// Job Card Component
function JobCard({ job, onEdit, onRun, onToggle, onDelete }: { 
  job: CronJob; 
  onEdit: (job: CronJob) => void;
  onRun: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Card className="border-slate-200 hover:border-orange-300 transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900">{job.name}</h3>
              <StatusBadge status={job.status} />
              {job.deleteAfterRun && (
                <Badge variant="outline" className="text-xs">One-shot</Badge>
              )}
            </div>
            <code className="text-xs text-slate-500">{job.jobId}</code>
            <ScheduleDisplay schedule={job.schedule} />
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Terminal className="h-3 w-3" />
                {job.sessionTarget} session
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {job.payload.kind === 'systemEvent' ? 'System Event' : 'Agent Turn'}
              </span>
              {job.agentId && (
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  Agent: {job.agentId}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded">
              {job.payload.message || job.payload.systemEvent}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(job)} className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onRun(job.id)} 
              disabled={job.status === 'running'}
              className="h-8 w-8 p-0"
            >
              <Play className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onToggle(job.id)}
              className="h-8 w-8 p-0"
            >
              {job.status === 'disabled' ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(job.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span>Runs: {job.runCount}</span>
            <span>Errors: {job.errorCount}</span>
          </div>
          <div className="flex items-center gap-4">
            {job.lastRun && <span>Last: {new Date(job.lastRun).toLocaleDateString()}</span>}
            {job.nextRun && <span>Next: {new Date(job.nextRun).toLocaleDateString()}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Job Form Dialog
function JobDialog({ 
  job, 
  open, 
  onClose, 
  onSave 
}: { 
  job: CronJob | null; 
  open: boolean; 
  onClose: () => void;
  onSave: (job: Partial<CronJob>) => void;
}) {
  const isEditing = !!job;
  const [formData, setFormData] = useState<Partial<CronJob>>(job || {
    name: '',
    jobId: '',
    schedule: { kind: 'cron', cron: '0 * * * *' },
    sessionTarget: 'isolated',
    wakeMode: 'now',
    payload: { kind: 'agentTurn', message: '' },
    deleteAfterRun: false,
    delivery: { mode: 'announce' },
  });

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Cron Job' : 'New Cron Job'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Job name"
              />
            </div>
            <div className="space-y-2">
              <Label>Job ID</Label>
              <Input 
                value={formData.jobId} 
                onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                placeholder="unique-job-id"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Schedule Type</Label>
            <Select 
              value={formData.schedule?.kind} 
              onValueChange={(v: CronScheduleType) => setFormData({ 
                ...formData, 
                schedule: { kind: v } as any 
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="at">One-time (at specific time)</SelectItem>
                <SelectItem value="every">Interval (every X minutes)</SelectItem>
                <SelectItem value="cron">Cron expression</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.schedule?.kind === 'at' && (
            <div className="space-y-2">
              <Label>Run At</Label>
              <Input 
                type="datetime-local" 
                onChange={(e) => setFormData({ 
                  ...formData, 
                  schedule: { ...formData.schedule, kind: 'at', at: new Date(e.target.value).toISOString() } 
                })}
              />
            </div>
          )}

          {formData.schedule?.kind === 'every' && (
            <div className="space-y-2">
              <Label>Interval (minutes)</Label>
              <Input 
                type="number" 
                min={1}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  schedule: { ...formData.schedule, kind: 'every', every: parseInt(e.target.value) * 60000 } 
                })}
              />
            </div>
          )}

          {formData.schedule?.kind === 'cron' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Cron Expression</Label>
                <Input 
                  value={formData.schedule?.cron} 
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    schedule: { ...formData.schedule, kind: 'cron', cron: e.target.value } 
                  })}
                  placeholder="0 * * * *"
                />
                <p className="text-xs text-slate-500">min hour day month weekday</p>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Input 
                  value={formData.schedule?.tz} 
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    schedule: { ...(formData.schedule || { kind: 'cron' }), tz: e.target.value } as any
                  })}
                  placeholder="UTC"
                />
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Session Target</Label>
              <Select 
                value={formData.sessionTarget} 
                onValueChange={(v: SessionTarget) => setFormData({ ...formData, sessionTarget: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main Session</SelectItem>
                  <SelectItem value="isolated">Isolated Session</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Wake Mode</Label>
              <Select 
                value={formData.wakeMode} 
                onValueChange={(v: WakeMode) => setFormData({ ...formData, wakeMode: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Wake Now</SelectItem>
                  <SelectItem value="next-heartbeat">Next Heartbeat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payload Type</Label>
            <Select 
              value={formData.payload?.kind} 
              onValueChange={(v: 'systemEvent' | 'agentTurn') => setFormData({ 
                ...formData, 
                payload: { ...formData.payload, kind: v } as any 
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="systemEvent">System Event</SelectItem>
                <SelectItem value="agentTurn">Agent Turn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{formData.payload?.kind === 'systemEvent' ? 'System Event' : 'Message'}</Label>
            <textarea 
              className="w-full h-24 rounded-md border border-slate-300 p-2 text-sm"
              value={formData.payload?.message || formData.payload?.systemEvent || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                payload: { 
                  ...formData.payload, 
                  [formData.payload?.kind === 'systemEvent' ? 'systemEvent' : 'message']: e.target.value 
                } as any 
              })}
              placeholder={formData.payload?.kind === 'systemEvent' ? "System event description..." : "Message to send to agent..."}
            />
          </div>

          {formData.sessionTarget === 'isolated' && (
            <div className="space-y-2">
              <Label>Delivery Mode</Label>
              <Select 
                value={formData.delivery?.mode} 
                onValueChange={(v: DeliveryMode) => setFormData({ 
                  ...formData, 
                  delivery: { ...formData.delivery, mode: v } 
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="announce">Announce (deliver to channel)</SelectItem>
                  <SelectItem value="none">None (internal only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <div>
              <p className="font-medium">Delete After Run</p>
              <p className="text-sm text-slate-500">Remove this job after successful execution</p>
            </div>
            <Switch 
              checked={formData.deleteAfterRun} 
              onCheckedChange={(v) => setFormData({ ...formData, deleteAfterRun: v })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-orange-500 to-red-600">
            {isEditing ? 'Save Changes' : 'Create Job'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CronJobsPage() {
  const { jobs, runs, addJob, updateJob, deleteJob, toggleJob, runJobNow } = useCronStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<CronJob | null>(null);

  const handleEdit = (job: CronJob) => {
    setEditingJob(job);
    setDialogOpen(true);
  };

  const handleNew = () => {
    setEditingJob(null);
    setDialogOpen(true);
  };

  const handleSave = (jobData: Partial<CronJob>) => {
    if (editingJob) {
      updateJob(editingJob.id, jobData);
    } else {
      addJob(jobData as any);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Cron Jobs</h2>
          <p className="text-slate-500">Schedule and manage automated tasks</p>
        </div>
        <Button onClick={handleNew} className="gap-2 bg-gradient-to-r from-orange-500 to-red-600">
          <Plus className="h-4 w-4" />
          New Job
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Jobs</p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
              <Clock className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active</p>
                <p className="text-2xl font-bold text-green-600">{jobs.filter(j => j.status === 'pending').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Disabled</p>
                <p className="text-2xl font-bold text-slate-600">{jobs.filter(j => j.status === 'disabled').length}</p>
              </div>
              <Pause className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Runs</p>
                <p className="text-2xl font-bold">{jobs.reduce((acc, j) => acc + j.runCount, 0)}</p>
              </div>
              <RotateCcw className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="runs">Run History</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <div className="grid gap-4">
            {jobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onEdit={handleEdit}
                onRun={runJobNow}
                onToggle={toggleJob}
                onDelete={deleteJob}
              />
            ))}
          </div>
          {jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-300 rounded-lg">
              <Clock className="h-12 w-12 text-slate-300" />
              <p className="mt-4 text-lg font-medium text-slate-900">No cron jobs</p>
              <p className="text-sm text-slate-500">Create your first scheduled task</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="runs" className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Runs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {runs.map((run) => (
                  <div key={run.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'h-2 w-2 rounded-full',
                        run.status === 'completed' ? 'bg-green-500' : 
                        run.status === 'running' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                      )} />
                      <div>
                        <p className="font-medium text-sm">{run.jobId}</p>
                        <p className="text-xs text-slate-500">{new Date(run.startedAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      {run.tokensUsed && (
                        <span className="text-slate-500">{run.tokensUsed} tokens</span>
                      )}
                      <Badge variant={run.status === 'completed' ? 'default' : run.status === 'running' ? 'secondary' : 'destructive'}>
                        {run.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              {runs.length === 0 && (
                <p className="text-center text-slate-500 py-8">No runs yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <JobDialog 
        job={editingJob} 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
