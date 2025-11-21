import { prisma } from './prisma'
import { encryptJSON } from './encryption'

export interface ActivityData {
  userId: string
  action: string
  entityType?: string
  entityId?: string
  metadata?: any
  ipAddress?: string
  userAgent?: string
}

export async function logActivity(data: ActivityData) {
  try {
    await prisma.activity.create({
      data: {
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        metadata: data.metadata ? encryptJSON(data.metadata) : null,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    })
  } catch (error) {
    console.error('Failed to log activity:', error)
  }
}

export async function getUserActivities(userId: string, limit = 50) {
  return prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function getRecentActivities(limit = 100) {
  return prisma.activity.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}
