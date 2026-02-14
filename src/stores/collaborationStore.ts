import { useCallback } from 'react';

// Agent Collaboration Types
export type AgentStatus = 'idle' | 'working' | 'discussing' | 'reviewing' | 'waiting';
export type CollaborationMode = 'independent' | 'consultative' | 'consensus' | 'hierarchical';
export type MessageType = 'task' | 'question' | 'response' | 'announcement' | 'debate';

export interface AgentMessage {
  id: string;
  fromAgentId: string;
  fromAgentName: string;
  toAgentId?: string;
  type: MessageType;
  content: string;
  timestamp: string;
  threadId?: string;
  metadata?: Record<string, unknown>;
}

export interface AgentCollaboration {
  agentId: string;
  agentName: string;
  emoji: string;
  canSendTo: string[];
  canReceiveFrom: string[];
  requiresApproval: boolean;
  autoRespond: boolean;
}

export interface WorkspaceAgent {
  id: string;
  name: string;
  emoji: string;
  role: string;
  status: AgentStatus;
  currentTask?: string;
  location: { x: number; y: number };
  activity: 'coding' | 'researching' | 'writing' | 'reviewing' | 'discussing' | 'idle';
  lastActive: string;
  subAgentIds: string[];
  parentAgentId?: string;
  model: string;
  specialization: string[];
}

export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  proposedBy: string;
  proposedAt: string;
  status: 'open' | 'voting' | 'passed' | 'rejected' | 'implemented';
  votes: {
    agentId: string;
    vote: 'for' | 'against' | 'abstain';
    reasoning: string;
    timestamp: string;
  }[];
  deadline?: string;
}

export interface DebateSession {
  id: string;
  topic: string;
  participants: string[];
  moderatorId?: string;
  startedAt: string;
  endedAt?: string;
  status: 'active' | 'concluded';
  rounds: DebateRound[];
  conclusion?: string;
}

export interface DebateRound {
  round: number;
  statements: {
    agentId: string;
    agentName: string;
    position: string;
    argument: string;
    timestamp: string;
  }[];
}

// Mock workspace agents
const mockWorkspaceAgents: WorkspaceAgent[] = [
  {
    id: 'chief-of-staff',
    name: 'Chief of Staff',
    emoji: '🦞',
    role: 'Orchestrator',
    status: 'discussing',
    currentTask: 'Coordinating team on project Alpha',
    location: { x: 50, y: 20 },
    activity: 'discussing',
    lastActive: new Date().toISOString(),
    subAgentIds: ['researcher', 'coder', 'writer', 'reviewer'],
    model: 'claude-opus',
    specialization: ['Coordination', 'Planning', 'Decision Making'],
  },
  {
    id: 'researcher',
    name: 'Researcher',
    emoji: '🔬',
    role: 'Specialist',
    status: 'working',
    currentTask: 'Analyzing market trends',
    location: { x: 20, y: 50 },
    activity: 'researching',
    lastActive: new Date().toISOString(),
    parentAgentId: 'chief-of-staff',
    subAgentIds: [],
    model: 'gpt-4',
    specialization: ['Research', 'Analysis', 'Data Gathering'],
  },
  {
    id: 'coder',
    name: 'Coder',
    emoji: '💻',
    role: 'Specialist',
    status: 'working',
    currentTask: 'Implementing API endpoints',
    location: { x: 50, y: 50 },
    activity: 'coding',
    lastActive: new Date().toISOString(),
    parentAgentId: 'chief-of-staff',
    subAgentIds: [],
    model: 'claude-sonnet',
    specialization: ['Coding', 'Debugging', 'Architecture'],
  },
  {
    id: 'writer',
    name: 'Writer',
    emoji: '✍️',
    role: 'Specialist',
    status: 'idle',
    currentTask: 'Waiting for research',
    location: { x: 80, y: 50 },
    activity: 'idle',
    lastActive: new Date().toISOString(),
    parentAgentId: 'chief-of-staff',
    subAgentIds: [],
    model: 'gpt-4',
    specialization: ['Writing', 'Documentation', 'Copy'],
  },
  {
    id: 'reviewer',
    name: 'Reviewer',
    emoji: '👁️',
    role: 'Quality',
    status: 'reviewing',
    currentTask: 'Reviewing code PR #42',
    location: { x: 50, y: 80 },
    activity: 'reviewing',
    lastActive: new Date().toISOString(),
    parentAgentId: 'chief-of-staff',
    subAgentIds: [],
    model: 'claude-haiku',
    specialization: ['Review', 'QA', 'Standards'],
  },
];

