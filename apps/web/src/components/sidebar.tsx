"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Home, 
  BarChart3, 
  Users, 
  Settings, 
  Bell, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Activity,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Activity',
    href: '/activity',
    icon: Activity,
  },
  {
    title: 'Team',
    href: '/team',
    icon: Users,
  },
  {
    title: 'Alerts',
    href: '/alerts',
    icon: AlertTriangle,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn(
      "flex flex-col border-r bg-card transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" className={cn(
          "flex items-center space-x-2 font-semibold",
          collapsed && "justify-center"
        )}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && <span>Mission Control</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon className="h-4 w-4" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
      
      <div className="border-t p-3">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start",
              collapsed && "justify-center px-2"
            )}
          >
            <HelpCircle className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Help</span>}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start",
              collapsed && "justify-center px-2"
            )}
          >
            <Bell className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Notifications</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}