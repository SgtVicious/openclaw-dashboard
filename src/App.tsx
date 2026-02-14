import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Layout } from '@/components/Layout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AgentsPage } from '@/pages/AgentsPage';
import { WorkspacePage } from '@/pages/WorkspacePage';
import { SessionsPage } from '@/pages/SessionsPage';
import { LogsPage } from '@/pages/LogsPage';
import { SystemPage } from '@/pages/SystemPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { CronJobsPage } from '@/pages/CronJobsPage';
import { WorkspaceVizPage } from '@/pages/WorkspaceVizPage';
import { GovernancePage } from '@/pages/GovernancePage';
import { Toaster } from '@/components/ui/sonner';

// Page Components Map
type PageType = 'dashboard' | 'agents' | 'workspace' | 'sessions' | 'logs' | 'system' | 'settings' | 'cron' | 'workspace-viz' | 'governance';

const pages: Record<PageType, React.ComponentType> = {
  dashboard: DashboardPage,
  agents: AgentsPage,
  workspace: WorkspacePage,
  sessions: SessionsPage,
  logs: LogsPage,
  system: SystemPage,
  settings: SettingsPage,
  cron: CronJobsPage,
  'workspace-viz': WorkspaceVizPage,
  governance: GovernancePage,
};

function App() {
  const { isAuthenticated } = useAuthStore();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toaster />
      </>
    );
  }

  // Get current page component
  const CurrentPageComponent = pages[currentPage];

  return (
    <>
      <Layout currentPage={currentPage} onPageChange={(page) => setCurrentPage(page as PageType)}>
        <CurrentPageComponent />
      </Layout>
      <Toaster />
    </>
  );
}

export default App;
