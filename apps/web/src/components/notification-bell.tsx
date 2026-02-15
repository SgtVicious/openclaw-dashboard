import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, BellOff } from 'lucide-react'

interface NotificationBellProps {
  showNotifications: boolean
  onToggle: () => void
}

export function NotificationBell({ showNotifications, onToggle }: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(3)

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="relative"
    >
      {unreadCount > 0 ? (
        <Bell className="h-4 w-4" />
      ) : (
        <BellOff className="h-4 w-4" />
      )}
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center p-0 text-xs"
        >
          {unreadCount}
        </Badge>
      )}
      <span className="sr-only">Notifications</span>
    </Button>
  )
}