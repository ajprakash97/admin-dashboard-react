import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [showExportModal, setShowExportModal] = useState(false)
  const quickActions = [
    { label: 'New User', icon: '👤', to: '/users', color: 'bg-brand' },
    { label: 'Add Product', icon: '📦', to: '/products', color: 'bg-emerald-500' },
    { label: 'Generate Report', icon: '📊', to: '/reports', color: 'bg-purple-500' },
    { label: 'View Analytics', icon: '📈', to: '/analytics', color: 'bg-amber-500' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Overview</h1>
          <p className="mt-1 text-sm text-slate-600">
            High-level snapshot of your product, users, and revenue. This page is intentionally generic so
            you can plug in any backend.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/reports')}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-dark"
          >
            New Report
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
          >
            Export
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Active Users</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">2,451</p>
          <p className="mt-1 text-xs text-emerald-600">+18.3% vs last week</p>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Monthly Recurring</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">$18,920</p>
          <p className="mt-1 text-xs text-emerald-600">+6.1% vs last month</p>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Error Rate</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">0.47%</p>
          <p className="mt-1 text-xs text-amber-600">Stable</p>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Response Time</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">142ms</p>
          <p className="mt-1 text-xs text-emerald-600">-12ms vs last week</p>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {quickActions.map((action, idx) => (
          <Link
            key={idx}
            to={action.to}
            className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color} text-lg text-white`}
            >
              {action.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{action.label}</p>
              <p className="text-xs text-slate-500">Quick action</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-[2fr,1.2fr]">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">Traffic by Channel</h2>
            <span className="text-xs text-slate-500">Last 7 days</span>
          </div>
          <div className="mt-4 grid gap-3 text-xs text-slate-700 md:grid-cols-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span>Organic</span>
                <span className="font-mono text-slate-900">42%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-[42%] rounded-full bg-brand" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span>Paid</span>
                <span className="font-mono text-slate-900">27%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-[27%] rounded-full bg-emerald-500" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span>Referral</span>
                <span className="font-mono text-slate-900">19%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-[19%] rounded-full bg-purple-500" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span>Other</span>
                <span className="font-mono text-slate-900">12%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-[12%] rounded-full bg-amber-400" />
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">Today&apos;s Activity</h2>
            <Link
              to="/notifications"
              className="text-xs text-brand hover:text-brand-dark"
            >
              View all
            </Link>
          </div>
          <ul className="mt-4 space-y-3 text-xs text-slate-700">
            <li className="flex items-start justify-between gap-3">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <div className="flex-1">
                <p className="font-medium text-slate-900">New deployment</p>
                <p className="text-slate-600">Version 2.3.1 rolled out to all regions.</p>
              </div>
              <span className="whitespace-nowrap text-slate-500">09:14</span>
            </li>
            <li className="flex items-start justify-between gap-3">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
              <div className="flex-1">
                <p className="font-medium text-slate-900">Billing spike</p>
                <p className="text-slate-600">Unusual activity detected on 3 accounts.</p>
              </div>
              <span className="whitespace-nowrap text-slate-500">10:02</span>
            </li>
            <li className="flex items-start justify-between gap-3">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-sky-500" />
              <div className="flex-1">
                <p className="font-medium text-slate-900">Support queue</p>
                <p className="text-slate-600">Average response time is 3m 18s.</p>
              </div>
              <span className="whitespace-nowrap text-slate-500">10:41</span>
            </li>
          </ul>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">Recent Users</h2>
            <Link
              to="/users"
              className="text-xs text-brand hover:text-brand-dark"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { name: 'Jane Cooper', role: 'Admin', time: '2m ago' },
              { name: 'Cody Fisher', role: 'Editor', time: '15m ago' },
              { name: 'Kristin Watson', role: 'Viewer', time: '1h ago' },
            ].map((user, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-slate-700">
                  {user.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-600">{user.role}</p>
                </div>
                <span className="text-xs text-slate-500">{user.time}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">Top Products</h2>
            <Link
              to="/products"
              className="text-xs text-brand hover:text-brand-dark"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { name: 'Premium Plan', revenue: '$123,255', users: '1,245' },
              { name: 'Enterprise License', revenue: '$85,432', users: '342' },
              { name: 'Basic Plan', revenue: '$16,466', users: '567' },
            ].map((product, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-900">{product.name}</p>
                  <p className="text-[11px] text-slate-600">{product.users} users</p>
                </div>
                <span className="text-xs font-medium text-slate-900">{product.revenue}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Export Dashboard Data</h2>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4">
              <p className="mb-4 text-sm text-slate-600">
                Choose a format to export your dashboard data:
              </p>
              <div className="space-y-2">
                {['CSV', 'Excel', 'JSON', 'PDF'].map((format) => (
                  <button
                    key={format}
                    onClick={() => {
                      let content = ''
                      let mimeType = ''
                      let fileName = `dashboard-export-${new Date().toISOString().split('T')[0]}`

                      if (format === 'CSV') {
                        content = 'Metric,Value,Change\nActive Users,1245,+12%\nMRR,$45,230,+8.2%\nError Rate,0.12%,-0.03%\nResponse Time,245ms,-15ms'
                        mimeType = 'text/csv'
                        fileName += '.csv'
                      } else if (format === 'JSON') {
                        content = JSON.stringify(
                          {
                            metrics: {
                              activeUsers: 1245,
                              mrr: 45230,
                              errorRate: 0.12,
                              responseTime: 245,
                            },
                            exportedAt: new Date().toISOString(),
                          },
                          null,
                          2,
                        )
                        mimeType = 'application/json'
                        fileName += '.json'
                      } else if (format === 'Excel') {
                        content = 'Metric,Value,Change\nActive Users,1245,+12%\nMRR,$45,230,+8.2%\nError Rate,0.12%,-0.03%\nResponse Time,245ms,-15ms'
                        mimeType = 'application/vnd.ms-excel'
                        fileName += '.csv'
                      } else {
                        content = 'Dashboard Export Report\n\nActive Users: 1,245 (+12%)\nMRR: $45,230 (+8.2%)\nError Rate: 0.12% (-0.03%)\nResponse Time: 245ms (-15ms)'
                        mimeType = 'text/plain'
                        fileName += '.txt'
                      }

                      const blob = new Blob([content], { type: mimeType })
                      const url = URL.createObjectURL(blob)
                      const link = document.createElement('a')
                      link.href = url
                      link.download = fileName
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                      URL.revokeObjectURL(url)

                      showToast(`Dashboard data exported as ${format}`, 'success')
                      setShowExportModal(false)
                    }}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:border-brand hover:bg-gray-50"
                  >
                    Export as {format}
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs font-medium text-slate-900">Export Options</p>
                <div className="mt-2 space-y-1.5 text-xs text-slate-600">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-3 w-3 rounded border-gray-300 text-brand focus:ring-brand"
                    />
                    <span>Include metrics</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-3 w-3 rounded border-gray-300 text-brand focus:ring-brand"
                    />
                    <span>Include charts data</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-3 w-3 rounded border-gray-300 text-brand focus:ring-brand"
                    />
                    <span>Include activity log</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setShowExportModal(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
