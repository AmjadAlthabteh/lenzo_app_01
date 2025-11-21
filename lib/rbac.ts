import { prisma } from './prisma'
import { User } from '@prisma/client'

export const ROLES = {
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const

export const PERMISSIONS = {
  // Post permissions
  'post:create': 'Create posts',
  'post:read': 'Read posts',
  'post:update': 'Update own posts',
  'post:update:any': 'Update any post',
  'post:delete': 'Delete own posts',
  'post:delete:any': 'Delete any post',
  'post:moderate': 'Moderate posts',

  // User permissions
  'user:read': 'Read user profiles',
  'user:update': 'Update own profile',
  'user:update:any': 'Update any user',
  'user:delete:any': 'Delete any user',
  'user:manage:roles': 'Manage user roles',

  // Admin permissions
  'admin:access': 'Access admin panel',
  'admin:analytics': 'View analytics',
  'admin:settings': 'Modify settings',
  'admin:permissions': 'Manage permissions',

  // Collaboration permissions
  'collaboration:create': 'Create collaborations',
  'collaboration:manage': 'Manage collaborations',
} as const

export type Permission = keyof typeof PERMISSIONS

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  USER: [
    'post:create',
    'post:read',
    'post:update',
    'post:delete',
    'user:read',
    'user:update',
    'collaboration:create',
  ],
  MODERATOR: [
    'post:create',
    'post:read',
    'post:update',
    'post:update:any',
    'post:delete',
    'post:moderate',
    'user:read',
    'user:update',
    'collaboration:create',
    'collaboration:manage',
  ],
  ADMIN: [
    'post:create',
    'post:read',
    'post:update',
    'post:update:any',
    'post:delete',
    'post:delete:any',
    'post:moderate',
    'user:read',
    'user:update',
    'user:update:any',
    'collaboration:create',
    'collaboration:manage',
    'admin:access',
    'admin:analytics',
    'admin:settings',
  ],
  SUPER_ADMIN: Object.keys(PERMISSIONS) as Permission[],
}

export async function hasPermission(
  userId: string,
  permission: Permission
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { permissions: { include: { permission: true } } },
  })

  if (!user) return false

  // Check role-based permissions
  const rolePermissions = ROLE_PERMISSIONS[user.role] || []
  if (rolePermissions.includes(permission)) return true

  // Check custom permissions
  const customPermissions = user.permissions.map(up => up.permission.name)
  return customPermissions.includes(permission)
}

export async function hasRole(userId: string, role: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  return user?.role === role
}

export async function hasAnyRole(
  userId: string,
  roles: string[]
): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  return user ? roles.includes(user.role) : false
}

export function requireRole(roles: string | string[]) {
  const roleArray = Array.isArray(roles) ? roles : [roles]

  return async function (userId: string) {
    const hasRequiredRole = await hasAnyRole(userId, roleArray)
    if (!hasRequiredRole) {
      throw new Error('Insufficient permissions')
    }
  }
}

export function requirePermission(permission: Permission) {
  return async function (userId: string) {
    const hasRequiredPermission = await hasPermission(userId, permission)
    if (!hasRequiredPermission) {
      throw new Error(`Missing permission: ${permission}`)
    }
  }
}

export async function grantPermission(
  userId: string,
  permissionName: Permission
) {
  const permission = await prisma.permission.upsert({
    where: { name: permissionName },
    create: {
      name: permissionName,
      description: PERMISSIONS[permissionName],
    },
    update: {},
  })

  await prisma.userPermission.upsert({
    where: {
      userId_permissionId: {
        userId,
        permissionId: permission.id,
      },
    },
    create: {
      userId,
      permissionId: permission.id,
    },
    update: {},
  })
}

export async function revokePermission(
  userId: string,
  permissionName: Permission
) {
  const permission = await prisma.permission.findUnique({
    where: { name: permissionName },
  })

  if (!permission) return

  await prisma.userPermission.delete({
    where: {
      userId_permissionId: {
        userId,
        permissionId: permission.id,
      },
    },
  })
}
