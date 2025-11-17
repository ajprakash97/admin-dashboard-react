import { useState } from 'react'

type MetricType = 'revenue' | 'users' | 'conversion' | 'engagement' | 'retention'
type ChartType = 'line' | 'bar' | 'pie' | 'area'

export const AdvancedAnalyticsPage = () => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('revenue')
  const [chartType, setChartType] = useState<ChartType>('line')
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  const generateTimeSeriesData = (days: number) => {
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      value: Math.floor(Math.random() * 10000) + 5000,
    }))
  }

  const revenueData = generateTimeSeriesData(30)
  const userData = generateTimeSeriesData(30)
  const conversionData = generateTimeSeriesData(30)

  const getDataForMetric = () => {
    switch (selectedMetric) {
      case 'revenue':
        return revenueData
      case 'users':
        return userData
      case 'conversion':
        return conversionData
      default:
        return revenueData
    }
  }

  const currentData = getDataForMetric()
  const maxValue = Math.max(...currentData.map((d) => d.value))

  const cohortData = [
    { cohort: 'Jan 2024', week1: 100, week2: 85, week3: 72, week4: 65 },
    { cohort: 'Feb 2024', week1: 120, week2: 98, week3: 85, week4: 78 },
    { cohort: 'Mar 2024', week1: 150, week2: 125, week3: 110, week4: 95 },
  ]

  const funnelData = [
    { stage: 'Visitors', count: 10000, percentage: 100 },
    { stage: 'Sign-ups', count: 2500, percentage: 25 },
    { stage: 'Trials', count: 1200, percentage: 12 },
    { stage: 'Purchases', count: 450, percentage: 4.5 },
    { stage: 'Active Users', count: 320, percentage: 3.2 },
  ]

  const retentionData = [
    { period: 'Week 1', retention: 100 },
    { period: 'Week 2', retention: 75 },
    { period: 'Week 3', retention: 58 },
    { period: 'Week 4', retention: 45 },
    { period: 'Week 8', retention: 32 },
    { period: 'Week 12', retention: 25 },
  ]

  const insights = [
    {
      title: 'Revenue Growth Trend',
      description: 'Revenue has increased by 23% over the last 30 days',
      impact: 'high',
      recommendation: 'Continue current marketing strategy',
    },
    {
      title: 'User Retention Decline',
      description: 'Week 2 retention dropped by 5% compared to last month',
      impact: 'medium',
      recommendation: 'Review onboarding process and user engagement',
    },
    {
      title: 'Conversion Rate Optimization',
      description: 'A/B test shows 12% improvement in sign-up conversion',
      impact: 'high',
      recommendation: 'Implement winning variant across all pages',
    },
    {
      title: 'Peak Traffic Hours',
      description: 'Traffic peaks between 2-4 PM, consider scheduling campaigns',
      impact: 'low',
      recommendation: 'Schedule important announcements during peak hours',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Analytics</h1>
          <p className="mt-1 text-sm text-slate-600">
            Deep insights, cohort analysis, funnel tracking, and predictive analytics for data-driven decisions.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-md border border-gray-300 bg-white">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-2 text-xs font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-brand text-white'
                    : 'text-slate-700 hover:bg-gray-50'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
          <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400">
            Export
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <button
          onClick={() => setSelectedMetric('revenue')}
          className={`rounded-xl border p-4 text-left shadow-sm transition-colors ${
            selectedMetric === 'revenue'
              ? 'border-brand bg-brand/5'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Revenue</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">$124,580</p>
          <p className="mt-1 text-xs text-emerald-600">+23% vs last period</p>
        </button>
        <button
          onClick={() => setSelectedMetric('users')}
          className={`rounded-xl border p-4 text-left shadow-sm transition-colors ${
            selectedMetric === 'users'
              ? 'border-brand bg-brand/5'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Users</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">8,432</p>
          <p className="mt-1 text-xs text-emerald-600">+18% vs last period</p>
        </button>
        <button
          onClick={() => setSelectedMetric('conversion')}
          className={`rounded-xl border p-4 text-left shadow-sm transition-colors ${
            selectedMetric === 'conversion'
              ? 'border-brand bg-brand/5'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Conversion</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">3.24%</p>
          <p className="mt-1 text-xs text-rose-600">-0.3% vs last period</p>
        </button>
        <button
          onClick={() => setSelectedMetric('retention')}
          className={`rounded-xl border p-4 text-left shadow-sm transition-colors ${
            selectedMetric === 'retention'
              ? 'border-brand bg-brand/5'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Retention</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">68%</p>
          <p className="mt-1 text-xs text-emerald-600">+5% vs last period</p>
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              {selectedMetric === 'revenue'
                ? 'Revenue Trend'
                : selectedMetric === 'users'
                  ? 'User Growth'
                  : 'Conversion Rate'}
            </h2>
            <div className="flex gap-1 rounded-md border border-gray-300 bg-white">
              {(['line', 'bar', 'area'] as ChartType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`px-2 py-1 text-xs capitalize ${
                    chartType === type ? 'bg-gray-100 text-slate-900' : 'text-slate-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between gap-1">
            {currentData.map((day, idx) => (
              <div key={idx} className="flex flex-1 flex-col items-center gap-1">
                <div className="relative flex h-32 w-full items-end">
                  {chartType === 'line' || chartType === 'area' ? (
                    <div
                      className={`w-full rounded-t-md transition-all hover:opacity-80 ${
                        chartType === 'area' ? 'bg-brand/30' : 'bg-brand'
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
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Key Insights</h2>
          <div className="mt-4 space-y-3">
            {insights.slice(0, 3).map((insight, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-900">{insight.title}</p>
                    <p className="mt-0.5 text-[11px] text-slate-600">{insight.description}</p>
                  </div>
                  <span
                    className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                      insight.impact === 'high'
                        ? 'bg-emerald-100 text-emerald-700'
                        : insight.impact === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {insight.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Conversion Funnel</h2>
          <div className="mt-4 space-y-2">
            {funnelData.map((stage, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">{stage.count.toLocaleString()}</span>
                    <span className="font-mono text-slate-900">{stage.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
                {idx < funnelData.length - 1 && (
                  <div className="flex justify-center">
                    <span className="text-slate-400">↓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">User Retention</h2>
          <div className="mt-4 space-y-2">
            {retentionData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-16 text-xs text-slate-600">{item.period}</div>
                <div className="flex-1">
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${item.retention}%` }}
                    />
                  </div>
                </div>
                <span className="w-12 text-right text-xs font-mono text-slate-900">
                  {item.retention}%
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Cohort Analysis</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-3 py-2 text-left font-medium text-slate-600">Cohort</th>
                <th className="px-3 py-2 text-center font-medium text-slate-600">Week 1</th>
                <th className="px-3 py-2 text-center font-medium text-slate-600">Week 2</th>
                <th className="px-3 py-2 text-center font-medium text-slate-600">Week 3</th>
                <th className="px-3 py-2 text-center font-medium text-slate-600">Week 4</th>
              </tr>
            </thead>
            <tbody>
              {cohortData.map((cohort, idx) => (
                <tr key={idx} className="border-b border-gray-200 last:border-b-0">
                  <td className="px-3 py-2 font-medium text-slate-900">{cohort.cohort}</td>
                  <td className="px-3 py-2 text-center text-slate-700">{cohort.week1}</td>
                  <td className="px-3 py-2 text-center text-slate-700">{cohort.week2}</td>
                  <td className="px-3 py-2 text-center text-slate-700">{cohort.week3}</td>
                  <td className="px-3 py-2 text-center text-slate-700">{cohort.week4}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Predictive Insights</h2>
          <div className="mt-4 space-y-3">
            {[
              {
                prediction: 'Revenue Forecast',
                value: '$145,000',
                confidence: '85%',
                period: 'Next 30 days',
              },
              {
                prediction: 'User Growth',
                value: '9,200',
                confidence: '78%',
                period: 'Next 30 days',
              },
              {
                prediction: 'Churn Risk',
                value: '12%',
                confidence: '72%',
                period: 'Next 7 days',
              },
            ].map((item, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-900">{item.prediction}</p>
                    <p className="mt-0.5 text-[11px] text-slate-600">{item.period}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                    <p className="text-[10px] text-slate-500">{item.confidence} confidence</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">All Insights & Recommendations</h2>
          <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
            {insights.map((insight, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs font-medium text-slate-900">{insight.title}</p>
                <p className="mt-0.5 text-[11px] text-slate-600">{insight.description}</p>
                <p className="mt-1 text-[11px] font-medium text-brand">{insight.recommendation}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

