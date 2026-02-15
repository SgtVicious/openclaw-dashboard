import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardShell } from '@/components/dashboard-shell'
import { MetricsGrid } from '@/components/metrics-grid'
import { QuickActions } from '@/components/quick-actions'
import { RecentActivity } from '@/components/recent-activity'
import { AIInsights } from '@/components/ai-insights'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user?.name || session.user?.email}
            </p>
          </div>
          <QuickActions />
        </div>

        <MetricsGrid />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <RecentActivity />
          </div>
          <div className="lg:col-span-3">
            <AIInsights />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}