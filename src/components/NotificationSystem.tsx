"use client"

import { useState, useEffect, useRef } from 'react'
import { Bell, X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationSystemProps {
  userId?: string
}

export function NotificationSystem({ userId }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const wsRef = useRef<WebSocket | null>(null)

  // Mock notifications for demo
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated with new information.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        read: false
      },
      {
        id: '2',
        type: 'info',
        title: 'New Follower',
        message: 'You have a new follower on your profile.',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        read: false,
        action: {
          label: 'View Profile',
          onClick: () => console.log('View profile clicked')
        }
      },
      {
        id: '3',
        type: 'warning',
        title: 'Analytics Update',
        message: 'Your analytics data is being processed. This may take a few minutes.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: true
      }
    ]
    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter(n => !n.read).length)
  }, [])

  // WebSocket connection for real-time notifications
  useEffect(() => {
    if (!userId) return

    // Mock WebSocket connection
    const connectWebSocket = () => {
      // In a real app, you'd connect to your WebSocket server
      // wsRef.current = new WebSocket(`ws://localhost:3001/notifications/${userId}`)
      
      // Simulate real-time notifications
      const interval = setInterval(() => {
        const shouldAddNotification = Math.random() > 0.8 // 20% chance
        if (shouldAddNotification) {
          addNotification({
            type: ['success', 'info', 'warning', 'error'][Math.floor(Math.random() * 4)] as Notification['type'],
            title: 'Real-time Update',
            message: 'This is a real-time notification from the server.',
            action: Math.random() > 0.5 ? {
              label: 'Take Action',
              onClick: () => console.log('Action taken')
            } : undefined
          })
        }
      }, 10000) // Check every 10 seconds

      return () => clearInterval(interval)
    }

    const cleanup = connectWebSocket()
    return cleanup
  }, [userId])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    
    setNotifications(prev => [newNotification, ...prev])
    setUnreadCount(prev => prev + 1)
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
    setUnreadCount(0)
  }

  const removeNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id)
    setNotifications(prev => prev.filter(n => n.id !== id))
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-muted/50 transition-colors ${
                      !notification.read ? 'bg-muted/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNotification(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.timestamp)}
                          </span>
                          <div className="flex gap-2">
                            {notification.action && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={notification.action.onClick}
                                className="h-6 text-xs"
                              >
                                {notification.action.label}
                              </Button>
                            )}
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-6 text-xs"
                              >
                                Mark read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 