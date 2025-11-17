import { useState, useEffect } from 'react'
import { useToast } from '../contexts/ToastContext'

type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter'
type DataSource = 'sales' | 'users' | 'revenue' | 'custom'
type BackupStatus = 'completed' | 'in-progress' | 'failed' | 'scheduled'
type ArchiveStatus = 'active' | 'archived' | 'restored'

interface KPI {
  id: number
  name: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  target?: string
  category: string
}

interface Backup {
  id: number
  name: string
  type: 'full' | 'incremental'
  status: BackupStatus
  size: string
  createdAt: string
  scheduledAt?: string
}

interface Archive {
  id: number
  name: string
  type: string
  size: string
  archivedAt: string
  status: ArchiveStatus
  retentionUntil: string
}

export const DataInsightsPage = () => {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<'visualization' | 'kpis' | 'import-export' | 'backup' | 'archive' | 'bi'>('visualization')
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('line')
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource>('revenue')
  const [isRealTime, setIsRealTime] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [showKPIBuilder, setShowKPIBuilder] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importProgress, setImportProgress] = useState(0)
  const [isImporting, setIsImporting] = useState(false)
  const [isDraggingImport, setIsDraggingImport] = useState(false)
  const [importTable, setImportTable] = useState('Users')

  type KpiCategory = 'revenue' | 'marketing' | 'retention' | 'satisfaction' | 'operations'
  const [newKpi, setNewKpi] = useState({
    name: '',
    category: 'revenue' as KpiCategory,
    target: '',
  })

  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isRealTime])

  const generateTimeSeriesData = (days: number, baseValue: number) => {
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      value: baseValue + Math.floor(Math.random() * 5000) - 2500,
    }))
  }

  const revenueData = generateTimeSeriesData(30, 10000)
  const userData = generateTimeSeriesData(30, 500)
  const salesData = generateTimeSeriesData(30, 2000)

  const getCurrentData = () => {
    switch (selectedDataSource) {
      case 'revenue':
        return revenueData
      case 'users':
        return userData
      case 'sales':
        return salesData
      default:
        return revenueData
    }
  }

  const currentData = getCurrentData()
  const maxValue = Math.max(...currentData.map((d) => d.value))

  const handleCreateKpi = () => {
    if (newKpi.name && newKpi.target) {
      showToast(`KPI "${newKpi.name}" created successfully!`, 'success')
      setShowKPIBuilder(false)
      setNewKpi({ name: '', category: 'revenue', target: '' })
    }
  }

  const customKPIs: KPI[] = [
    {
      id: 1,
      name: 'Monthly Recurring Revenue',
      value: '$124,580',
      change: '+12.5%',
      trend: 'up',
      target: '$150,000',
      category: 'Revenue',
    },
    {
      id: 2,
      name: 'Customer Acquisition Cost',
      value: '$45.20',
      change: '-8.3%',
      trend: 'down',
      target: '$40.00',
      category: 'Marketing',
    },
    {
      id: 3,
      name: 'Churn Rate',
      value: '2.4%',
      change: '-0.5%',
      trend: 'down',
      target: '<2%',
      category: 'Retention',
    },
    {
      id: 4,
      name: 'Net Promoter Score',
      value: '72',
      change: '+5',
      trend: 'up',
      target: '75',
      category: 'Satisfaction',
    },
    {
      id: 5,
      name: 'Average Revenue Per User',
      value: '$47.20',
      change: '+5.1%',
      trend: 'up',
      target: '$50.00',
      category: 'Revenue',
    },
  ]

  const backups: Backup[] = [
    {
      id: 1,
      name: 'Full Backup - Daily',
      type: 'full',
      status: 'completed',
      size: '2.4 GB',
      createdAt: '2024-03-15 02:00',
    },
    {
      id: 2,
      name: 'Incremental Backup',
      type: 'incremental',
      status: 'completed',
      size: '156 MB',
      createdAt: '2024-03-15 14:00',
    },
    {
      id: 3,
      name: 'Full Backup - Weekly',
      type: 'full',
      status: 'in-progress',
      size: '—',
      createdAt: '2024-03-15 18:00',
    },
    {
      id: 4,
      name: 'Monthly Archive',
      type: 'full',
      status: 'scheduled',
      size: '—',
      createdAt: '—',
      scheduledAt: '2024-03-31 00:00',
    },
  ]

  const archives: Archive[] = [
    {
      id: 1,
      name: 'Q4 2023 Sales Data',
      type: 'Sales Records',
      size: '1.2 GB',
      archivedAt: '2024-01-01',
      status: 'archived',
      retentionUntil: '2025-01-01',
    },
    {
      id: 2,
      name: 'User Logs - 2023',
      type: 'User Activity',
      size: '856 MB',
      archivedAt: '2024-01-15',
      status: 'archived',
      retentionUntil: '2025-01-15',
    },
    {
      id: 3,
      name: 'Old Product Catalog',
      type: 'Product Data',
      size: '342 MB',
      archivedAt: '2023-12-01',
      status: 'restored',
      retentionUntil: '2024-12-01',
    },
  ]

  const pieChartData = [
    { label: 'Direct', value: 45, color: 'bg-brand' },
    { label: 'Organic Search', value: 30, color: 'bg-emerald-500' },
    { label: 'Social Media', value: 15, color: 'bg-purple-500' },
    { label: 'Referral', value: 10, color: 'bg-amber-400' },
  ]

  const predictions = [
    {
      metric: 'Revenue Forecast',
      current: '$124,580',
      predicted: '$145,000',
      confidence: 85,
      period: 'Next 30 days',
      factors: ['Seasonal trends', 'Marketing campaigns', 'User growth'],
    },
    {
      metric: 'User Growth',
      current: '8,432',
      predicted: '9,200',
      confidence: 78,
      period: 'Next 30 days',
      factors: ['Acquisition rate', 'Retention improvement', 'Market expansion'],
    },
    {
      metric: 'Churn Risk',
      current: '2.4%',
      predicted: '1.8%',
      confidence: 72,
      period: 'Next 7 days',
      factors: ['Engagement scores', 'Support tickets', 'Feature usage'],
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Data & Insights</h1>
          <p className="mt-1 text-sm text-slate-600">
            Comprehensive data visualization, custom KPIs, import/export, backup/restore, and business intelligence.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2">
            <div className={`h-2 w-2 rounded-full ${isRealTime ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-xs font-medium text-slate-700">
              {isRealTime ? 'Live' : 'Paused'}
            </span>
            <button
              onClick={() => setIsRealTime(!isRealTime)}
              className="ml-2 text-xs text-brand hover:text-brand-dark"
            >
              {isRealTime ? 'Pause' : 'Resume'}
            </button>
          </div>
          <span className="text-xs text-slate-500">
            Updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200">
        {[
          { id: 'visualization', label: 'Visualization' },
          { id: 'kpis', label: 'Custom KPIs' },
          { id: 'import-export', label: 'Import/Export' },
          { id: 'backup', label: 'Backup/Restore' },
          { id: 'archive', label: 'Archiving' },
          { id: 'bi', label: 'Business Intelligence' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-brand text-brand'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Visualization Tab */}
      {activeTab === 'visualization' && (
        <div className="space-y-6">
          <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <select
                value={selectedDataSource}
                onChange={(e) => setSelectedDataSource(e.target.value as DataSource)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="revenue">Revenue</option>
                <option value="users">Users</option>
                <option value="sales">Sales</option>
                <option value="custom">Custom Data</option>
              </select>
              <div className="flex rounded-md border border-gray-300 bg-white">
                {(['line', 'bar', 'area', 'pie', 'scatter'] as ChartType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedChartType(type)}
                    className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${
                      selectedChartType === type
                        ? 'bg-brand text-white'
                        : 'text-slate-700 hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400">
              Export Chart
            </button>
          </section>

          <section className="grid gap-4 md:grid-cols-[2fr,1fr]">
            <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                {selectedDataSource.charAt(0).toUpperCase() + selectedDataSource.slice(1)} Trend
              </h2>
              {selectedChartType === 'pie' ? (
                <div className="mt-4 space-y-3">
                  {pieChartData.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-700">{item.label}</span>
                        <span className="font-mono text-slate-900">{item.value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 flex items-end justify-between gap-1">
                  {currentData.map((day, idx) => (
                    <div key={idx} className="flex flex-1 flex-col items-center gap-1">
                      <div className="relative flex h-48 w-full items-end">
                        {selectedChartType === 'line' || selectedChartType === 'area' ? (
                          <div
                            className={`w-full rounded-t-md transition-all hover:opacity-80 ${
                              selectedChartType === 'area' ? 'bg-brand/30' : 'bg-brand'
                            }`}
                            style={{ height: `${(day.value / maxValue) * 100}%` }}
                            title={`${day.value.toLocaleString()}`}
                          />
                        ) : (
                          <div
                            className="w-full rounded-t-md bg-brand transition-all hover:bg-brand-dark"
                            style={{ height: `${(day.value / maxValue) * 100}%` }}
                            title={`${day.value.toLocaleString()}`}
                          />
                        )}
                      </div>
                      {idx % 5 === 0 && (
                        <span className="text-[10px] text-slate-500">{day.date.split(' ')[0]}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">Chart Settings</h2>
              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-600">Time Range</label>
                  <select className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-slate-900">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>Last year</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-600">Aggregation</label>
                  <select className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-slate-900">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="h-3 w-3 rounded border-gray-300 text-brand" />
                    <span className="text-slate-700">Show trend line</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="h-3 w-3 rounded border-gray-300 text-brand" />
                    <span className="text-slate-700">Show data points</span>
                  </label>
                </div>
              </div>
            </article>
          </section>
        </div>
      )}

      {/* Custom KPIs Tab */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setShowKPIBuilder(true)}
              className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-dark"
            >
              Create Custom KPI
            </button>
          </div>

          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customKPIs.map((kpi) => (
              <article
                key={kpi.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                    {kpi.category}
                  </span>
                  <span
                    className={`text-lg ${
                      kpi.trend === 'up' ? 'text-emerald-600' : kpi.trend === 'down' ? 'text-rose-600' : 'text-gray-600'
                    }`}
                  >
                    {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
                <p className="mt-2 text-xs font-medium text-slate-600">{kpi.name}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{kpi.value}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p
                    className={`text-xs ${
                      kpi.trend === 'up' ? 'text-emerald-600' : kpi.trend === 'down' ? 'text-rose-600' : 'text-gray-600'
                    }`}
                  >
                    {kpi.change} vs last period
                  </p>
                  {kpi.target && (
                    <p className="text-xs text-slate-500">Target: {kpi.target}</p>
                  )}
                </div>
                <div className="mt-3">
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{
                        width: `${Math.min(100, (parseFloat(kpi.value.replace(/[^0-9.]/g, '')) / parseFloat((kpi.target || '100').replace(/[^0-9.]/g, ''))) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      )}

      {/* Import/Export Tab */}
      {activeTab === 'import-export' && (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">Import Data</h2>
              <p className="mt-1 text-xs text-slate-600">
                Upload CSV, Excel, or JSON files to import data into your system.
              </p>
              <button
                onClick={() => setShowImportModal(true)}
                className="mt-4 w-full rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center hover:border-brand"
              >
                <p className="text-sm font-medium text-slate-900">Click to upload or drag and drop</p>
                <p className="mt-1 text-xs text-slate-500">CSV, XLSX, JSON (Max 10MB)</p>
              </button>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  <span className="text-slate-700">users_import_2024.csv</span>
                  <span className="text-emerald-600">Imported</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  <span className="text-slate-700">products_data.xlsx</span>
                  <span className="text-amber-600">Processing...</span>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">Export Data</h2>
              <p className="mt-1 text-xs text-slate-600">
                Export your data in various formats for analysis or backup.
              </p>
              <div className="mt-4 space-y-2">
                {['CSV', 'Excel', 'JSON', 'PDF'].map((format) => (
                  <button
                    key={format}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm font-medium text-slate-700 hover:border-gray-400"
                  >
                    Export as {format}
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs font-medium text-slate-900">Recent Exports</p>
                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>users_export_2024-03-15.csv</span>
                    <span>2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>revenue_report_2024.xlsx</span>
                    <span>1 day ago</span>
                  </div>
                </div>
              </div>
            </article>
          </section>
        </div>
      )}

      {/* Backup/Restore Tab */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setShowBackupModal(true)}
              className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-dark"
            >
              Create Backup
            </button>
          </div>

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Backup History</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50"
                >
                  <div className="flex flex-1 items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xl">
                      💾
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{backup.name}</p>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-600">
                        <span className="capitalize">{backup.type}</span>
                        <span>•</span>
                        <span>{backup.size}</span>
                        <span>•</span>
                        <span>{backup.createdAt}</span>
                        {backup.scheduledAt && (
                          <>
                            <span>•</span>
                            <span className="text-amber-600">Scheduled: {backup.scheduledAt}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        backup.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : backup.status === 'in-progress'
                            ? 'bg-amber-100 text-amber-700'
                            : backup.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {backup.status}
                    </span>
                    {backup.status === 'completed' && (
                      <button className="rounded-md border border-gray-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-gray-400">
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Archiving Tab */}
      {activeTab === 'archive' && (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Archives</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{archives.length}</p>
            </article>
            <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Archived Size</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">2.4 GB</p>
            </article>
            <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Retention Policy</p>
              <p className="mt-3 text-sm font-semibold text-slate-900">1 Year</p>
              <p className="mt-1 text-xs text-slate-600">Auto-delete after retention</p>
            </article>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Archived Data</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {archives.map((archive) => (
                <div
                  key={archive.id}
                  className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50"
                >
                  <div className="flex flex-1 items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xl">
                      📦
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{archive.name}</p>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-600">
                        <span>{archive.type}</span>
                        <span>•</span>
                        <span>{archive.size}</span>
                        <span>•</span>
                        <span>Archived: {archive.archivedAt}</span>
                        <span>•</span>
                        <span>Retention until: {archive.retentionUntil}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        archive.status === 'archived'
                          ? 'bg-gray-100 text-gray-700'
                          : archive.status === 'restored'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {archive.status}
                    </span>
                    {archive.status === 'archived' && (
                      <button className="rounded-md border border-gray-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-gray-400">
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Business Intelligence Tab */}
      {activeTab === 'bi' && (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">Predictive Analytics</h2>
              <div className="mt-4 space-y-3">
                {predictions.map((prediction, idx) => (
                  <div key={idx} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-900">{prediction.metric}</p>
                        <p className="mt-0.5 text-[11px] text-slate-600">{prediction.period}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-600">Current: {prediction.current}</p>
                        <p className="text-sm font-semibold text-slate-900">{prediction.predicted}</p>
                        <p className="text-[10px] text-slate-500">{prediction.confidence}% confidence</p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {prediction.factors.map((factor, fIdx) => (
                        <span
                          key={fIdx}
                          className="rounded-full bg-white px-1.5 py-0.5 text-[10px] text-slate-600"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">Business Insights</h2>
              <div className="mt-4 space-y-3 text-xs">
                {[
                  {
                    insight: 'Revenue Growth Opportunity',
                    description: 'Expanding to new markets could increase revenue by 25%',
                    impact: 'high',
                    action: 'Review market expansion strategy',
                  },
                  {
                    insight: 'Customer Retention Risk',
                    description: '15% of customers show signs of churn in next 30 days',
                    impact: 'high',
                    action: 'Implement retention campaign',
                  },
                  {
                    insight: 'Product Performance',
                    description: 'Product A shows 40% higher engagement than average',
                    impact: 'medium',
                    action: 'Consider promoting Product A',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{item.insight}</p>
                        <p className="mt-0.5 text-[11px] text-slate-600">{item.description}</p>
                        <p className="mt-1 text-[11px] font-medium text-brand">{item.action}</p>
                      </div>
                      <span
                        className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                          item.impact === 'high'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {item.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Data Quality Metrics</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: 'Data Completeness', value: '94%', status: 'good' },
                { label: 'Data Accuracy', value: '97%', status: 'good' },
                { label: 'Data Freshness', value: '99%', status: 'good' },
                { label: 'Data Consistency', value: '92%', status: 'warning' },
              ].map((metric, idx) => (
                <div key={idx} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-medium text-slate-600">{metric.label}</p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">{metric.value}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full ${
                        metric.status === 'good' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: metric.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* KPI Builder Modal */}
      {showKPIBuilder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Create Custom KPI</h2>
              <button
                onClick={() => setShowKPIBuilder(false)}
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
                const name = formData.get('kpiName') as string
                const target = formData.get('target') as string

                if (!name || !name.trim()) {
                  showToast('Please enter a KPI name', 'warning')
                  return
                }
                if (!target || !target.trim()) {
                  showToast('Please enter a target value', 'warning')
                  return
                }

                handleCreateKpi()
              }}
            >
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="kpi-name" className="block text-xs font-medium text-slate-600">
                      KPI Name *
                    </label>
                    <input
                      id="kpi-name"
                      type="text"
                      name="kpiName"
                      required
                      value={newKpi.name}
                      onChange={(e) => setNewKpi({ ...newKpi, name: e.target.value })}
                      placeholder="e.g., Monthly Recurring Revenue"
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </div>
                  <div>
                    <label htmlFor="kpi-category" className="block text-xs font-medium text-slate-600">
                      Category *
                    </label>
                    <select
                      id="kpi-category"
                      name="category"
                      required
                      value={newKpi.category}
                      onChange={(e) => setNewKpi({ ...newKpi, category: e.target.value as KpiCategory })}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    >
                      <option value="revenue">Revenue</option>
                      <option value="marketing">Marketing</option>
                      <option value="retention">Retention</option>
                      <option value="satisfaction">Satisfaction</option>
                      <option value="operations">Operations</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="kpi-source" className="block text-xs font-medium text-slate-600">
                        Data Source
                      </label>
                      <select
                        id="kpi-source"
                        name="dataSource"
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      >
                        <option>Revenue</option>
                        <option>Users</option>
                        <option>Sales</option>
                        <option>Custom</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="kpi-target" className="block text-xs font-medium text-slate-600">
                        Target Value *
                      </label>
                      <input
                        id="kpi-target"
                        type="text"
                        name="target"
                        required
                        value={newKpi.target}
                        onChange={(e) => setNewKpi({ ...newKpi, target: e.target.value })}
                        placeholder="e.g., $150,000"
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setShowKPIBuilder(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  Create KPI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Import Data</h2>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4">
              <div
                className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  isDraggingImport
                    ? 'border-brand bg-brand/5'
                    : 'border-gray-300 bg-gray-50'
                }`}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDraggingImport(true)
                }}
                onDragLeave={(e) => {
                  e.preventDefault()
                  setIsDraggingImport(false)
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDraggingImport(false)
                  const file = e.dataTransfer.files[0]
                  if (file) {
                    if (file.size > 10 * 1024 * 1024) {
                      showToast('File size exceeds 10MB limit', 'error')
                      return
                    }
                    const ext = file.name.split('.').pop()?.toLowerCase()
                    if (!['csv', 'xlsx', 'json'].includes(ext || '')) {
                      showToast('Please upload a CSV, XLSX, or JSON file', 'error')
                      return
                    }
                    setImportFile(file)
                  }
                }}
              >
                {importFile ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-900">Selected file:</p>
                    <p className="text-xs text-slate-600">{importFile.name}</p>
                    <p className="text-xs text-slate-500">
                      {(importFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => setImportFile(null)}
                      className="mt-2 rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-slate-700 hover:border-gray-400"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="mb-2 text-sm font-medium text-slate-900">Drag and drop files here</p>
                    <p className="mb-4 text-xs text-slate-600">or</p>
                    <input
                      type="file"
                      id="data-import-file"
                      accept=".csv,.xlsx,.json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) {
                            showToast('File size exceeds 10MB limit', 'error')
                            return
                          }
                          setImportFile(file)
                        }
                        e.target.value = ''
                      }}
                    />
                    <label
                      htmlFor="data-import-file"
                      className="cursor-pointer rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                    >
                      Browse Files
                    </label>
                    <p className="mt-4 text-xs text-slate-500">
                      Supported: CSV, XLSX, JSON (Max 10MB per file)
                    </p>
                  </>
                )}
              </div>
              {isImporting && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700">Importing data...</span>
                    <span className="text-slate-600">{importProgress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-brand transition-all"
                      style={{ width: `${importProgress}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="mt-4">
                <label htmlFor="import-table" className="block text-xs font-medium text-slate-600">
                  Import to Table *
                </label>
                <select
                  id="import-table"
                  required
                  value={importTable}
                  onChange={(e) => setImportTable(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option>Users</option>
                  <option>Products</option>
                  <option>Orders</option>
                  <option>Custom</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  setShowImportModal(false)
                  setImportFile(null)
                  setIsImporting(false)
                  setImportProgress(0)
                }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!importFile) {
                    showToast('Please select a file to import', 'warning')
                    return
                  }

                  setIsImporting(true)
                  setImportProgress(0)

                  const reader = new FileReader()
                  reader.onload = async () => {
                    let progress = 0
                    const interval = setInterval(() => {
                      progress += Math.random() * 20
                      if (progress >= 100) {
                        progress = 100
                        clearInterval(interval)
                        setIsImporting(false)
                        setImportProgress(0)
                        setImportFile(null)
                        setShowImportModal(false)
                        showToast(`Data imported successfully to ${importTable}!`, 'success')
                      } else {
                        setImportProgress(Math.round(progress))
                      }
                    }, 200)
                  }
                  reader.readAsText(importFile)
                }}
                disabled={!importFile || isImporting}
                className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isImporting ? 'Importing...' : 'Import Data'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Create Backup</h2>
              <button
                onClick={() => setShowBackupModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600">Backup Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Daily Backup - March 15"
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Backup Type</label>
                  <select className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand">
                    <option>Full Backup</option>
                    <option>Incremental Backup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Include Tables</label>
                  <div className="mt-2 space-y-2">
                    {['Users', 'Products', 'Orders', 'Analytics', 'Settings'].map((table) => (
                      <label key={table} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                        />
                        <span className="text-sm text-slate-700">{table}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setShowBackupModal(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
              >
                Cancel
              </button>
              <button className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
                Create Backup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

