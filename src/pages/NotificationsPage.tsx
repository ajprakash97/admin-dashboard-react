import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'

type NotificationType = 'success' | 'warning' | 'error' | 'info'
type NotificationCategory = 'all' | 'system' | 'user' | 'security' | 'billing'

interface Notification {
  id: number
  type: NotificationType
  category: NotificationCategory
  title: string
  message: string
  time: string
  read: boolean
  priority?: 'high' | 'medium' | 'low'
}

export const NotificationsPage = () => {
  const { showToast } = useToast()
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [categoryFilter, setCategoryFilter] = useState<NotificationCategory>('all')
  const [showSettings, setShowSettings] = useState(false)

  const notifications: Notification[] = [
    {
      id: 1,
      type: 'success',
      category: 'user',
      title: 'New user registered',
      message: 'Jane Cooper has created an account',
      time: '2 minutes ago',
      read: false,
      priority: 'low',
    },
    {
      id: 2,
      type: 'warning',
      category: 'system',
      title: 'High error rate detected',
      message: 'Error rate exceeded 5% threshold in the last hour',
      time: '15 minutes ago',
      read: false,
      priority: 'high',
    },
    {
      id: 3,
      type: 'info',
      category: 'system',
      title: 'System backup completed',
      message: 'Daily backup completed successfully at 02:00 UTC',
      time: '1 hour ago',
      read: true,
      priority: 'low',
    },
    {
      id: 4,
      type: 'error',
      category: 'billing',
      title: 'Payment failed',
      message: 'Failed to process payment for subscription #1234',
      time: '2 hours ago',
      read: false,
      priority: 'high',
    },
    {
      id: 5,
      type: 'success',
      category: 'system',
      title: 'Report generated',
      message: 'Monthly revenue report is ready for download',
      time: '3 hours ago',
      read: true,
      priority: 'medium',
    },
    {
      id: 6,
      type: 'info',
      category: 'system',
      title: 'New feature available',
      message: 'Advanced analytics dashboard is now available',
      time: '1 day ago',
      read: true,
      priority: 'low',
    },
    {
      id: 7,
      type: 'warning',
      category: 'security',
      title: 'Unusual login activity',
      message: 'Login attempt from new location detected',
      time: '4 hours ago',
      read: false,
      priority: 'high',
    },
    {
      id: 8,
      type: 'success',
      category: 'billing',
      title: 'Payment received',
      message: 'Payment of $99.00 processed successfully',
      time: '5 hours ago',
      read: true,
      priority: 'medium',
    },
  ]

  const filteredNotifications = notifications.filter((notification) => {
    const matchesReadFilter =
      filter === 'all' ||
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read)
    const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter
    return matchesReadFilter && matchesCategory
  })

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300'
      case 'warning':
        return 'bg-amber-100 text-amber-700 border-amber-300'
      case 'error':
        return 'bg-rose-100 text-rose-700 border-rose-300'
      default:
        return 'bg-sky-100 text-sky-700 border-sky-300'
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-100 text-rose-700'
      case 'medium':
        return 'bg-amber-100 text-amber-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    today: notifications.filter((n) => n.time.includes('minute') || n.time.includes('hour')).length,
    highPriority: notifications.filter((n) => n.priority === 'high' && !n.read).length,
  }

  const markAllAsRead = () => {
    showToast('All notifications marked as read', 'success')
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Notifications</h1>
          <p className="mt-1 text-sm text-slate-600">
            Stay updated with system alerts, user activities, security events, and important business notifications.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={markAllAsRead}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
          >
            Mark all read
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-dark"
          >
            Settings
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.total}</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Unread</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.unread}</p>
          {stats.unread > 0 && (
            <p className="mt-1 text-xs text-rose-600">{stats.highPriority} high priority</p>
          )}
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Today</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.today}</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">High Priority</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.highPriority}</p>
        </article>
      </section>

      <section className="flex flex-wrap gap-2">
        <div className="flex rounded-md border border-gray-300 bg-white">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-brand text-white'
                  : 'text-slate-700 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex rounded-md border border-gray-300 bg-white">
          {(['all', 'system', 'user', 'security', 'billing'] as NotificationCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${
                categoryFilter === cat
                  ? 'bg-gray-100 text-slate-900'
                  : 'text-slate-700 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start gap-4 rounded-xl border p-4 shadow-sm transition-colors ${
              notification.read
                ? 'border-gray-200 bg-gray-50'
                : 'border-gray-300 bg-white'
            } ${notification.priority === 'high' && !notification.read ? 'ring-2 ring-rose-200' : ''}`}
          >
            <div
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${getTypeColor(notification.type)}`}
            >
              {notification.type === 'success' && '✓'}
              {notification.type === 'warning' && '⚠'}
              {notification.type === 'error' && '✕'}
              {notification.type === 'info' && 'ℹ'}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                    {notification.priority && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${getPriorityColor(notification.priority)}`}
                      >
                        {notification.priority}
                      </span>
                    )}
                    <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                      {notification.category}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-600">{notification.message}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs text-slate-500">{notification.time}</span>
                  {!notification.read && (
                    <span className="h-2 w-2 rounded-full bg-brand" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {filteredNotifications.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-sm text-slate-600">No notifications found matching your criteria</p>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Notification Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600">Email Notifications</label>
                  <div className="mt-2 space-y-2">
                    {['System alerts', 'User activities', 'Security events', 'Billing updates'].map(
                      (type, idx) => (
                        <label key={idx} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked={idx < 2}
                            className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                          />
                          <span className="text-sm text-slate-700">{type}</span>
                        </label>
                      ),
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Push Notifications</label>
                  <div className="mt-2 space-y-2">
                    {['High priority only', 'All notifications', 'Disabled'].map((option, idx) => (
                      <label key={idx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="push"
                          defaultChecked={idx === 0}
                          className="h-4 w-4 border-gray-300 text-brand focus:ring-brand"
                        />
                        <span className="text-sm text-slate-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Quiet Hours</label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="time"
                      defaultValue="22:00"
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                    <span className="text-sm text-slate-600">to</span>
                    <input
                      type="time"
                      defaultValue="08:00"
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </div>
                </div>
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                // In a real app, this would save settings to backend
                showToast('Settings saved', 'success')
                setShowSettings(false)
              }}
            >
              <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
