import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'

type FieldType = 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea' | 'checkbox' | 'file'
type FieldCategory = 'user' | 'product' | 'order' | 'content' | 'custom'

interface CustomField {
  id: number
  name: string
  label: string
  type: FieldType
  category: FieldCategory
  required: boolean
  defaultValue?: string
  options?: string[]
  createdAt: string
  usageCount: number
}

export const CustomFieldsPage = () => {
  const { showToast } = useToast()
  const [showFieldBuilder, setShowFieldBuilder] = useState(false)
  const [selectedField, setSelectedField] = useState<CustomField | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | FieldCategory>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | FieldType>('all')
  const [showAddOptionModal, setShowAddOptionModal] = useState(false)
  const [newOptionValue, setNewOptionValue] = useState('')

  const [newField, setNewField] = useState({
    name: '',
    label: '',
    type: 'text' as FieldType,
    category: 'custom' as FieldCategory,
    required: false,
    defaultValue: '',
    options: [] as string[],
  })

  const customFields: CustomField[] = [
    {
      id: 1,
      name: 'employee_id',
      label: 'Employee ID',
      type: 'text',
      category: 'user',
      required: true,
      createdAt: '2024-01-15',
      usageCount: 245,
    },
    {
      id: 2,
      name: 'company_size',
      label: 'Company Size',
      type: 'select',
      category: 'user',
      required: false,
      options: ['1-10', '11-50', '51-200', '201-500', '500+'],
      createdAt: '2024-01-20',
      usageCount: 189,
    },
    {
      id: 3,
      name: 'product_sku',
      label: 'Product SKU',
      type: 'text',
      category: 'product',
      required: true,
      createdAt: '2024-02-01',
      usageCount: 342,
    },
    {
      id: 4,
      name: 'warranty_period',
      label: 'Warranty Period (months)',
      type: 'number',
      category: 'product',
      required: false,
      defaultValue: '12',
      createdAt: '2024-02-10',
      usageCount: 156,
    },
    {
      id: 5,
      name: 'order_notes',
      label: 'Order Notes',
      type: 'textarea',
      category: 'order',
      required: false,
      createdAt: '2024-02-15',
      usageCount: 423,
    },
    {
      id: 6,
      name: 'content_tags',
      label: 'Content Tags',
      type: 'text',
      category: 'content',
      required: false,
      createdAt: '2024-03-01',
      usageCount: 278,
    },
    {
      id: 7,
      name: 'subscription_tier',
      label: 'Subscription Tier',
      type: 'select',
      category: 'user',
      required: true,
      options: ['Free', 'Basic', 'Pro', 'Enterprise'],
      createdAt: '2024-03-05',
      usageCount: 512,
    },
  ]

  const filteredFields = customFields.filter((field) => {
    const matchesSearch =
      field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.label.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || field.category === categoryFilter
    const matchesType = typeFilter === 'all' || field.type === typeFilter
    return matchesSearch && matchesCategory && matchesType
  })

  const stats = {
    total: customFields.length,
    user: customFields.filter((f) => f.category === 'user').length,
    product: customFields.filter((f) => f.category === 'product').length,
    totalUsage: customFields.reduce((sum, f) => sum + f.usageCount, 0),
  }

  const getFieldTypeIcon = (type: FieldType) => {
    switch (type) {
      case 'text':
        return '📝'
      case 'number':
        return '🔢'
      case 'email':
        return '📧'
      case 'date':
        return '📅'
      case 'select':
        return '📋'
      case 'textarea':
        return '📄'
      case 'checkbox':
        return '☑️'
      case 'file':
        return '📎'
      default:
        return '📦'
    }
  }

  const getCategoryColor = (category: FieldCategory) => {
    switch (category) {
      case 'user':
        return 'bg-blue-100 text-blue-700'
      case 'product':
        return 'bg-purple-100 text-purple-700'
      case 'order':
        return 'bg-emerald-100 text-emerald-700'
      case 'content':
        return 'bg-amber-100 text-amber-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const handleCreateField = () => {
    if (newField.name && newField.label) {
      showToast(`Creating field: ${newField.label} (${newField.type})`, 'success')
      setShowFieldBuilder(false)
      setNewField({
        name: '',
        label: '',
        type: 'text',
        category: 'custom',
        required: false,
        defaultValue: '',
        options: [],
      })
    }
  }

  const addOption = () => {
    if (newOptionValue.trim()) {
      setNewField({ ...newField, options: [...(newField.options || []), newOptionValue.trim()] })
      setNewOptionValue('')
      setShowAddOptionModal(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Custom Fields</h1>
          <p className="mt-1 text-sm text-slate-600">
            Create and manage custom fields to extend your data model. Add fields to users, products, orders, and more.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-gray-400">
            Import Fields
          </button>
          <button
            onClick={() => {
              setShowFieldBuilder(true)
              setSelectedField(null)
            }}
            className="rounded-md bg-brand px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-dark"
          >
            Create Field
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Fields</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.total}</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">User Fields</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.user}</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Product Fields</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.product}</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Usage</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.totalUsage}</p>
        </article>
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">All fields</span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-slate-700">
                {filteredFields.length} fields
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="Search by name or label..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as 'all' | FieldCategory)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="all">All Categories</option>
                <option value="user">User</option>
                <option value="product">Product</option>
                <option value="order">Order</option>
                <option value="content">Content</option>
                <option value="custom">Custom</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'all' | FieldType)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="all">All Types</option>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="email">Email</option>
                <option value="date">Date</option>
                <option value="select">Select</option>
                <option value="textarea">Textarea</option>
                <option value="checkbox">Checkbox</option>
                <option value="file">File</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredFields.map((field) => (
            <div
              key={field.id}
              className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50"
            >
              <div className="flex flex-1 items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xl">
                  {getFieldTypeIcon(field.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">{field.label}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getCategoryColor(field.category)}`}
                    >
                      {field.category}
                    </span>
                    {field.required && (
                      <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-medium text-rose-700">
                        Required
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-600">
                    <span className="font-mono">{field.name}</span>
                    <span>•</span>
                    <span className="capitalize">{field.type}</span>
                    <span>•</span>
                    <span>{field.usageCount} uses</span>
                    {field.options && field.options.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{field.options.length} options</span>
                      </>
                    )}
                  </div>
                  {field.options && field.options.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {field.options.slice(0, 3).map((option, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-slate-600"
                        >
                          {option}
                        </span>
                      ))}
                      {field.options.length > 3 && (
                        <span className="text-[10px] text-slate-500">
                          +{field.options.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Created {field.createdAt}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setSelectedField(field)
                      setShowFieldBuilder(true)
                    }}
                    className="rounded-md border border-gray-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-gray-400"
                  >
                    Edit
                  </button>
                  <button className="rounded-md border border-gray-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-gray-400">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFields.length === 0 && (
          <div className="px-4 py-12 text-center">
            <p className="text-sm text-slate-600">No fields found matching your criteria</p>
          </div>
        )}
      </section>

      {showFieldBuilder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {selectedField ? 'Edit Custom Field' : 'Create Custom Field'}
              </h2>
              <button
                onClick={() => {
                  setShowFieldBuilder(false)
                  setSelectedField(null)
                  setNewField({
                    name: '',
                    label: '',
                    type: 'text',
                    category: 'custom',
                    required: false,
                    defaultValue: '',
                    options: [],
                  })
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!newField.name.trim()) {
                  showToast('Please enter a field name', 'warning')
                  return
                }
                if (!/^[a-z0-9_]+$/.test(newField.name)) {
                  showToast('Field name must be lowercase with underscores only', 'error')
                  return
                }
                if (!newField.label.trim()) {
                  showToast('Please enter a display label', 'warning')
                  return
                }
                if ((newField.type === 'select' || selectedField?.type === 'select') && (!newField.options || newField.options.length === 0)) {
                  showToast('Please add at least one option for select fields', 'warning')
                  return
                }
                handleCreateField()
              }}
            >
              <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="field-name" className="block text-xs font-medium text-slate-600">
                        Field Name (ID) *
                      </label>
                      <input
                        id="field-name"
                        type="text"
                        required
                        value={selectedField?.name || newField.name}
                        onChange={(e) => setNewField({ ...newField, name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
                        placeholder="field_name"
                        pattern="[a-z0-9_]+"
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      />
                      <p className="mt-0.5 text-[10px] text-slate-500">Lowercase, underscores only</p>
                    </div>
                    <div>
                      <label htmlFor="field-label" className="block text-xs font-medium text-slate-600">
                        Display Label *
                      </label>
                      <input
                        id="field-label"
                        type="text"
                        required
                        value={selectedField?.label || newField.label}
                        onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                        placeholder="Field Label"
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="field-type" className="block text-xs font-medium text-slate-600">
                        Field Type *
                      </label>
                      <select
                        id="field-type"
                        required
                        value={selectedField?.type || newField.type}
                        onChange={(e) => setNewField({ ...newField, type: e.target.value as FieldType })}
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="date">Date</option>
                        <option value="select">Select (Dropdown)</option>
                        <option value="textarea">Textarea</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="file">File Upload</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="field-category" className="block text-xs font-medium text-slate-600">
                        Category *
                      </label>
                      <select
                        id="field-category"
                        required
                        value={selectedField?.category || newField.category}
                        onChange={(e) => setNewField({ ...newField, category: e.target.value as FieldCategory })}
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      >
                        <option value="user">User</option>
                        <option value="product">Product</option>
                        <option value="order">Order</option>
                        <option value="content">Content</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                  </div>
                  {(newField.type === 'select' || selectedField?.type === 'select') && (
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Options *</label>
                      <div className="mt-1 space-y-2">
                        {(newField.options || selectedField?.options || []).map((option, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={option}
                              readOnly
                              className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-slate-900"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (newField.options || []).filter((_, i) => i !== idx)
                                setNewField({ ...newField, options: updated })
                              }}
                              className="rounded-md border border-gray-300 px-2 py-1 text-xs text-slate-700 hover:border-gray-400"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setShowAddOptionModal(true)}
                          className="w-full rounded-md border border-dashed border-gray-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:border-gray-400"
                        >
                          + Add Option
                        </button>
                      </div>
                    </div>
                  )}
                  <div>
                    <label htmlFor="field-default" className="block text-xs font-medium text-slate-600">
                      Default Value (optional)
                    </label>
                    <input
                      id="field-default"
                      type="text"
                      value={selectedField?.defaultValue || newField.defaultValue}
                      onChange={(e) => setNewField({ ...newField, defaultValue: e.target.value })}
                      placeholder="Enter default value"
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedField?.required || newField.required}
                        onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                      />
                      <span className="text-xs font-medium text-slate-600">Required field</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowFieldBuilder(false)
                    setSelectedField(null)
                    setNewField({
                      name: '',
                      label: '',
                      type: 'text',
                      category: 'custom',
                      required: false,
                      defaultValue: '',
                      options: [],
                    })
                  }}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  {selectedField ? 'Update Field' : 'Create Field'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddOptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Add Option</h2>
              <button
                onClick={() => {
                  setShowAddOptionModal(false)
                  setNewOptionValue('')
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4">
              <label htmlFor="option-value" className="block text-xs font-medium text-slate-600">
                Option Value *
              </label>
              <input
                id="option-value"
                type="text"
                value={newOptionValue}
                onChange={(e) => setNewOptionValue(e.target.value)}
                placeholder="Enter option value"
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addOption()
                  }
                }}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddOptionModal(false)
                  setNewOptionValue('')
                }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addOption}
                disabled={!newOptionValue.trim()}
                className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Option
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