const mockCollaborations: AgentCollaboration[] = [
  {
    agentId: 'chief-of-staff',
    agentName: 'Chief of Staff',
    emoji: '🦞',
    canSendTo: ['researcher', 'coder', 'writer', 'reviewer'],
    canReceiveFrom: ['researcher', 'coder', 'writer', 'reviewer'],
    requiresApproval: false,
    autoRespond: true,
  },
  {
    agentId: 'researcher',
    agentName: 'Researcher',
    emoji: '🔬',
    canSendTo: ['chief-of-staff', 'writer'],
    canReceiveFrom: ['chief-of-staff'],
    requiresApproval: false,
    autoRespond: true,
  },
  {
    agentId: 'coder',
    agentName: 'Coder',
    emoji: '💻',
    canSendTo: ['chief-of-staff', 'reviewer'],
    canReceiveFrom: ['chief-of-staff', 'reviewer'],
    requiresApproval: false,
    autoRespond: true,
  },
  {
    agentId: 'writer',
    agentName: 'Writer',
    emoji: '✍️',
    canSendTo: ['chief-of-staff', 'reviewer'],
    canReceiveFrom: ['chief-of-staff', 'researcher'],
    requiresApproval: false,
    autoRespond: true,
  },
  {
    agentId: 'reviewer',
    agentName: 'Reviewer',
    emoji: '👁️',
    canSendTo: ['chief-of-staff', 'coder', 'writer'],
    canReceiveFrom: ['chief-of-staff', 'coder', 'writer'],
    requiresApproval: true,
    autoRespond: false,
  },
];

const mockMessages: AgentMessage[] = [
  {
    id: 'msg-001',
    fromAgentId: 'chief-of-staff',
    fromAgentName: 'Chief of Staff',
    toAgentId: 'researcher',
    type: 'task',
    content: 'Please research the latest trends in AI agent frameworks. I need a comprehensive report by EOD.',
    timestamp: '2024-02-14T10:00:00Z',
    threadId: 'thread-001',
  },
  {
    id: 'msg-002',
    fromAgentId: 'researcher',
    fromAgentName: 'Researcher',
    toAgentId: 'chief-of-staff',
    type: 'response',
    content: 'On it! I\'ll start with OpenClaw documentation and recent community discussions.',
    timestamp: '2024-02-14T10:05:00Z',
    threadId: 'thread-001',
  },
  {
    id: 'msg-003',
    fromAgentId: 'chief-of-staff',
    fromAgentName: 'Chief of Staff',
    toAgentId: 'coder',
    type: 'task',
    content: 'We need to implement the new dashboard API. Please start with the endpoints for agent management.',
    timestamp: '2024-02-14T10:10:00Z',
    threadId: 'thread-002',
  },
  {
    id: 'msg-004',
    fromAgentId: 'coder',
    fromAgentName: 'Coder',
    toAgentId: 'reviewer',
    type: 'task',
    content: 'Ready for review: PR #42 with the new API endpoints.',
    timestamp: '2024-02-14T11:00:00Z',
    threadId: 'thread-003',
  },
];

const mockProposals: GovernanceProposal[] = [
  {
    id: 'prop-001',
    title: 'Adopt New Model for Research Tasks',
    description: 'Should we switch the Researcher agent from GPT-4 to Claude Opus for better analysis capabilities?',
    proposedBy: 'chief-of-staff',
    proposedAt: '2024-02-14T09:00:00Z',
    status: 'voting',
    votes: [
      { agentId: 'researcher', vote: 'for', reasoning: 'Claude Opus has better reasoning for complex analysis.', timestamp: '2024-02-14T09:15:00Z' },
      { agentId: 'coder', vote: 'against', reasoning: 'GPT-4 is faster and more cost-effective.', timestamp: '2024-02-14T09:20:00Z' },
    ],
    deadline: '2024-02-15T09:00:00Z',
  },
];

const mockDebates: DebateSession[] = [
  {
    id: 'debate-001',
    topic: 'Best approach for implementing real-time collaboration',
    participants: ['chief-of-staff', 'coder', 'researcher'],
    moderatorId: 'chief-of-staff',
    startedAt: '2024-02-14T12:00:00Z',
    status: 'active',
    rounds: [
      {
        round: 1,
        statements: [
          { agentId: 'coder', agentName: 'Coder', position: 'WebSockets', argument: 'WebSockets provide true bidirectional communication with lower latency.', timestamp: '2024-02-14T12:05:00Z' },
          { agentId: 'researcher', agentName: 'Researcher', position: 'SSE', argument: 'Server-Sent Events are simpler, work better with HTTP proxies, and are sufficient for our use case.', timestamp: '2024-02-14T12:10:00Z' },
        ],
      },
    ],
  },
];

