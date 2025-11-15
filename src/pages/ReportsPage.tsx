import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'

type ReportType = 'Revenue' | 'Users' | 'Products' | 'System' | 'Analytics' | 'Custom'
type ReportStatus = 'Generated' | 'Generating' | 'Failed' | 'Scheduled'
type ExportFormat = 'PDF' | 'CSV' | 'Excel' | 'JSON'

interface Report {
  id: number
  name: string
  type: ReportType
  period: string
  status: ReportStatus
  createdAt: string
  size: string
  format?: ExportFormat
  scheduled?: boolean
  nextRun?: string
}

export const ReportsPage = () => {
  const { showToast } = useToast()
  const [showReportBuilder, setShowReportBuilder] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null)
  const [reportName, setReportName] = useState('')
  const [reportPeriod, setReportPeriod] = useState('30d')
  const [typeFilter, setTypeFilter] = useState<'all' | ReportType>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | ReportStatus>('all')
  const [sortField, setSortField] = useState<'name' | 'type' | 'status' | 'createdAt'>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const reports: Report[] = [
    {
      id: 1,
      name: 'Monthly Revenue Report',
      type: 'Revenue',
      period: 'Last 30 days',
      status: 'Generated',
      createdAt: '2 hours ago',
      size: '2.4 MB',
      format: 'PDF',
    },
    {
      id: 2,
      name: 'User Activity Summary',
      type: 'Users',
      period: 'Last 7 days',
      status: 'Generating',
      createdAt: '15 minutes ago',
      size: '—',
    },
    {
      id: 3,
      name: 'Product Performance Analysis',
      type: 'Products',
      period: 'Last quarter',
      status: 'Generated',
      createdAt: '1 day ago',
      size: '5.1 MB',
      format: 'Excel',
    },
    {
      id: 4,
      name: 'System Health Check',
      type: 'System',
      period: 'Last 24 hours',
      status: 'Generated',
      createdAt: '3 days ago',
      size: '892 KB',
      format: 'PDF',
    },
    {
      id: 5,
      name: 'Weekly Analytics Dashboard',
      type: 'Analytics',
      period: 'Last 7 days',
      status: 'Scheduled',
      createdAt: '1 week ago',
      size: '—',
      scheduled: true,
      nextRun: 'In 2 days',
    },
    {
      id: 6,
      name: 'Custom Business Report',
      type: 'Custom',
      period: 'Last month',
      status: 'Generated',
      createdAt: '5 days ago',
      size: '3.2 MB',
      format: 'PDF',
    },
  ]

  const reportTypes: ReportType[] = ['Revenue', 'Users', 'Products', 'System', 'Analytics', 'Custom']

  const filteredReports = reports
    .filter((report) => {
      const matchesType = typeFilter === 'all' || report.type === typeFilter
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter
      return matchesType && matchesStatus
    })
    .sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'type':
          aValue = a.type
          bValue = b.type
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'createdAt':
          // Simple comparison - in real app, parse dates properly
          aValue = a.createdAt
          bValue = b.createdAt
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  const handleSort = (field: 'name' | 'type' | 'status' | 'createdAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleCreateReport = () => {
    if (selectedReportType && reportName) {
      showToast(`Creating ${reportName} report of type ${selectedReportType}...`, 'info')
      setShowReportBuilder(false)
      setSelectedReportType(null)
      setReportName('')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Reports</h1>
          <p className="mt-1 text-sm text-slate-600">
            Generate, view, and download comprehensive reports. Schedule automated reports for regular delivery.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowScheduleModal(true)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
          >
            Schedule Report
          </button>
          <button
            onClick={() => setShowReportBuilder(true)}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-dark"
          >
            New Report
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Reports</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{reports.length}</p>
          <p className="mt-1 text-xs text-slate-600">
            {reports.filter((r) => r.status === 'Generated').length} ready
          </p>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">This Month</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {reports.filter((r) => r.createdAt.includes('hour') || r.createdAt.includes('day')).length}
          </p>
          <p className="mt-1 text-xs text-emerald-600">+15% vs last month</p>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Scheduled</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {reports.filter((r) => r.scheduled).length}
          </p>
          <p className="mt-1 text-xs text-slate-600">Active schedules</p>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Storage Used</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">2.4 GB</p>
          <p className="mt-1 text-xs text-slate-600">of 10 GB limit</p>
        </article>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900">Recent Reports</h2>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-slate-700">
                {filteredReports.length}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'all' | ReportType)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">All Types</option>
              {reportTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | ReportStatus)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">All Status</option>
              <option value="Generated">Generated</option>
              <option value="Generating">Generating</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Failed">Failed</option>
            </select>
            <select
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-')
                setSortField(field as 'name' | 'type' | 'status' | 'createdAt')
                setSortDirection(direction as 'asc' | 'desc')
              }}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="createdAt-desc">Sort: Newest First</option>
              <option value="createdAt-asc">Sort: Oldest First</option>
              <option value="name-asc">Sort: Name A-Z</option>
              <option value="name-desc">Sort: Name Z-A</option>
              <option value="type-asc">Sort: Type A-Z</option>
              <option value="status-asc">Sort: Status A-Z</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50"
            >
              <div className="flex flex-1 items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-xs font-semibold text-slate-700">
                  {report.type[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">{report.name}</p>
                    {report.format && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-slate-600">
                        {report.format}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-600">
                    <span>{report.type}</span>
                    <span>•</span>
                    <span>{report.period}</span>
                    <span>•</span>
                    <span>{report.createdAt}</span>
                    {report.scheduled && report.nextRun && (
                      <>
                        <span>•</span>
                        <span className="text-amber-600">Next: {report.nextRun}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    report.status === 'Generated'
                      ? 'bg-emerald-100 text-emerald-700'
                      : report.status === 'Generating'
                        ? 'bg-amber-100 text-amber-700'
                        : report.status === 'Scheduled'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {report.status}
                </span>
                <span className="text-xs text-slate-600">{report.size}</span>
                <div className="flex gap-1">
                  {report.status === 'Generated' && (
                    <>
                      <button
                        onClick={() => {
                          showToast(`Opening report: ${report.name}`, 'info')
                        }}
                        className="rounded-md border border-gray-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-gray-400"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          showToast(`Downloading report: ${report.name} (${report.size})`, 'info')
                        }}
                        className="rounded-md border border-gray-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-gray-400"
                      >
                        Download
                      </button>
                    </>
                  )}
                  {report.status === 'Scheduled' && (
                    <button
                      onClick={() => {
                        setShowScheduleModal(true)
                      }}
                      className="rounded-md border border-gray-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-gray-400"
                    >
                      Edit Schedule
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Quick Report Types</h2>
          <p className="mt-1 text-xs text-slate-600">
            Generate common reports with one click. Customize parameters after creation.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {reportTypes.map((type, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedReportType(type)
                  setShowReportBuilder(true)
                }}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-brand hover:bg-gray-50"
              >
                {type}
              </button>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Scheduled Reports</h2>
          <p className="mt-1 text-xs text-slate-600">
            Automatically generated reports sent to your email.
          </p>
          <div className="mt-4 space-y-2">
            {[
              { name: 'Weekly Summary', frequency: 'Every Monday', next: 'In 2 days', type: 'Analytics' },
              { name: 'Monthly Revenue', frequency: '1st of month', next: 'In 17 days', type: 'Revenue' },
              { name: 'Daily System Check', frequency: 'Every day at 9 AM', next: 'Tomorrow', type: 'System' },
            ].map((schedule, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
              >
                <div>
                  <p className="text-xs font-medium text-slate-900">{schedule.name}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <p className="text-[11px] text-slate-600">{schedule.frequency}</p>
                    <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] text-slate-600">
                      {schedule.type}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-600">{schedule.next}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      {showReportBuilder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Create New Report</h2>
              <button
                onClick={() => {
                  setShowReportBuilder(false)
                  setSelectedReportType(null)
                  setReportName('')
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!selectedReportType) {
                  showToast('Please select a report type', 'warning')
                  return
                }
                if (!reportName.trim()) {
                  showToast('Please enter a report name', 'warning')
                  return
                }
                handleCreateReport()
              }}
            >
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="report-type" className="block text-xs font-medium text-slate-600">
                      Report Type *
                    </label>
                    <select
                      id="report-type"
                      required
                      value={selectedReportType || ''}
                      onChange={(e) => setSelectedReportType(e.target.value as ReportType)}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    >
                      <option value="">Select report type</option>
                      {reportTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="report-name" className="block text-xs font-medium text-slate-600">
                      Report Name *
                    </label>
                    <input
                      id="report-name"
                      type="text"
                      required
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      placeholder="Enter report name"
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </div>
                  <div>
                    <label htmlFor="report-period" className="block text-xs font-medium text-slate-600">
                      Time Period *
                    </label>
                    <select
                      id="report-period"
                      required
                      value={reportPeriod}
                      onChange={(e) => setReportPeriod(e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                      <option value="1y">Last year</option>
                      <option value="custom">Custom range</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600">Export Format</label>
                    <div className="mt-2 flex gap-2">
                      {(['PDF', 'CSV', 'Excel', 'JSON'] as ExportFormat[]).map((format) => (
                        <button
                          key={format}
                          type="button"
                          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-gray-400"
                        >
                          {format}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowReportBuilder(false)
                    setSelectedReportType(null)
                    setReportName('')
                  }}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  Generate Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Report Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Schedule Report</h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const formData = new FormData(form)
                const recipients = formData.get('recipients') as string

                if (!recipients || !recipients.trim()) {
                  showToast('Please enter at least one recipient email', 'warning')
                  return
                }

                // Validate email format
                const emails = recipients.split(',').map((email) => email.trim())
                const invalidEmails = emails.filter((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))

                if (invalidEmails.length > 0) {
                  showToast(`Invalid email addresses: ${invalidEmails.join(', ')}`, 'error')
                  return
                }

                // In a real app, this would make an API call
                showToast('Report scheduled successfully!', 'success')
                setShowScheduleModal(false)
              }}
            >
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="schedule-report-type" className="block text-xs font-medium text-slate-600">
                      Report Type *
                    </label>
                    <select
                      id="schedule-report-type"
                      name="reportType"
                      required
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    >
                      <option>Revenue</option>
                      <option>Users</option>
                      <option>Products</option>
                      <option>System</option>
                      <option>Analytics</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="schedule-frequency" className="block text-xs font-medium text-slate-600">
                      Frequency *
                    </label>
                    <select
                      id="schedule-frequency"
                      name="frequency"
                      required
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    >
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                      <option>Quarterly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600">Day/Time *</label>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <select
                        name="day"
                        required
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      >
                        <option>Monday</option>
                        <option>Tuesday</option>
                        <option>Wednesday</option>
                        <option>Thursday</option>
                        <option>Friday</option>
                        <option>Saturday</option>
                        <option>Sunday</option>
                        <option>1st of month</option>
                      </select>
                      <input
                        type="time"
                        name="time"
                        required
                        defaultValue="09:00"
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="schedule-recipients" className="block text-xs font-medium text-slate-600">
                      Recipients *
                    </label>
                    <input
                      id="schedule-recipients"
                      type="text"
                      name="recipients"
                      required
                      placeholder="email@example.com"
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                    <p className="mt-1 text-xs text-slate-500">Separate multiple emails with commas</p>
                  </div>
                  <div>
                    <label htmlFor="schedule-format" className="block text-xs font-medium text-slate-600">
                      Export Format *
                    </label>
                    <select
                      id="schedule-format"
                      name="format"
                      required
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    >
                      <option>PDF</option>
                      <option>Excel</option>
                      <option>CSV</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  Schedule Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
