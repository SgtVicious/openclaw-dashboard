# Demo Data Setup

This guide helps you set up demo data to quickly get started with Mission Control and showcase its features.

## Quick Setup

The application includes a comprehensive seeding script that automatically creates demo data. Run:

```bash
npm run db:seed
```

This will create:
- Demo users with different roles
- Sample dashboards with widgets
- Metrics data
- Activity history
- Team structure
- AI insights
- Alerts and notifications

## Demo Users

The seeding script creates these demo accounts:

### Admin User
- **Email**: `admin@mission-control.dev`
- **Password**: `demo123`
- **Role**: Admin
- **Access**: Full system access

### Standard Users
- **Sarah Johnson** (`sarah@example.com`) - Team lead
- **Mike Chen** (`mike@example.com`) - Data analyst  
- **Emma Davis** (`emma@example.com`) - Marketing manager
- **Alex Rodriguez** (`alex@example.com`) - Developer

**Password for all demo users**: `demo123`

## Demo Dashboards

### 1. Main Dashboard
**URL**: `/dashboards/main-dashboard

**Widgets**:
- **Revenue Metrics**: Monthly, quarterly, and yearly revenue
- **User Analytics**: Active users, new signups, retention rate
- **Performance Indicators**: Conversion rate, system health, response time
- **AI Insights**: Automated business intelligence

### 2. Sales Analytics
**URL**: `/dashboards/sales-analytics

**Widgets**:
- **Sales Pipeline**: Deals in different stages
- **Geographic Distribution**: Sales by region
- **Product Performance**: Top-selling products
- **Sales Team Metrics**: Individual and team performance