// Global state
let globalCollabState = {
  agents: mockWorkspaceAgents,
  collaborations: mockCollaborations,
  messages: mockMessages,
  proposals: mockProposals,
  debates: mockDebates,
  collaborationMode: 'hierarchical' as CollaborationMode,
  selectedAgent: null as WorkspaceAgent | null,
};

const listeners = new Set<() => void>();
const emitChange = () => listeners.forEach(l => l());

export function useCollaborationStore() {
  const updateAgentStatus = useCallback((agentId: string, status: AgentStatus, currentTask?: string, activity?: WorkspaceAgent['activity']) => {
    globalCollabState.agents = globalCollabState.agents.map(a =>
      a.id === agentId
        ? { ...a, status, currentTask: currentTask || a.currentTask, activity: activity || a.activity, lastActive: new Date().toISOString() }
        : a
    );
    emitChange();
  }, []);

  const moveAgent = useCallback((agentId: string, location: { x: number; y: number }) => {
    globalCollabState.agents = globalCollabState.agents.map(a =>
      a.id === agentId ? { ...a, location } : a
    );
    emitChange();
  }, []);

  const sendMessage = useCallback((message: Omit<AgentMessage, 'id' | 'timestamp'>) => {
    const newMessage: AgentMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    globalCollabState.messages = [newMessage, ...globalCollabState.messages];
    emitChange();
  }, []);

  const updateCollaboration = useCallback((agentId: string, updates: Partial<AgentCollaboration>) => {
    globalCollabState.collaborations = globalCollabState.collaborations.map(c =>
      c.agentId === agentId ? { ...c, ...updates } : c
    );
    emitChange();
  }, []);

  const setCollaborationMode = useCallback((mode: CollaborationMode) => {
    globalCollabState.collaborationMode = mode;
    emitChange();
  }, []);

  const createProposal = useCallback((proposal: Omit<GovernanceProposal, 'id' | 'proposedAt' | 'status' | 'votes'>) => {
    const newProposal: GovernanceProposal = {
      ...proposal,
      id: `prop-${Date.now()}`,
      proposedAt: new Date().toISOString(),
      status: 'voting',
      votes: [],
    };
    globalCollabState.proposals = [newProposal, ...globalCollabState.proposals];
    emitChange();
  }, []);

  const voteOnProposal = useCallback((proposalId: string, vote: GovernanceProposal['votes'][0]) => {
    globalCollabState.proposals = globalCollabState.proposals.map(p =>
      p.id === proposalId
        ? { ...p, votes: [...p.votes, vote] }
        : p
    );
    emitChange();
  }, []);

  const createDebate = useCallback((debate: Omit<DebateSession, 'id' | 'startedAt' | 'status' | 'rounds'>) => {
    const newDebate: DebateSession = {
      ...debate,
      id: `debate-${Date.now()}`,
      startedAt: new Date().toISOString(),
      status: 'active',
      rounds: [],
    };
    globalCollabState.debates = [newDebate, ...globalCollabState.debates];
    emitChange();
  }, []);

  const addDebateRound = useCallback((debateId: string, round: DebateRound) => {
    globalCollabState.debates = globalCollabState.debates.map(d =>
      d.id === debateId
        ? { ...d, rounds: [...d.rounds, round] }
        : d
    );
    emitChange();
  }, []);

  const concludeDebate = useCallback((debateId: string, conclusion: string) => {
    globalCollabState.debates = globalCollabState.debates.map(d =>
      d.id === debateId
        ? { ...d, status: 'concluded', endedAt: new Date().toISOString(), conclusion }
        : d
    );
    emitChange();
  }, []);

  const selectAgent = useCallback((agent: WorkspaceAgent | null) => {
    globalCollabState.selectedAgent = agent;
    emitChange();
  }, []);

  const getAgentMessages = useCallback((agentId: string) => {
    return globalCollabState.messages.filter(
      m => m.fromAgentId === agentId || m.toAgentId === agentId
    );
  }, []);

  const getSubAgents = useCallback((parentId: string) => {
    return globalCollabState.agents.filter(a => a.parentAgentId === parentId);
  }, []);

  return {
    agents: globalCollabState.agents,
    collaborations: globalCollabState.collaborations,
    messages: globalCollabState.messages,
    proposals: globalCollabState.proposals,
    debates: globalCollabState.debates,
    collaborationMode: globalCollabState.collaborationMode,
    selectedAgent: globalCollabState.selectedAgent,
    updateAgentStatus,
    moveAgent,
    sendMessage,
    updateCollaboration,
    setCollaborationMode,
    createProposal,
    voteOnProposal,
    createDebate,
    addDebateRound,
    concludeDebate,
    selectAgent,
    getAgentMessages,
    getSubAgents,
  };
}
