import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react'

const insights = [
  {
    id: '1',
    type: 'trend',
    title: 'Revenue Trending Up',
    description: 'Monthly revenue has increased by 12.5% compared to last month.',
    confidence: 0.85,
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    id: '2',
    title: 'User Engagement Alert',
    description: 'Daily active users have dropped by 8% in the past week.',
    type: 'alert',
    confidence: 0.92,
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    id: '3',
    title: 'Optimization Opportunity',
    description: 'Consider adjusting your pricing strategy based on user behavior patterns.',
    type: 'suggestion',
    confidence: 0.78,
    icon: Lightbulb,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
]

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.9) return 'bg-green-500'
  if (confidence >= 0.8) return 'bg-yellow-500'
  return 'bg-red-500'
}

export function AIInsights() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>AI Insights</CardTitle>
        <Brain className="h-4 w-4 text-purple-600" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => {
            const Icon = insight.icon
            return (
              <div key={insight.id} className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className={cn("rounded-lg p-2", insight.bgColor)}>
                    <Icon className={cn("h-4 w-4", insight.color)} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium">{insight.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(insight.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                    <div className="mt-2">
                      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full transition-all", getConfidenceColor(insight.confidence))}
                          style={{ width: `${insight.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}