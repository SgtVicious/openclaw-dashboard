# Contributing to OpenClaw Dashboard

Thank you for your interest in contributing to the OpenClaw Dashboard! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to:

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect different viewpoints and experiences

## Getting Started

### Prerequisites

- Node.js 22+
- npm or yarn
- Git

### Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/openclaw-dashboard.git
cd openclaw-dashboard

# Add upstream remote
git remote add upstream https://github.com/original/openclaw-dashboard.git
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`

## Development Workflow

### Creating a Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### Making Changes

1. Write clean, maintainable code
2. Follow the existing code style
3. Add comments where necessary
4. Update documentation if needed

### Testing Your Changes

```bash
# Run linter
npm run lint

# Type check
npm run typecheck

# Build for production
npm run build
```

### Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge into your main branch
git checkout main
git merge upstream/main

# Update your feature branch
git checkout feature/your-feature-name
git rebase main
```

## Pull Request Process

1. **Before Submitting**
   - Ensure all tests pass
   - Run the linter
   - Update documentation
   - Add screenshots for UI changes

2. **Submitting**
   - Push your branch to your fork
   - Create a pull request from your fork to the main repository
   - Fill out the PR template completely

3. **PR Review**
   - Address review comments
   - Keep discussions constructive
   - Be patient - maintainers are volunteers

4. **After Merge**
   - Delete your feature branch
   - Update your local main branch

## Coding Standards

### TypeScript

- Use strict TypeScript settings
- Define interfaces for all data structures
- Avoid `any` type when possible
- Use type inference where appropriate

```typescript
// Good
interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'working' | 'error';
}

// Avoid
const agent: any = { id: '1', name: 'Test' };
```

### React Components

- Use functional components
- Use hooks for state management
- Keep components focused and small
- Use proper prop typing

```typescript
// Good
interface AgentCardProps {
  agent: Agent;
  onSelect: (agent: Agent) => void;
}

export function AgentCard({ agent, onSelect }: AgentCardProps) {
  return (
    <div onClick={() => onSelect(agent)}>
      {agent.name}
    </div>
  );
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow the existing color scheme
- Use CSS variables for theming
- Ensure responsive design

```tsx
// Good
<div className="flex items-center gap-4 p-4 bg-card rounded-lg">
  <span className="text-sm text-muted-foreground">Label</span>
</div>
```

### File Organization

```
src/
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui components
├── pages/              # Page components
├── stores/             # State management
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── types/              # TypeScript types
└── styles/             # Global styles
```

## Commit Messages

Follow conventional commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

Examples:
```
feat(agents): add agent filtering by status

fix(cron): resolve timezone conversion issue
docs(readme): update installation instructions
style(dashboard): fix indentation in metrics panel
```

## Reporting Issues

### Bug Reports

Include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, Node version)

### Feature Requests

Include:
- Clear description of the feature
- Use case and motivation
- Possible implementation approach
- Mockups or examples if applicable

## Questions?

- Join the [OpenClaw Discord](https://discord.gg/openclaw)
- Check existing [issues](https://github.com/yourusername/openclaw-dashboard/issues)
- Read the [documentation](https://docs.openclaw.ai)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to OpenClaw Dashboard! 🦞
