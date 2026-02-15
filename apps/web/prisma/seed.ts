import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo users
  const demoUsers = [
    {
      name: 'Demo Admin',
      email: 'admin@mission-control.dev',
      password: await bcrypt.hash('demo123', 10),
      role: 'ADMIN' as const,
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      password: await bcrypt.hash('demo123', 10),
      role: 'USER' as const,
    },
    {
      name: 'Mike Chen',
      email: 'mike@example.com',
      password: await bcrypt.hash('demo123', 10),
      role: 'USER' as const,
    },
    {
      name: 'Emma Davis',
      email: 'emma@example.com',
      password: await bcrypt.hash('demo123', 10),
      role: 'USER' as const,
    },
  ]

  for (const userData of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    })
    console.log(`✅ Created user: ${user.name} (${user.email})`)
  }

  // Create demo dashboards
  const adminUser = await prisma.user.findFirst({
    where: { email: 'admin@mission-control.dev' }
  })

  if (adminUser) {
    const dashboards = [
      {
        name: 'Main Dashboard',
        description: 'Overview of key business metrics',
        userId: adminUser.id,
        isPublic: true,
      },
      {
        name: 'Sales Analytics',
        description: 'Detailed sales performance metrics',
        userId: adminUser.id,
        isPublic: false,
      },
      {
        name: 'Marketing Performance',
        description: 'Marketing campaign analytics',
        userId: adminUser.id,
        isPublic: true,
      },
    ]

    for (const dashboardData of dashboards) {
      const dashboard = await prisma.dashboard.upsert({
        where: { name: dashboardData.name },
        update: {},
        create: dashboardData,
      })
      console.log(`✅ Created dashboard: ${dashboard.name}`)
    }
  }

  // Create demo metrics
  const metrics = [
    { name: 'Monthly Revenue', value: 125000, unit: 'USD' },
    { name: 'Active Users', value: 2543, unit: 'users' },
    { name: 'Conversion Rate', value: 3.24, unit: '%' },
    { name: 'System Uptime', value: 99.9, unit: '%' },
    { name: 'Customer Satisfaction', value: 4.2, unit: 'stars' },
    { name: 'Response Time', value: 245, unit: 'ms' },
  ]

  for (const metricData of metrics) {
    const metric = await prisma.metric.create({
      data: {
        ...metricData,
        timestamp: new Date(),
      },
    })
    console.log(`✅ Created metric: ${metric.name} = ${metric.value}${metric.unit}`)
  }

  // Create demo team
  if (adminUser) {
    const team = await prisma.team.upsert({
      where: { name: 'Mission Control Team' },
      update: {},
      create: {
        name: 'Mission Control Team',
        description: 'Main team for Mission Control operations',
        ownerId: adminUser.id,
      },
    })
    console.log(`✅ Created team: ${team.name}`)

    // Add team members
    const users = await prisma.user.findMany({
      where: { email: { not: 'admin@mission-control.dev' } }
    })

    for (const user of users) {
      await prisma.teamMember.upsert({
        where: {
          userId_teamId: {
            userId: user.id,
            teamId: team.id,
          }
        },
        update: {},
        create: {
          userId: user.id,
          teamId: team.id,
          role: 'MEMBER',
        },
      })
      console.log(`✅ Added ${user.name} to team`)
    }
  }

  // Create demo alerts
  const alerts = [
    {
      title: 'High CPU Usage',
      description: 'Server CPU usage has exceeded 80% for the past 5 minutes',
      severity: 'HIGH' as const,
      conditions: { metric: 'cpu_usage', threshold: 80, duration: 300 },
      userId: adminUser!.id,
    },
    {
      title: 'Low Conversion Rate',
      description: 'Conversion rate has dropped below 3% for the past 24 hours',
      severity: 'MEDIUM' as const,
      conditions: { metric: 'conversion_rate', threshold: 3, duration: 86400 },
      userId: adminUser!.id,
    },
  ]

  for (const alertData of alerts) {
    const alert = await prisma.alert.upsert({
      where: { title: alertData.title },
      update: {},
      create: alertData,
    })
    console.log(`✅ Created alert: ${alert.title}`)
  }

  console.log('✅ Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Database seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })