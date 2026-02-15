import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

const activities = [
  {
    id: '1',
    user: {
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      email: 'sarah@example.com'
    },
    action: 'updated dashboard',
    target: 'Sales Analytics',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: 'update'
  },
  {
    id: '2',
    user: {
      name: 'Mike Chen',
      avatar: '/avatars/mike.jpg',
      email: 'mike@example.com'
    },
    action: 'created new metric',
    target: 'Customer Satisfaction',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    type: 'create'
  },
  {
    id: '3',
    user: {
      name: 'Emma Davis',
      avatar: '/avatars/emma.jpg',
      email: 'emma@example.com'
    },
    action: 'shared report',
    target: 'Q4 Performance',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    type: 'share'
  },
  {
    id: '4',
    user: {
      name: 'Alex Rodriguez',
      avatar: '/avatars/alex.jpg',
      email: 'alex@example.com'
    },
    action: 'commented on',
    target: 'Marketing Campaign',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    type: 'comment'
  },
]

const getActivityColor = (type: string) => {
  switch (type) {
    case 'create': return 'bg-green-100 text-green-800'
    case 'update': return 'bg-blue-100 text-blue-800'
    case 'share': return 'bg-purple-100 text-purple-800'
    case 'comment': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>
                  {activity.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>
                  {' '}{activity.action}{' '}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getActivityColor(activity.type)}>
                    {activity.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}