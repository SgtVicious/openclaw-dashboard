import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { 
  LayoutDashboard, 
  Bot, 
  FileText, 
  MessageSquare, 
  ScrollText, 
  Settings, 
  LogOut,
  Menu,
  ChevronRight,
  Cpu,
  Activity,
  Clock,
  Scale,
  Network
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

interface NavItem {
  label: string;
  page: string;
  icon: React.ElementType;
  badge?: number;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', page: 'dashboard', icon: LayoutDashboard },
  { 
    label: 'Agents', 
    page: 'agents', 
    icon: Bot,
    children: [
      { label: 'Agent List', page: 'agents', icon: Bot },
      { label: 'Workspace', page: 'workspace-viz', icon: Network },
      { label: 'Governance', page: 'governance', icon: Scale },
    ]
  },
  { label: 'Files', page: 'workspace', icon: FileText },
  { label: 'Cron Jobs', page: 'cron', icon: Clock },
  { label: 'Sessions', page: 'sessions', icon: MessageSquare },
  { label: 'Logs', page: 'logs', icon: ScrollText },
  { label: 'System', page: 'system', icon: Cpu },
  { label: 'Settings', page: 'settings', icon: Settings },
];

function Sidebar({ currentPage, onPageChange }: { currentPage: string; onPageChange: (page: string) => void }) {
  const { user, logout } = useAuthStore();
  const [expandedSections, setExpandedSections] = useState<string[]>(['agents']);

  const toggleSection = (page: string) => {
    setExpandedSections(prev => 
      prev.includes(page) 
        ? prev.filter(p => p !== page)
        : [...prev, page]
    );
  };

  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-100">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
          <span className="text-xl">🦞</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white">OpenClaw</span>
          <span className="text-xs text-slate-400">Dashboard</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedSections.includes(item.page);
            const isChildActive = hasChildren && item.children?.some(c => c.page === currentPage);

            return (
              <li key={item.page}>
                <button
                  onClick={() => {
                    if (hasChildren) {
                      toggleSection(item.page);
                    } else {
                      onPageChange(item.page);
                    }
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    (isActive || isChildActive)
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                      {item.badge}
                    </span>
                  )}
                  {hasChildren && (
                    <ChevronRight className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-90')} />
                  )}
                  {!hasChildren && isActive && <ChevronRight className="h-4 w-4" />}
                </button>

                {/* Child Items */}
                {hasChildren && isExpanded && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {item.children?.map((child) => {
                      const ChildIcon = child.icon;
                      const isChildActive = currentPage === child.page;
                      return (
                        <li key={child.page}>
                          <button
                            onClick={() => onPageChange(child.page)}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                              isChildActive
                                ? 'bg-slate-700 text-white'
                                : 'text-slate-500 hover:bg-slate-700 hover:text-white'
                            )}
                          >
                            <ChildIcon className="h-4 w-4" />
                            <span className="flex-1 text-left">{child.label}</span>
                            {isChildActive && <ChevronRight className="h-3 w-3" />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-slate-800/50 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="text-sm font-medium text-white">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-white">
              {user?.username || 'Admin'}
            </span>
            <span className="truncate text-xs text-slate-400 capitalize">
              {user?.role || 'admin'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-8 w-8 text-slate-400 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function Header({ currentPage }: { currentPage: string }) {
  // Flatten nav items to find the current page label
  const allNavItems = navItems.flatMap(item => 
    item.children ? [item, ...item.children] : [item]
  );
  const pageTitle = allNavItems.find((item) => item.page === currentPage)?.label || 'Dashboard';
  
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-slate-900">{pageTitle}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Status Indicators */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-slate-600">Gateway Online</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">12ms</span>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="h-6 w-px bg-slate-200" />
        <Button variant="outline" size="sm" className="gap-2">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          Restart Gateway
        </Button>
      </div>
    </header>
  );
}

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 lg:block">
        <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar 
            currentPage={currentPage} 
            onPageChange={(page) => {
              onPageChange(page);
              setMobileMenuOpen(false);
            }} 
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header currentPage={currentPage} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
