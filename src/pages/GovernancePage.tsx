import { useState } from 'react';
import { useCollaborationStore, type GovernanceProposal, type DebateSession } from '@/stores/collaborationStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

import { 
  Scale, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  MinusCircle,
  Users,
  Clock,
  Gavel,
  BrainCircuit,
  Vote
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Proposal Card
function ProposalCard({ 
  proposal, 
  onVote,
  agents 
}: { 
  proposal: GovernanceProposal; 
  onVote: (proposalId: string, vote: { agentId: string; vote: 'for' | 'against' | 'abstain'; reasoning: string; timestamp: string }) => void;
  agents: any[];
}) {
  const forVotes = proposal.votes.filter(v => v.vote === 'for').length;
  const againstVotes = proposal.votes.filter(v => v.vote === 'against').length;
  const abstainVotes = proposal.votes.filter(v => v.vote === 'abstain').length;
  const totalVotes = proposal.votes.length;

  return (
    <Card className="border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900">{proposal.title}</h3>
              <Badge 
                variant={
                  proposal.status === 'passed' ? 'default' :
                  proposal.status === 'rejected' ? 'destructive' :
                  proposal.status === 'voting' ? 'secondary' :
                  'outline'
                }
              >
                {proposal.status}
              </Badge>
            </div>
            <p className="text-sm text-slate-600">{proposal.description}</p>
            
            {/* Vote Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>{forVotes} For</span>
                <span>{againstVotes} Against</span>
                <span>{abstainVotes} Abstain</span>
              </div>
              <div className="h-2 flex rounded-full overflow-hidden">
                <div className="bg-green-500" style={{ width: `${(forVotes / (totalVotes || 1)) * 100}%` }} />
                <div className="bg-red-500" style={{ width: `${(againstVotes / (totalVotes || 1)) * 100}%` }} />
                <div className="bg-slate-300" style={{ width: `${(abstainVotes / (totalVotes || 1)) * 100}%` }} />
              </div>
            </div>

            {/* Vote Details */}
            {proposal.votes.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-xs font-medium text-slate-500">Votes</p>
                {proposal.votes.map((vote, i) => {
                  const agent = agents.find(a => a.id === vote.agentId);
                  return (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className={cn(
                        'h-2 w-2 rounded-full',
                        vote.vote === 'for' ? 'bg-green-500' :
                        vote.vote === 'against' ? 'bg-red-500' :
                        'bg-slate-400'
                      )} />
                      <span>{agent?.emoji} {agent?.name}</span>
                      <span className="text-slate-400">-</span>
                      <span className="text-slate-600 italic">"{vote.reasoning}"</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Vote Buttons */}
          {proposal.status === 'voting' && (
            <div className="flex flex-col gap-1 ml-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-green-600 hover:bg-green-50"
                onClick={() => onVote(proposal.id, { agentId: 'chief-of-staff', vote: 'for', reasoning: 'I support this proposal.', timestamp: new Date().toISOString() })}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 hover:bg-red-50"
                onClick={() => onVote(proposal.id, { agentId: 'chief-of-staff', vote: 'against', reasoning: 'I oppose this proposal.', timestamp: new Date().toISOString() })}
              >
                <XCircle className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onVote(proposal.id, { agentId: 'chief-of-staff', vote: 'abstain', reasoning: 'I abstain from voting.', timestamp: new Date().toISOString() })}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Proposed by {agents.find(a => a.id === proposal.proposedBy)?.name}</span>
          {proposal.deadline && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Deadline: {new Date(proposal.deadline).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Debate Card
function DebateCard({ 
  debate, 
  agents,
  onAddRound,
  onConclude
}: { 
  debate: DebateSession; 
  agents: any[];
  onAddRound: (debateId: string, round: any) => void;
  onConclude: (debateId: string, conclusion: string) => void;
}) {
  const [showConclude, setShowConclude] = useState(false);
  const [conclusion, setConclusion] = useState('');

  return (
    <Card className="border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900">{debate.topic}</h3>
              <Badge variant={debate.status === 'active' ? 'secondary' : 'default'}>
                {debate.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Users className="h-4 w-4" />
              <span>Participants: {debate.participants.map(p => agents.find(a => a.id === p)?.name).join(', ')}</span>
            </div>

            {/* Debate Rounds */}
            <div className="space-y-3 mt-3">
              {debate.rounds.map((round, i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-slate-500 mb-2">Round {round.round}</p>
                  <div className="space-y-2">
                    {round.statements.map((stmt, j) => (
                      <div key={j} className="text-sm">
                        <span className="font-medium">{agents.find(a => a.id === stmt.agentId)?.name}:</span>
                        <span className="text-slate-600 ml-2">{stmt.argument}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Conclusion */}
            {debate.conclusion && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                <p className="text-sm font-medium text-green-800">Consensus Reached</p>
                <p className="text-sm text-green-700 mt-1">{debate.conclusion}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          {debate.status === 'active' && (
            <div className="flex flex-col gap-2 ml-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const newRound = {
                    round: debate.rounds.length + 1,
                    statements: debate.participants.map((p, i) => ({
                      agentId: p,
                      agentName: agents.find(a => a.id === p)?.name,
                      position: i % 2 === 0 ? 'Pro' : 'Con',
                      argument: `Argument from ${agents.find(a => a.id === p)?.name}...`,
                      timestamp: new Date().toISOString(),
                    })),
                  };
                  onAddRound(debate.id, newRound);
                }}
              >
                Next Round
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setShowConclude(true)}
              >
                Conclude
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      {/* Conclude Dialog */}
      <Dialog open={showConclude} onOpenChange={setShowConclude}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conclude Debate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Consensus Conclusion</Label>
            <Textarea 
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              placeholder="Summarize the consensus reached..."
              className="h-32"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConclude(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                onConclude(debate.id, conclusion);
                setShowConclude(false);
                setConclusion('');
              }}
              disabled={!conclusion.trim()}
            >
              Conclude Debate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// New Proposal Dialog
function NewProposalDialog({ 
  open, 
  onClose, 
  onSubmit
}: { 
  open: boolean; 
  onClose: () => void;
  onSubmit: (proposal: any) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      proposedBy: 'chief-of-staff',
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
    });
    setTitle('');
    setDescription('');
    setDeadline('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Governance Proposal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Proposal title..."
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the proposal in detail..."
              className="h-32"
            />
          </div>
          <div className="space-y-2">
            <Label>Voting Deadline (optional)</Label>
            <Input 
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={!title.trim() || !description.trim()}
            className="bg-gradient-to-r from-orange-500 to-red-600"
          >
            Create Proposal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// New Debate Dialog
function NewDebateDialog({ 
  open, 
  onClose, 
  onSubmit,
  agents
}: { 
  open: boolean; 
  onClose: () => void;
  onSubmit: (debate: any) => void;
  agents: any[];
}) {
  const [topic, setTopic] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const handleSubmit = () => {
    onSubmit({
      topic,
      participants: selectedParticipants,
      moderatorId: 'chief-of-staff',
    });
    setTopic('');
    setSelectedParticipants([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Debate Session</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Topic</Label>
            <Input 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What should be debated?"
            />
          </div>
          <div className="space-y-2">
            <Label>Participants</Label>
            <div className="space-y-2 max-h-48 overflow-auto border rounded-lg p-2">
              {agents.map((agent) => (
                <label key={agent.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded">
                  <input 
                    type="checkbox"
                    checked={selectedParticipants.includes(agent.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedParticipants([...selectedParticipants, agent.id]);
                      } else {
                        setSelectedParticipants(selectedParticipants.filter(id => id !== agent.id));
                      }
                    }}
                  />
                  <span className="text-2xl">{agent.emoji}</span>
                  <span>{agent.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={!topic.trim() || selectedParticipants.length < 2}
            className="bg-gradient-to-r from-orange-500 to-red-600"
          >
            Start Debate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function GovernancePage() {
  const { proposals, debates, agents, createProposal, voteOnProposal, createDebate, addDebateRound, concludeDebate } = useCollaborationStore();
  const [proposalDialogOpen, setProposalDialogOpen] = useState(false);
  const [debateDialogOpen, setDebateDialogOpen] = useState(false);

  const activeProposals = proposals.filter(p => p.status === 'voting');
  const concludedProposals = proposals.filter(p => p.status === 'passed' || p.status === 'rejected');
  const activeDebates = debates.filter(d => d.status === 'active');
  const concludedDebates = debates.filter(d => d.status === 'concluded');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Governance & Consensus</h2>
          <p className="text-slate-500">Multi-model decision making and debate</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setProposalDialogOpen(true)} className="gap-2 bg-gradient-to-r from-orange-500 to-red-600">
            <Gavel className="h-4 w-4" />
            New Proposal
          </Button>
          <Button onClick={() => setDebateDialogOpen(true)} variant="outline" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            New Debate
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Proposals</p>
                <p className="text-2xl font-bold">{activeProposals.length}</p>
              </div>
              <Vote className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Passed</p>
                <p className="text-2xl font-bold text-green-600">
                  {proposals.filter(p => p.status === 'passed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Debates</p>
                <p className="text-2xl font-bold">{activeDebates.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Consensus Reached</p>
                <p className="text-2xl font-bold text-blue-600">
                  {debates.filter(d => d.status === 'concluded').length}
                </p>
              </div>
              <BrainCircuit className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="proposals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="proposals" className="gap-2">
            <Scale className="h-4 w-4" />
            Proposals
          </TabsTrigger>
          <TabsTrigger value="debates" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Debates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-4">
          {activeProposals.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-slate-900">Voting in Progress</h3>
              {activeProposals.map((proposal) => (
                <ProposalCard 
                  key={proposal.id} 
                  proposal={proposal} 
                  onVote={voteOnProposal}
                  agents={agents}
                />
              ))}
            </div>
          )}

          {concludedProposals.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-slate-900">Concluded</h3>
              {concludedProposals.map((proposal) => (
                <ProposalCard 
                  key={proposal.id} 
                  proposal={proposal} 
                  onVote={voteOnProposal}
                  agents={agents}
                />
              ))}
            </div>
          )}

          {proposals.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-300 rounded-lg">
              <Scale className="h-12 w-12 text-slate-300" />
              <p className="mt-4 text-lg font-medium text-slate-900">No proposals yet</p>
              <p className="text-sm text-slate-500">Create a proposal to start governance</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="debates" className="space-y-4">
          {activeDebates.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-slate-900">Active Debates</h3>
              {activeDebates.map((debate) => (
                <DebateCard 
                  key={debate.id} 
                  debate={debate} 
                  agents={agents}
                  onAddRound={addDebateRound}
                  onConclude={concludeDebate}
                />
              ))}
            </div>
          )}

          {concludedDebates.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-slate-900">Concluded</h3>
              {concludedDebates.map((debate) => (
                <DebateCard 
                  key={debate.id} 
                  debate={debate} 
                  agents={agents}
                  onAddRound={addDebateRound}
                  onConclude={concludeDebate}
                />
              ))}
            </div>
          )}

          {debates.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-300 rounded-lg">
              <MessageSquare className="h-12 w-12 text-slate-300" />
              <p className="mt-4 text-lg font-medium text-slate-900">No debates yet</p>
              <p className="text-sm text-slate-500">Start a debate to reach consensus</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <NewProposalDialog
        open={proposalDialogOpen}
        onClose={() => setProposalDialogOpen(false)}
        onSubmit={createProposal}
      />

      <NewDebateDialog
        open={debateDialogOpen}
        onClose={() => setDebateDialogOpen(false)}
        onSubmit={createDebate}
        agents={agents}
      />
    </div>
  );
}
