import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from './metric-card'
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, Target } from 'lucide-react'

const metrics = [
  {
    title: 'Total Revenue',
    value: '$124,563',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Active Users',
    value: '2,543',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Conversion Rate',
    value: '3.24%',
    change: '-2.1%',
    trend: 'down',
    icon: Target,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    title: 'System Health',
    value: '99.9%',
    change: '+0.1%',
    trend: 'up',
    icon: Activity,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
]

export function MetricsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  )
}