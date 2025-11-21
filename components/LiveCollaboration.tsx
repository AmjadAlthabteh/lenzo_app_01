"use client"
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { io, Socket } from 'socket.io-client'

interface Collaborator {
  id: string
  name: string
  image?: string
  cursorPos?: { x: number; y: number }
}

interface LiveCollaborationProps {
  postId: string
  onEdit?: (field: string, value: string) => void
}

export function LiveCollaboration({ postId, onEdit }: LiveCollaborationProps) {
  const { data: session } = useSession()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!session?.user) return

    const socketInstance = io({
      path: '/socket.io/',
    })

    socketInstance.on('connect', () => {
      setIsConnected(true)

      socketInstance.emit('join-collaboration', {
        postId,
        userId: (session.user as any).id,
        userName: session.user.name,
      })
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
    })

    socketInstance.on('collaborators-update', (data: { collaborators: any[] }) => {
      setCollaborators(
        data.collaborators.map((c) => ({
          id: c.user.id,
          name: c.user.name,
          image: c.user.image,
        }))
      )
    })

    socketInstance.on('user-joined', (data: { userId: string; userName: string }) => {
      console.log(`${data.userName} joined the collaboration`)
    })

    socketInstance.on('user-left', (data: { userId: string }) => {
      setCollaborators((prev) => prev.filter((c) => c.id !== data.userId))
    })

    socketInstance.on('edit-update', (edit: any) => {
      if (onEdit) {
        onEdit(edit.field, edit.value)
      }
    })

    socketInstance.on('cursor-update', (data: any) => {
      setCollaborators((prev) =>
        prev.map((c) =>
          c.id === data.userId ? { ...c, cursorPos: data.cursorPos } : c
        )
      )
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.emit('leave-collaboration', {
        postId,
        userId: (session.user as any).id,
      })
      socketInstance.disconnect()
    }
  }, [session, postId])

  const broadcastEdit = (field: string, value: string) => {
    if (socket && session?.user) {
      socket.emit('live-edit', {
        postId,
        userId: (session.user as any).id,
        field,
        value,
        timestamp: Date.now(),
      })
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
          }`}
        />
        <span className="text-xs text-gray-300">
          {isConnected ? 'Live' : 'Offline'}
        </span>
      </div>

      {collaborators.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {collaborators.slice(0, 3).map((collaborator) => (
              <div
                key={collaborator.id}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white/20"
                title={collaborator.name}
              >
                {collaborator.name?.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
          <span className="text-xs text-gray-300">
            {collaborators.length} {collaborators.length === 1 ? 'viewer' : 'viewers'}
          </span>
        </div>
      )}
    </div>
  )
}