### 3. Marketing Performance
**URL**: `/dashboards/marketing-performance

**Widgets**:
- **Campaign ROI**: Return on investment for each campaign
- **Traffic Sources**: Website traffic breakdown
- **Lead Generation**: Leads by channel and quality
- **Content Performance**: Blog posts, social media engagement

## Sample Metrics Data

The demo includes realistic sample data for:

### Business Metrics
```javascript
{
  monthlyRevenue: 125000, // USD
  activeUsers: 2543,
  conversionRate: 3.24, // percentage
  customerSatisfaction: 4.2, // stars out of 5
  systemUptime: 99.9, // percentage
  responseTime: 245 // milliseconds
}
```

### Time Series Data
Historical data is generated for the past 12 months with realistic trends:
- Seasonal variations
- Growth patterns
- Anomaly detection examples
- Correlation between metrics

### Geographic Data
Sample data includes:
- Revenue by country/region
- User distribution
- Performance metrics by location
- Time zone considerations

## Activity Feed Demo

The activity feed shows realistic team collaboration:

```javascript
{
  activities: [
    {
      user: "Sarah Johnson",
      action: "updated dashboard",
      target: "Sales Analytics",
      timestamp: "2024-01-15T14:30:00Z",
      type: "UPDATE"
    },
    {
      user: "Mike Chen", 
      action: "created new metric",
      target: "Customer Satisfaction",
      timestamp: "2024-01-15T13:45:00Z",
      type: "CREATE"
    },
    {
      user: "Emma Davis",
      action: "shared report", 
      target: "Q4 Performance",
      timestamp: "2024-01-15T12:20:00Z",
      type: "SHARE"
    }
  ]
}
```

## AI Insights Demo

The AI insights feature demonstrates:

### Trend Detection
- Revenue growth patterns
- User engagement trends
- Performance improvements

### Anomaly Detection
- Unusual spikes in metrics
- Performance degradation alerts
- Business process irregularities

### Predictive Analytics
- Revenue forecasting
- User growth predictions
- System capacity planning

### Automated Recommendations
- Optimization opportunities
- Risk mitigation strategies
- Performance improvements

## Team Collaboration Demo

### Team Structure
```javascript
{
  team: "Mission Control Team",
  members: [
    { name: "Admin User", role: "OWNER" },
    { name: "Sarah Johnson", role: "ADMIN" },
    { name: "Mike Chen", role: "MEMBER" },
    { name: "Emma Davis", role: "MEMBER" },
    { name: "Alex Rodriguez", role: "MEMBER" }
  ]
}
```

### Permission Levels
- **Owner**: Full access, billing, team management
- **Admin**: Dashboard management, user management
- **Member**: View dashboards, create personal dashboards

## Alert System Demo

### Sample Alerts
```javascript
{
  alerts: [
    {
      title: "High CPU Usage",
      description: "Server CPU usage has exceeded 80%",
      severity: "HIGH",
      conditions: { metric: "cpu_usage", threshold: 80 }
    },
    {
      title: "Low Conversion Rate",
      description: "Conversion rate dropped below 3%",
      severity: "MEDIUM", 
      conditions: { metric: "conversion_rate", threshold: 3 }
    }
  ]
}
```

### Notification System
- Real-time notifications for critical alerts
- Email notifications for team members
- Slack integration (if configured)
- In-app notification center

## Customizing Demo Data

### Adding Your Own Metrics
Edit the seeding script to include your business metrics:

```typescript
// In prisma/seed.ts
const customMetrics = [
  {
    name: 'Your Custom Metric',
    value: 1000,
    unit: 'units',
    timestamp: new Date()
  }
]
```

### Creating Custom Dashboards
Modify the dashboard creation section:

```typescript
const customDashboards = [
  {
    name: 'Your Dashboard',
    description: 'Your custom dashboard',
    userId: adminUser.id,
    isPublic: true
  }
]
```

### Adding Team Members
Add your team members to the demo:

```typescript
const teamMembers = [
  {
    name: 'Your Name',
    email: 'you@yourcompany.com',
    role: 'ADMIN'
  }
]
```

## Data Refresh

To refresh demo data:

1. **Reset database** (⚠️ This will delete all data):
   ```bash
   npm run db:reset
   npm run db:seed
   ```

2. **Update existing data**:
   ```bash
   npm run db:seed
   ```

3. **Generate new time series data**:
   ```bash
   npm run demo:generate-data
   ```

## Performance Testing

The demo data includes realistic load testing scenarios:

### Load Testing
- Simulate 1000+ concurrent users
- Test dashboard performance
- Measure API response times

### Stress Testing
- High volume data ingestion
- Real-time updates simulation
- Database performance under load

## Demo Scenarios

### Scenario 1: Daily Operations Review
1. Login as admin user
2. Review main dashboard metrics
3. Check recent activity feed
4. Analyze AI insights
5. Review and respond to alerts

### Scenario 2: Team Collaboration
1. Login as different team members
2. Create and share dashboards
3. Add comments and annotations
4. Set up team alerts
5. Export reports for stakeholders

### Scenario 3: Business Intelligence
1. Explore analytics dashboards
2. Drill down into metrics
3. Compare time periods
4. Generate custom reports
5. Export data for further analysis

### Scenario 4: System Administration
1. Configure alerts and thresholds
2. Manage user permissions
3. Monitor system health
4. Review audit logs
5. Set up integrations

## Troubleshooting Demo Data

### Common Issues

**Missing Demo Data**
```bash
# Re-run the seeding script
npm run db:seed
```

**Demo Users Not Working**
```bash
# Reset and re-seed
npm run db:reset
npm run db:seed
```

**Metrics Not Updating**
```bash
# Generate fresh data
npm run demo:generate-data
```

### Getting Help

- Check the [troubleshooting guide](../docs/troubleshooting.md)
- Review the [API documentation](../docs/api-endpoints.md)
- Join our community Discord
- Open an issue on GitHub

## Next Steps

After exploring the demo data:

1. **Customize for your business**: Replace demo metrics with your KPIs
2. **Set up real integrations**: Connect to your data sources
3. **Invite your team**: Add real team members and permissions
4. **Configure alerts**: Set up meaningful thresholds
5. **Deploy to production**: Follow the [deployment guide](../docs/deployment.md)

The demo data is designed to showcase the full capabilities of Mission Control while providing a realistic preview of how the platform will work with your actual business data.