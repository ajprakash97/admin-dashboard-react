import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'

export const ProductsPage = () => {
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all')
  const [sortField, setSortField] = useState<'name' | 'category' | 'price' | 'users' | 'revenue'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importProgress, setImportProgress] = useState(0)
  const [isImporting, setIsImporting] = useState(false)
  const [isDraggingImport, setIsDraggingImport] = useState(false)
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Subscription',
    price: '',
    status: 'Active',
  })

  const products = [
    {
      id: 1,
      name: 'Premium Plan',
      category: 'Subscription',
      price: '$99/month',
      status: 'Active',
      users: 1245,
      revenue: '$123,255',
    },
    {
      id: 2,
      name: 'Enterprise License',
      category: 'License',
      price: '$2,499/year',
      status: 'Active',
      users: 342,
      revenue: '$854,358',
    },
    {
      id: 3,
      name: 'Basic Plan',
      category: 'Subscription',
      price: '$29/month',
      status: 'Active',
      users: 5678,
      revenue: '$164,662',
    },
    {
      id: 4,
      name: 'Starter Pack',
      category: 'One-time',
      price: '$199',
      status: 'Discontinued',
      users: 89,
      revenue: '$17,711',
    },
    {
      id: 5,
      name: 'Pro Add-on',
      category: 'Add-on',
      price: '$49/month',
      status: 'Active',
      users: 892,
      revenue: '$43,708',
    },
  ]

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'category':
          aValue = a.category.toLowerCase()
          bValue = b.category.toLowerCase()
          break
        case 'price':
          aValue = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0
          bValue = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0
          break
        case 'users':
          aValue = a.users
          bValue = b.users
          break
        case 'revenue':
          aValue = parseFloat(a.revenue.replace(/[^0-9.]/g, '')) || 0
          bValue = parseFloat(b.revenue.replace(/[^0-9.]/g, '')) || 0
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  const handleSort = (field: 'name' | 'category' | 'price' | 'users' | 'revenue') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const categories = Array.from(new Set(products.map((p) => p.category)))

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Products</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your product catalog, pricing, and availability.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
          >
            Import
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-dark"
          >
            Add Product
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Total Products
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{products.length}</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Active</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {products.filter((p) => p.status === 'Active').length}
          </p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Total Revenue
          </p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">$1.2M</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Total Users
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {products.reduce((sum, p) => sum + p.users, 0).toLocaleString()}
          </p>
        </article>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3">
          <div className="flex flex-1 items-center gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Discontinued">Discontinued</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs text-slate-700">
            <thead className="border-b border-gray-200 bg-gray-50 text-[11px] uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-slate-900"
                  >
                    Product
                    {sortField === 'name' && (
                      <span className="text-brand">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">
                  <button
                    onClick={() => handleSort('category')}
                    className="flex items-center gap-1 hover:text-slate-900"
                  >
                    Category
                    {sortField === 'category' && (
                      <span className="text-brand">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">
                  <button
                    onClick={() => handleSort('price')}
                    className="flex items-center gap-1 hover:text-slate-900"
                  >
                    Price
                    {sortField === 'price' && (
                      <span className="text-brand">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">
                  <button
                    onClick={() => handleSort('users')}
                    className="flex items-center gap-1 hover:text-slate-900"
                  >
                    Users
                    {sortField === 'users' && (
                      <span className="text-brand">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">
                  <button
                    onClick={() => handleSort('revenue')}
                    className="flex items-center gap-1 hover:text-slate-900"
                  >
                    Revenue
                    {sortField === 'revenue' && (
                      <span className="text-brand">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-[11px] text-slate-600">ID: {product.id}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-700">{product.category}</td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-900">
                    {product.price}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        product.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-700">
                    {product.users.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-900">
                    {product.revenue}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="rounded-full border border-gray-300 px-3 py-1 text-[11px] font-medium text-slate-700 hover:border-gray-400">
                        Edit
                      </button>
                      <button className="rounded-full border border-gray-300 px-3 py-1 text-[11px] font-medium text-slate-700 hover:border-gray-400">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Add New Product</h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setProductForm({ name: '', category: 'Subscription', price: '', status: 'Active' })
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!productForm.name.trim()) {
                  showToast('Please enter a product name', 'warning')
                  return
                }
                if (!productForm.price.trim()) {
                  showToast('Please enter a price', 'warning')
                  return
                }
                showToast(`Product "${productForm.name}" created successfully!`, 'success')
                setShowAddModal(false)
                setProductForm({ name: '', category: 'Subscription', price: '', status: 'Active' })
              }}
            >
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="product-name" className="block text-xs font-medium text-slate-600">
                      Product Name *
                    </label>
                    <input
                      id="product-name"
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g., Premium Plan"
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="product-category" className="block text-xs font-medium text-slate-600">
                        Category *
                      </label>
                      <select
                        id="product-category"
                        required
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      >
                        <option>Subscription</option>
                        <option>License</option>
                        <option>One-time</option>
                        <option>Add-on</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="product-status" className="block text-xs font-medium text-slate-600">
                        Status *
                      </label>
                      <select
                        id="product-status"
                        required
                        value={productForm.status}
                        onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      >
                        <option>Active</option>
                        <option>Discontinued</option>
                        <option>Draft</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="product-price" className="block text-xs font-medium text-slate-600">
                      Price *
                    </label>
                    <input
                      id="product-price"
                      type="text"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="e.g., $99/month or $2,499/year"
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setProductForm({ name: '', category: 'Subscription', price: '', status: 'Active' })
                  }}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Products Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Import Products</h2>
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
                    if (file.size > 5 * 1024 * 1024) {
                      showToast('File size exceeds 5MB limit', 'error')
                      return
                    }
                    if (!file.name.endsWith('.csv')) {
                      showToast('Please upload a CSV file', 'error')
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
                    <p className="mb-2 text-sm font-medium text-slate-900">Drag and drop CSV file here</p>
                    <p className="mb-4 text-xs text-slate-600">or</p>
                    <input
                      type="file"
                      id="product-import-file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            showToast('File size exceeds 5MB limit', 'error')
                            return
                          }
                          setImportFile(file)
                        }
                        e.target.value = ''
                      }}
                    />
                    <label
                      htmlFor="product-import-file"
                      className="cursor-pointer rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                    >
                      Browse Files
                    </label>
                    <p className="mt-4 text-xs text-slate-500">
                      CSV format: name, category, price, status (Max 5MB)
                    </p>
                  </>
                )}
              </div>
              {isImporting && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700">Importing products...</span>
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
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs font-medium text-slate-900">Import Options</p>
                <div className="mt-2 space-y-1.5 text-xs text-slate-600">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-3 w-3 rounded border-gray-300 text-brand focus:ring-brand"
                    />
                    <span>Skip duplicate products</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-3 w-3 rounded border-gray-300 text-brand focus:ring-brand"
                    />
                    <span>Update existing products</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setShowImportModal(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!importFile) {
                    showToast('Please select a CSV file to import', 'warning')
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
                        showToast('Products imported successfully!', 'success')
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
                {isImporting ? 'Importing...' : 'Import Products'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
