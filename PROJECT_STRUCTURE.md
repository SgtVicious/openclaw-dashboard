# Project Structure

This document outlines the organization of the OpenClaw Dashboard codebase.

## Directory Overview

```
openclaw-dashboard/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
│       ├── ci.yml          # Continuous integration
│       └── deploy.yml      # GitHub Pages deployment
├── docs/                   # Documentation
│   ├── API.md              # API reference
│   ├── CONFIGURATION.md    # Configuration guide
│   └── DEPLOYMENT.md       # Deployment instructions
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── Layout.tsx     # Main layout component
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   ├── stores/            # State management
│   ├── types/             # TypeScript types
│   ├── App.tsx            # Main app component
│   ├── index.css          # Global styles
│   └── main.tsx           # Entry point
├── dist/                  # Build output (generated)
├── public/                # Static assets
├── .env                   # Environment variables (not in git)
├── .gitignore             # Git ignore rules
├── components.json        # shadcn/ui configuration
├── CONTRIBUTING.md        # Contribution guidelines
├── FEATURE_AUDIT.md       # Feature coverage analysis
├── LICENSE                # MIT License
├── package.json           # Dependencies and scripts
├── README.md              # Project overview
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Source Code Structure

### Components (`src/components/`)

#### UI Components (`src/components/ui/`)

Reusable UI components built with Radix UI and Tailwind CSS:

- `accordion.tsx` - Collapsible content sections
- `alert.tsx` - Alert/notification boxes
- `alert-dialog.tsx` - Modal confirmation dialogs
- `avatar.tsx` - User/agent avatars
- `badge.tsx` - Status badges
- `button.tsx` - Button variants
- `calendar.tsx` - Date picker calendar
- `card.tsx` - Content containers
- `carousel.tsx` - Image/content carousels
- `checkbox.tsx` - Form checkboxes
- `collapsible.tsx` - Expandable sections
- `context-menu.tsx` - Right-click context menus
- `dialog.tsx` - Modal dialogs
- `drawer.tsx` - Slide-out drawers
- `dropdown-menu.tsx` - Dropdown menus
- `field.tsx` - Form field wrappers
- `hover-card.tsx` - Hover-triggered cards
- `input.tsx` - Text inputs
- `input-group.tsx` - Input with addons
- `input-otp.tsx` - OTP code inputs
- `menubar.tsx` - Application menu bar
- `navigation-menu.tsx` - Navigation menus
- `pagination.tsx` - Page navigation
- `popover.tsx` - Popover tooltips
- `progress.tsx` - Progress bars
- `radio-group.tsx` - Radio button groups
- `resizable.tsx` - Resizable panels
- `scroll-area.tsx` - Custom scrollbars
- `select.tsx` - Dropdown selects
- `separator.tsx` - Visual dividers
- `sheet.tsx` - Slide-over panels
- `sidebar.tsx` - Navigation sidebar
- `skeleton.tsx` - Loading placeholders
- `slider.tsx` - Range sliders
- `sonner.tsx` - Toast notifications
- `spinner.tsx` - Loading spinners
- `switch.tsx` - Toggle switches
- `table.tsx` - Data tables
- `tabs.tsx` - Tab navigation
- `textarea.tsx` - Multi-line text inputs
- `toggle.tsx` - Toggle buttons
- `toggle-group.tsx` - Grouped toggles
- `tooltip.tsx` - Tooltips

#### Layout Components

- `Layout.tsx` - Main application layout with sidebar and navigation

### Pages (`src/pages/`)

Page components corresponding to routes:

| Page | Description |
|------|-------------|
| `LoginPage.tsx` | Authentication screen |
| `DashboardPage.tsx` | Main dashboard with KPIs and charts |
| `AgentsPage.tsx` | Agent management and details |
| `WorkspacePage.tsx` | File browser and editor |
| `SessionsPage.tsx` | Session history and transcripts |
| `LogsPage.tsx` | Live log streaming |
| `SystemPage.tsx` | System health monitoring |
| `SettingsPage.tsx` | Global configuration |
| `CronJobsPage.tsx` | Scheduled task management |
| `WorkspaceVizPage.tsx` | Visual agent workspace |
| `GovernancePage.tsx` | Multi-model voting and debate |

### State Management (`src/stores/`)

Custom React hooks for global state:

| Store | Purpose |
|-------|---------|
| `authStore.ts` | Authentication state |
| `dashboardStore.ts` | Dashboard metrics and data |
| `fileStore.ts` | File system operations |
| `settingsStore.ts` | User preferences and config |
| `cronStore.ts` | Cron job management |
| `collaborationStore.ts` | Agent collaboration and governance |

### Custom Hooks (`src/hooks/`)

Reusable React hooks:

- `use-mobile.tsx` - Mobile device detection
- `use-toast.ts` - Toast notification hook

### Utilities (`src/lib/`)

Helper functions and utilities:

- `utils.ts` - General utility functions (cn, etc.)

### Types (`src/types/`)

TypeScript type definitions:

- `index.ts` - Shared type definitions

### Configuration Files

| File | Purpose |
|------|---------|
| `components.json` | shadcn/ui configuration |
| `tailwind.config.js` | Tailwind CSS customization |
| `tsconfig.json` | TypeScript compiler options |
| `vite.config.ts` | Vite build configuration |
| `postcss.config.js` | PostCSS plugins |
| `eslint.config.js` | ESLint rules |

## Key Features by Page

### DashboardPage
- Real-time metrics (cost, tokens, latency)
- Usage charts (daily/weekly)
- Agent status overview
- System health summary
- Recent activity feed

### AgentsPage
- Agent list with status
- Agent detail view
- Sub-agent hierarchy
- Model configuration
- Activity history

### WorkspacePage
- File browser
- Markdown/JSON editor
- Bootstrap file editing (AGENTS.md, SOUL.md, etc.)
- File creation/deletion

### SessionsPage
- Session list
- Transcript viewer
- Message search
- Session metadata

### CronJobsPage
- Job list with status
- Create/edit jobs
- Schedule types (at/every/cron)
- Run history
- Manual execution

### WorkspaceVizPage
- Visual office layout
- Agent position tracking
- Real-time status
- Activity indicators
- Collaboration controls

### GovernancePage
- Proposal creation
- Multi-model voting
- Debate sessions
- Consensus tracking
- Decision history

### SettingsPage
- Appearance (theme)
- SSH configuration
- Port settings
- Security options
- Notifications
- Backup/restore
- Advanced settings

## Build Output

The `dist/` directory contains the production build:

```
dist/
├── index.html              # Entry HTML file
├── assets/
│   ├── index-*.js          # Main JavaScript bundle
│   └── index-*.css         # Stylesheet
└── [static assets]         # Images, fonts, etc.
```

## Development Workflow

1. **Start Development**: `npm run dev`
2. **Make Changes**: Edit files in `src/`
3. **Lint**: `npm run lint`
4. **Type Check**: `npm run typecheck`
5. **Build**: `npm run build`
6. **Preview**: `npm run preview`

## Adding New Features

### New Page

1. Create `src/pages/NewPage.tsx`
2. Add route in `App.tsx`
3. Add navigation link in `Layout.tsx`
4. Create store if needed in `src/stores/`

### New Component

1. Create component file in `src/components/`
2. Export from appropriate index file
3. Add to page or parent component

### New Store

1. Create `src/stores/newStore.ts`
2. Define state interface
3. Create hook with actions
4. Use in components

## Code Style

- **TypeScript**: Strict mode enabled
- **Components**: Functional with hooks
- **Styling**: Tailwind CSS utility classes
- **State**: Custom hooks (no external state library)
- **Icons**: Lucide React
- **UI**: shadcn/ui components

## Dependencies

### Production

- React 19
- TypeScript 5.9
- Tailwind CSS 3.4
- Vite 7.2
- Radix UI primitives
- Recharts (charts)
- date-fns (date formatting)
- zod (validation)

### Development

- ESLint
- TypeScript compiler
- Vite plugins

---

For more information, see:
- [README.md](./README.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [Configuration Guide](./docs/CONFIGURATION.md)
