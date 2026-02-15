import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Download, RefreshCw, Settings } from 'lucide-react'

export function QuickActions() {
  const actions = [
    {
      label: 'New Dashboard',
      icon: Plus,
      variant: 'default' as const,
      onClick: () => console.log('Create new dashboard'),
    },
    {
      label: 'Export Data',
      icon: Download,
      variant: 'outline' as const,
      onClick: () => console.log('Export data'),
    },
    {
      label: 'Refresh',
      icon: RefreshCw,
      variant: 'outline' as const,
      onClick: () => console.log('Refresh data'),
    },
  ]

  return (
    <div className="flex gap-2">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant={action.variant}
          size="sm"
          onClick={action.onClick}
        >
          <action.icon className="mr-2 h-4 w-4" />
          {action.label}
        </Button>
      ))}
    </div>
  )
}