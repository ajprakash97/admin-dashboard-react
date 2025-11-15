import { useState } from 'react'

export const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  const metrics = [
    { label: 'Total Revenue', value: '$124,580', change: '+12.5%', trend: 'up', icon: '💰' },
    { label: 'Active Sessions', value: '8,432', change: '+8.2%', trend: 'up', icon: '👥' },
    { label: 'Conversion Rate', value: '3.24%', change: '-0.3%', trend: 'down', icon: '📊' },
    { label: 'Avg. Order Value', value: '$47.20', change: '+5.1%', trend: 'up', icon: '🛒' },
    { label: 'New Users', value: '1,234', change: '+15.3%', trend: 'up', icon: '✨' },
    { label: 'Bounce Rate', value: '32.1%', change: '-2.4%', trend: 'up', icon: '📉' },
  ]

  // Simulated time series data for charts
  const revenueData = [
    { date: 'Mon', value: 12000 },
    { date: 'Tue', value: 15000 },
    { date: 'Wed', value: 18000 },
    { date: 'Thu', value: 14000 },
    { date: 'Fri', value: 22000 },
    { date: 'Sat', value: 19000 },
    { date: 'Sun', value: 16000 },
  ]

  const topPages = [
    { path: '/dashboard', views: 12450, unique: 8230, bounce: '32%', avgTime: '3m 24s' },
    { path: '/products', views: 9870, unique: 6540, bounce: '28%', avgTime: '4m 12s' },
    { path: '/users', views: 7650, unique: 5120, bounce: '35%', avgTime: '2m 45s' },
    { path: '/settings', views: 4320, unique: 3210, bounce: '42%', avgTime: '1m 58s' },
  ]

  const devices = [
    { type: 'Desktop', percentage: 62, color: 'bg-brand', users: 5230 },
    { type: 'Mobile', percentage: 28, color: 'bg-emerald-500', users: 2360 },
    { type: 'Tablet', percentage: 10, color: 'bg-purple-500', users: 842 },
  ]

  const topCountries = [
    { country: 'United States', users: 12450, percentage: 42, flag: '🇺🇸' },
    { country: 'United Kingdom', users: 5670, percentage: 19, flag: '🇬🇧' },
    { country: 'Germany', users: 4320, percentage: 15, flag: '🇩🇪' },
    { country: 'France', users: 3210, percentage: 11, flag: '🇫🇷' },
    { country: 'Canada', users: 2100, percentage: 7, flag: '🇨🇦' },
    { country: 'Other', users: 1750, percentage: 6, flag: '🌍' },
  ]

  const maxRevenue = Math.max(...revenueData.map((d) => d.value))

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Comprehensive insights into your application performance, user behavior, and business metrics.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-md border border-gray-300 bg-white">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-2 text-xs font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-brand text-white'
                    : 'text-slate-700 hover:bg-gray-50'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
          <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400">
            Export Data
          </button>
          <button className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-dark">
            Generate Report
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, idx) => (
          <article
            key={idx}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {metric.label}
              </p>
              <span className="text-lg">{metric.icon}</span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{metric.value}</p>
            <p
              className={`mt-1 flex items-center gap-1 text-xs ${
                metric.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              <span>{metric.trend === 'up' ? '↑' : '↓'}</span>
              {metric.change} vs last period
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">Revenue Trend</h2>
            <span className="text-xs text-slate-500">Last 7 days</span>
          </div>
          <div className="mt-4 flex items-end justify-between gap-2">
            {revenueData.map((day, idx) => (
              <div key={idx} className="flex flex-1 flex-col items-center gap-1">
                <div className="relative flex h-32 w-full items-end">
                  <div
                    className="w-full rounded-t-md bg-brand transition-all hover:bg-brand-dark"
                    style={{ height: `${(day.value / maxRevenue) * 100}%` }}
                    title={`$${day.value.toLocaleString()}`}
                  />
                </div>
                <span className="text-[10px] text-slate-500">{day.date}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 text-xs">
            <span className="text-slate-600">Total Revenue</span>
            <span className="font-semibold text-slate-900">
              ${revenueData.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
            </span>
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">Device Breakdown</h2>
            <span className="text-xs text-slate-500">This month</span>
          </div>
          <div className="mt-4 space-y-3">
            {devices.map((device, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700">{device.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">{device.users.toLocaleString()} users</span>
                    <span className="font-mono text-slate-900">{device.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full ${device.color}`}
                    style={{ width: `${device.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">Page Performance</h2>
            <span className="text-xs text-slate-500">Last 30 days</span>
          </div>
          <div className="mt-4 space-y-3">
            {topPages.map((page, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-700">{page.path}</span>
                  <div className="flex items-center gap-3 text-slate-600">
                    <span>{page.views.toLocaleString()} views</span>
                    <span>{page.unique.toLocaleString()} unique</span>
                    <span className="text-rose-600">{page.bounce} bounce</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${(page.views / 12450) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">{page.avgTime}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Traffic Sources</h2>
          <div className="mt-4 space-y-3">
            {[
              { source: 'Direct', value: 45, color: 'bg-brand', visits: 3780 },
              { source: 'Search', value: 30, color: 'bg-emerald-500', visits: 2520 },
              { source: 'Social', value: 15, color: 'bg-purple-500', visits: 1260 },
              { source: 'Referral', value: 10, color: 'bg-amber-400', visits: 840 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700">{item.source}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">{item.visits.toLocaleString()} visits</span>
                      <span className="font-mono text-slate-900">{item.value}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Geographic Distribution</h2>
          <div className="mt-4 space-y-3 text-xs">
            {topCountries.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.flag}</span>
                  <span className="text-slate-700">{item.country}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono text-slate-900">
                    {item.users.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Key Insights</h2>
          <div className="mt-4 space-y-3 text-xs">
            {[
              {
                insight: 'Peak traffic hours',
                value: '2:00 PM - 4:00 PM',
                trend: 'up',
                description: 'Most active user period',
              },
              {
                insight: 'Top converting page',
                value: '/products',
                trend: 'up',
                description: 'Highest conversion rate at 4.2%',
              },
              {
                insight: 'Mobile growth',
                value: '+18%',
                trend: 'up',
                description: 'Mobile users increased this month',
              },
              {
                insight: 'Returning visitors',
                value: '68%',
                trend: 'up',
                description: 'Above industry average',
              },
            ].map((item, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">{item.insight}</span>
                  <span className="text-emerald-600">{item.value}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}
