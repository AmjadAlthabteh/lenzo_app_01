import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import { prisma } from './prisma'

export interface CollaborationData {
  postId: string
  userId: string
  userName: string
  type: 'edit' | 'view' | 'cursor'
  data?: any
  cursorPos?: { x: number; y: number; selection?: any }
}

export interface LiveEdit {
  postId: string
  userId: string
  field: 'title' | 'story' | 'summary'
  value: string
  timestamp: number
}

let io: SocketIOServer | null = null

export function initializeWebSocket(server: HTTPServer) {
  if (io) return io

  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/socket.io/',
  })

  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id)

    // Join collaboration room
    socket.on('join-collaboration', async (data: { postId: string; userId: string; userName: string }) => {
      const { postId, userId, userName } = data

      socket.join(`post:${postId}`)

      // Update collaboration record
      await prisma.collaboration.upsert({
        where: {
          postId_userId: { postId, userId },
        },
        create: {
          postId,
          userId,
          type: 'view',
          isActive: true,
          lastSeenAt: new Date(),
        },
        update: {
          isActive: true,
          lastSeenAt: new Date(),
        },
      })

      // Get active collaborators
      const collaborators = await prisma.collaboration.findMany({
        where: {
          postId,
          isActive: true,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })

      // Notify others
      socket.to(`post:${postId}`).emit('user-joined', {
        userId,
        userName,
        collaborators: collaborators.length,
      })

      // Send current collaborators to new user
      socket.emit('collaborators-update', { collaborators })
    })

    // Leave collaboration room
    socket.on('leave-collaboration', async (data: { postId: string; userId: string }) => {
      const { postId, userId } = data

      socket.leave(`post:${postId}`)

      await prisma.collaboration.updateMany({
        where: {
          postId,
          userId,
        },
        data: {
          isActive: false,
        },
      })

      socket.to(`post:${postId}`).emit('user-left', { userId })
    })

    // Live editing
    socket.on('live-edit', async (edit: LiveEdit) => {
      const { postId, userId, field, value, timestamp } = edit

      // Update collaboration type to edit
      await prisma.collaboration.updateMany({
        where: { postId, userId },
        data: {
          type: 'edit',
          lastSeenAt: new Date(),
        },
      })

      // Broadcast to others in the room
      socket.to(`post:${postId}`).emit('edit-update', edit)
    })

    // Cursor position updates
    socket.on('cursor-move', async (data: { postId: string; userId: string; cursorPos: any }) => {
      const { postId, userId, cursorPos } = data

      await prisma.collaboration.updateMany({
        where: { postId, userId },
        data: {
          cursorPos: JSON.stringify(cursorPos),
          lastSeenAt: new Date(),
        },
      })

      socket.to(`post:${postId}`).emit('cursor-update', data)
    })

    // Post updates
    socket.on('post-updated', (data: { postId: string; updates: any }) => {
      socket.to(`post:${data.postId}`).emit('post-sync', data.updates)
    })

    // Disconnect
    socket.on('disconnect', async () => {
      console.log('Client disconnected:', socket.id)

      // Mark all collaborations for this socket as inactive
      // Note: In production, you'd want to track socket-to-user mapping
    })
  })

  return io
}

export function getIO(): SocketIOServer | null {
  return io
}

export function emitToPost(postId: string, event: string, data: any) {
  if (io) {
    io.to(`post:${postId}`).emit(event, data)
  }
}

export function emitToUser(userId: string, event: string, data: any) {
  if (io) {
    io.to(`user:${userId}`).emit(event, data)
  }
}

export function broadcastGlobal(event: string, data: any) {
  if (io) {
    io.emit(event, data)
  }
}
