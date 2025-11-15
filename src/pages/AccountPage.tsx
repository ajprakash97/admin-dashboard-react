import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'

export const AccountPage = () => {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<'overview' | 'billing' | 'subscription' | 'api-keys' | 'data-management' | 'danger'>('overview')
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newApiKeyName, setNewApiKeyName] = useState('')

  const [billingInfo, setBillingInfo] = useState({
    companyName: 'Acme Inc.',
    taxId: 'TAX-123456789',
    address: '123 Business St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
  })

  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: '**** **** **** 4242',
    expiryDate: '12/25',
    cardholderName: 'Admin User',
    billingAddress: 'Same as company address',
  })

  const apiKeys = [
    {
      id: 1,
      name: 'Production API Key',
      key: 'sk_live_51H...k3m2',
      created: '2024-01-15',
      lastUsed: '2 hours ago',
      permissions: ['read', 'write'],
    },
    {
      id: 2,
      name: 'Development API Key',
      key: 'sk_test_78F...x9p1',
      created: '2024-02-20',
      lastUsed: '1 week ago',
      permissions: ['read'],
    },
  ]

  const subscriptionPlans = [
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$499/month',
      features: ['Unlimited users', 'Advanced analytics', 'Priority support', 'Custom integrations', '99.9% uptime SLA'],
      current: true,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$199/month',
      features: ['Up to 50 users', 'Standard analytics', 'Email support', 'API access'],
      current: false,
    },
    {
      id: 'starter',
      name: 'Starter',
      price: '$49/month',
      features: ['Up to 10 users', 'Basic analytics', 'Community support'],
      current: false,
    },
  ]

  const invoices = [
    { id: 1, date: '2024-03-01', amount: '$499.00', status: 'Paid', download: true },
    { id: 2, date: '2024-02-01', amount: '$499.00', status: 'Paid', download: true },
    { id: 3, date: '2024-01-01', amount: '$499.00', status: 'Paid', download: true },
  ]

  const handleBillingUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    showToast('Billing information updated successfully!', 'success')
  }

  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newApiKeyName.trim()) {
      showToast('Please enter an API key name', 'warning')
      return
    }
    showToast(`API key "${newApiKeyName}" created successfully!`, 'success')
    setNewApiKeyName('')
    setShowApiKeyModal(false)
  }

  const handleDeleteApiKey = (keyId: number) => {
    showToast('API key deleted successfully', 'success')
  }

  const handleDeleteAccount = () => {
    showToast('Account deletion request submitted. You will receive a confirmation email.', 'warning')
    setShowDeleteModal(false)
  }

  const handleDownloadInvoice = (invoiceId: number) => {
    const content = `Invoice #${invoiceId}\nDate: ${invoices.find((inv) => inv.id === invoiceId)?.date}\nAmount: ${invoices.find((inv) => inv.id === invoiceId)?.amount}\nStatus: ${invoices.find((inv) => inv.id === invoiceId)?.status}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice-${invoiceId}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast(`Invoice #${invoiceId} downloaded`, 'success')
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Account</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your account settings, billing, subscription, and API access.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'billing', label: 'Billing', icon: '💳' },
          { id: 'subscription', label: 'Subscription', icon: '⭐' },
          { id: 'api-keys', label: 'API Keys', icon: '🔑' },
          { id: 'data-management', label: 'Data Management', icon: '💾' },
          { id: 'danger', label: 'Danger Zone', icon: '⚠️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-brand text-brand'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Account Summary</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Account ID</span>
                <span className="text-sm font-medium text-slate-900">ACC-123456789</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Account Status</span>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Current Plan</span>
                <span className="text-sm font-medium text-slate-900">Enterprise</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Next Billing Date</span>
                <span className="text-sm font-medium text-slate-900">April 1, 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Monthly Cost</span>
                <span className="text-sm font-medium text-slate-900">$499.00</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Usage Statistics</h2>
            <div className="mt-4 space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Storage Used</span>
                  <span className="font-medium text-slate-900">2.4 GB / 100 GB</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[2.4%] rounded-full bg-brand" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-600">API Requests (This Month)</span>
                  <span className="font-medium text-slate-900">45,230 / 100,000</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[45.23%] rounded-full bg-emerald-500" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Active Users</span>
                  <span className="font-medium text-slate-900">124 / Unlimited</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[10%] rounded-full bg-blue-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            <div className="mt-4 space-y-2">
              {[
                { action: 'Subscription renewed', time: '2 days ago' },
                { action: 'Payment processed', time: '2 days ago' },
                { action: 'API key created', time: '1 week ago' },
                { action: 'Plan upgraded', time: '2 weeks ago' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{activity.action}</span>
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => setActiveTab('billing')}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm font-medium text-slate-700 hover:border-gray-400"
              >
                💳 Update Payment Method
              </button>
              <button
                onClick={() => setActiveTab('subscription')}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm font-medium text-slate-700 hover:border-gray-400"
              >
                ⭐ Manage Subscription
              </button>
              <button
                onClick={() => setActiveTab('api-keys')}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm font-medium text-slate-700 hover:border-gray-400"
              >
                🔑 Manage API Keys
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Billing Information</h2>
            <form onSubmit={handleBillingUpdate} className="mt-6 space-y-4">
              <div>
                <label htmlFor="companyName" className="block text-xs font-medium text-slate-600">
                  Company Name *
                </label>
                <input
                  id="companyName"
                  type="text"
                  required
                  value={billingInfo.companyName}
                  onChange={(e) => setBillingInfo({ ...billingInfo, companyName: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label htmlFor="taxId" className="block text-xs font-medium text-slate-600">
                  Tax ID / VAT Number
                </label>
                <input
                  id="taxId"
                  type="text"
                  value={billingInfo.taxId}
                  onChange={(e) => setBillingInfo({ ...billingInfo, taxId: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-xs font-medium text-slate-600">
                  Street Address *
                </label>
                <input
                  id="address"
                  type="text"
                  required
                  value={billingInfo.address}
                  onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label htmlFor="city" className="block text-xs font-medium text-slate-600">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={billingInfo.city}
                    onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-xs font-medium text-slate-600">
                    State / Province
                  </label>
                  <input
                    id="state"
                    type="text"
                    value={billingInfo.state}
                    onChange={(e) => setBillingInfo({ ...billingInfo, state: e.target.value })}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-xs font-medium text-slate-600">
                    ZIP / Postal Code *
                  </label>
                  <input
                    id="zipCode"
                    type="text"
                    required
                    value={billingInfo.zipCode}
                    onChange={(e) => setBillingInfo({ ...billingInfo, zipCode: e.target.value })}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="country" className="block text-xs font-medium text-slate-600">
                  Country *
                </label>
                <select
                  id="country"
                  required
                  value={billingInfo.country}
                  onChange={(e) => setBillingInfo({ ...billingInfo, country: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Germany</option>
                  <option>France</option>
                  <option>Australia</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  Update Billing Information
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Payment Method</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{paymentMethod.cardNumber}</p>
                  <p className="text-xs text-slate-600">
                    Expires {paymentMethod.expiryDate} • {paymentMethod.cardholderName}
                  </p>
                </div>
                <button className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-slate-700 hover:border-gray-400">
                  Update
                </button>
              </div>
              <button className="w-full rounded-md border border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:border-gray-400">
                + Add Payment Method
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Billing History</h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full text-left text-xs text-slate-700">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 font-medium">Date</th>
                    <th className="px-4 py-2 font-medium">Amount</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                      <td className="px-4 py-2">{invoice.date}</td>
                      <td className="px-4 py-2 font-medium">{invoice.amount}</td>
                      <td className="px-4 py-2">
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        {invoice.download && (
                          <button
                            onClick={() => handleDownloadInvoice(invoice.id)}
                            className="rounded-md border border-gray-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-gray-400"
                          >
                            Download
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Tab */}
      {activeTab === 'subscription' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Current Plan</h2>
            <div className="mt-4 rounded-lg border-2 border-brand bg-brand/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Enterprise</h3>
                  <p className="mt-1 text-sm text-slate-600">$499/month • Billed monthly</p>
                  <p className="mt-2 text-xs text-slate-500">Next billing: April 1, 2024</p>
                </div>
                <span className="rounded-full bg-brand px-3 py-1 text-xs font-medium text-white">Active</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Available Plans</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-lg border p-4 ${
                    plan.current ? 'border-brand bg-brand/5' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">{plan.name}</h3>
                    {plan.current && (
                      <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-medium text-white">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{plan.price}</p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="text-emerald-500">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {!plan.current && (
                    <button className="mt-4 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400">
                      Switch to {plan.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Subscription Management</h2>
            <div className="mt-4 space-y-3">
              <button className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm font-medium text-slate-700 hover:border-gray-400">
                📅 Change Billing Cycle
              </button>
              <button className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm font-medium text-slate-700 hover:border-gray-400">
                ⏸️ Pause Subscription
              </button>
              <button className="w-full rounded-md border border-rose-300 bg-white px-4 py-2 text-left text-sm font-medium text-rose-700 hover:border-rose-400">
                🚫 Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === 'api-keys' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">API Keys</h2>
              <p className="mt-1 text-sm text-slate-600">
                Manage your API keys for programmatic access to your account.
              </p>
            </div>
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
            >
              Create API Key
            </button>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="divide-y divide-gray-200">
              {apiKeys.map((key) => (
                <div key={key.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">{key.name}</h3>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {key.permissions.join(', ')}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-xs text-slate-600">{key.key}</p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                        <span>Created: {key.created}</span>
                        <span>•</span>
                        <span>Last used: {key.lastUsed}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(key.key)
                          showToast('API key copied to clipboard', 'success')
                        }}
                        className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-slate-700 hover:border-gray-400"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${key.name}"?`)) {
                            handleDeleteApiKey(key.id)
                          }
                        }}
                        className="rounded-md border border-rose-300 px-3 py-1 text-xs font-medium text-rose-700 hover:border-rose-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Create API Key Modal */}
          {showApiKeyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">Create API Key</h2>
                  <button
                    onClick={() => {
                      setShowApiKeyModal(false)
                      setNewApiKeyName('')
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleCreateApiKey}>
                  <div className="px-6 py-4">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="api-key-name" className="block text-xs font-medium text-slate-600">
                          Key Name *
                        </label>
                        <input
                          id="api-key-name"
                          type="text"
                          required
                          value={newApiKeyName}
                          onChange={(e) => setNewApiKeyName(e.target.value)}
                          placeholder="e.g., Production API Key"
                          className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600">Permissions</label>
                        <div className="mt-2 space-y-2">
                          {['read', 'write', 'admin'].map((permission) => (
                            <label key={permission} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                defaultChecked={permission === 'read'}
                                className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                              />
                              <span className="text-sm text-slate-700 capitalize">{permission}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                        <p className="text-xs font-medium text-amber-900">⚠️ Important</p>
                        <p className="mt-1 text-xs text-amber-800">
                          Make sure to copy your API key immediately after creation. You won't be able to see it again.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowApiKeyModal(false)
                        setNewApiKeyName('')
                      }}
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                    >
                      Create API Key
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Data Management Tab */}
      {activeTab === 'data-management' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Export Data</h2>
            <p className="mt-1 text-sm text-slate-600">
              Download a copy of all your account data in a portable format.
            </p>
            <div className="mt-4 space-y-2">
              {['CSV', 'JSON', 'Excel'].map((format) => (
                <button
                  key={format}
                  onClick={() => {
                    const content = `Account Data Export\nFormat: ${format}\nDate: ${new Date().toISOString()}\n\nThis is a demo export. In production, this would contain all account data.`
                    const blob = new Blob([content], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `account-export-${new Date().toISOString().split('T')[0]}.txt`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    URL.revokeObjectURL(url)
                    showToast(`Account data exported as ${format}`, 'success')
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:border-brand hover:bg-gray-50"
                >
                  Export as {format}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Data Retention</h2>
            <p className="mt-1 text-sm text-slate-600">
              Configure how long your data is retained before automatic deletion.
            </p>
            <div className="mt-4">
              <label htmlFor="retention-period" className="block text-xs font-medium text-slate-600">
                Retention Period
              </label>
              <select
                id="retention-period"
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option>Keep forever</option>
                <option>1 year</option>
                <option>2 years</option>
                <option>5 years</option>
                <option>10 years</option>
              </select>
              <button className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
                Save Retention Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone Tab */}
      {activeTab === 'danger' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
            <h2 className="text-lg font-semibold text-rose-900">Danger Zone</h2>
            <p className="mt-1 text-sm text-rose-800">
              Irreversible and destructive actions. Please proceed with caution.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Delete All Data</h3>
                <p className="mt-1 text-xs text-slate-600">
                  Permanently delete all data associated with your account. This action cannot be undone.
                </p>
              </div>
              <button className="rounded-md border border-rose-300 px-4 py-2 text-sm font-medium text-rose-700 hover:border-rose-400">
                Delete All Data
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Transfer Account Ownership</h3>
                <p className="mt-1 text-xs text-slate-600">
                  Transfer ownership of this account to another user. You will lose admin access.
                </p>
              </div>
              <button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400">
                Transfer Ownership
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-rose-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-rose-900">Delete Account</h3>
                <p className="mt-1 text-xs text-slate-600">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="rounded-md border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-700 hover:border-rose-400"
              >
                Delete Account
              </button>
            </div>
          </div>

          {/* Delete Account Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-xl border border-rose-200 bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-rose-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-rose-900">Delete Account</h2>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="px-6 py-4">
                  <p className="text-sm text-slate-700">
                    Are you absolutely sure you want to delete your account? This will:
                  </p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                    <li>Permanently delete all your data</li>
                    <li>Cancel your active subscription</li>
                    <li>Remove all API keys and integrations</li>
                    <li>This action cannot be undone</li>
                  </ul>
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs font-medium text-amber-900">Type "DELETE" to confirm</p>
                    <input
                      type="text"
                      placeholder="DELETE"
                      className="mt-2 w-full rounded-md border border-amber-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 border-t border-rose-200 px-6 py-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="rounded-md border border-rose-300 bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

