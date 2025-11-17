import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'

type ContentStatus = 'Published' | 'Draft' | 'Archived' | 'Scheduled'
type ContentType = 'Article' | 'Page' | 'Product' | 'Blog' | 'Document'

interface Content {
  id: number
  title: string
  type: ContentType
  status: ContentStatus
  author: string
  createdAt: string
  updatedAt: string
  views: number
  category?: string
  tags?: string[]
  scheduledDate?: string
}

export const ContentPage = () => {
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ContentStatus>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | ContentType>('all')
  const [sortField, setSortField] = useState<'title' | 'type' | 'status' | 'createdAt' | 'updatedAt' | 'views'>('updatedAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [showEditor, setShowEditor] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)

  const contentItems: Content[] = [
    {
      id: 1,
      title: 'Getting Started Guide',
      type: 'Article',
      status: 'Published',
      author: 'Jane Cooper',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      views: 1245,
      category: 'Documentation',
      tags: ['guide', 'tutorial', 'beginner'],
    },
    {
      id: 2,
      title: 'Product Launch Announcement',
      type: 'Blog',
      status: 'Published',
      author: 'Cody Fisher',
      createdAt: '2024-02-10',
      updatedAt: '2024-02-10',
      views: 3420,
      category: 'News',
      tags: ['product', 'announcement'],
    },
    {
      id: 3,
      title: 'API Documentation v2.0',
      type: 'Document',
      status: 'Draft',
      author: 'Kristin Watson',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-05',
      views: 0,
      category: 'Documentation',
      tags: ['api', 'technical'],
    },
    {
      id: 4,
      title: 'Homepage Content',
      type: 'Page',
      status: 'Published',
      author: 'Robert Fox',
      createdAt: '2024-01-05',
      updatedAt: '2024-02-15',
      views: 15670,
      category: 'Marketing',
      tags: ['homepage', 'landing'],
    },
    {
      id: 5,
      title: 'New Feature Preview',
      type: 'Blog',
      status: 'Scheduled',
      author: 'Darlene Robertson',
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10',
      views: 0,
      category: 'News',
      tags: ['feature', 'preview'],
      scheduledDate: '2024-03-15',
    },
    {
      id: 6,
      title: 'User Guide: Advanced Settings',
      type: 'Article',
      status: 'Archived',
      author: 'Jane Cooper',
      createdAt: '2023-12-01',
      updatedAt: '2023-12-20',
      views: 890,
      category: 'Documentation',
      tags: ['guide', 'advanced'],
    },
  ]

  const filteredContent = contentItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: contentItems.length,
    published: contentItems.filter((c) => c.status === 'Published').length,
    draft: contentItems.filter((c) => c.status === 'Draft').length,
    scheduled: contentItems.filter((c) => c.status === 'Scheduled').length,
    totalViews: contentItems.reduce((sum, c) => sum + c.views, 0),
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Content Management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Create, edit, and manage your content. Organize articles, pages, blogs, and documents.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-gray-400">
            Import
          </button>
          <button
            onClick={() => setShowEditor(true)}
            className="rounded-md bg-brand px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-dark"
          >
            New Content
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Content</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.total}</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Published</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.published}</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Drafts</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.draft}</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Views</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.totalViews.toLocaleString()}</p>
        </article>
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">All content</span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-slate-700">
                {filteredContent.length} items
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="Search by title, category, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | ContentStatus)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="all">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Archived">Archived</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'all' | ContentType)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="all">All Types</option>
                <option value="Article">Article</option>
                <option value="Page">Page</option>
                <option value="Blog">Blog</option>
                <option value="Product">Product</option>
                <option value="Document">Document</option>
              </select>
              <select
                value={`${sortField}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-')
                  setSortField(field as 'title' | 'type' | 'status' | 'createdAt' | 'updatedAt' | 'views')
                  setSortDirection(direction as 'asc' | 'desc')
                }}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="updatedAt-desc">Sort: Recently Updated</option>
                <option value="updatedAt-asc">Sort: Oldest Updated</option>
                <option value="createdAt-desc">Sort: Newest First</option>
                <option value="createdAt-asc">Sort: Oldest First</option>
                <option value="title-asc">Sort: Title A-Z</option>
                <option value="title-desc">Sort: Title Z-A</option>
                <option value="views-desc">Sort: Most Views</option>
                <option value="views-asc">Sort: Least Views</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredContent.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50"
            >
              <div className="flex flex-1 items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-xs font-semibold text-slate-700">
                  {item.type[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        item.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-700'
                          : item.status === 'Draft'
                            ? 'bg-amber-100 text-amber-700'
                            : item.status === 'Scheduled'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {item.status}
                    </span>
                    {item.scheduledDate && (
                      <span className="text-[10px] text-slate-500">
                        Scheduled: {item.scheduledDate}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-600">
                    <span>{item.type}</span>
                    <span>•</span>
                    <span>{item.category || 'Uncategorized'}</span>
                    <span>•</span>
                    <span>By {item.author}</span>
                    <span>•</span>
                    <span>{item.views.toLocaleString()} views</span>
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-slate-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Updated {item.updatedAt}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setSelectedContent(item)
                      setShowEditor(true)
                    }}
                    className="rounded-md border border-gray-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-gray-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedContent(item)
                      setShowViewModal(true)
                    }}
                    className="rounded-md border border-gray-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-gray-400"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="px-4 py-12 text-center">
            <p className="text-sm text-slate-600">No content found matching your criteria</p>
          </div>
        )}
      </section>

      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {selectedContent ? 'Edit Content' : 'Create New Content'}
              </h2>
              <button
                onClick={() => {
                  setShowEditor(false)
                  setSelectedContent(null)
                }}
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
                const title = formData.get('title') as string
                const action = (e.nativeEvent as any).submitter?.value || 'publish'

                if (!title || !title.trim()) {
                  showToast('Please enter a content title', 'warning')
                  return
                }

                if (action === 'draft') {
                  showToast('Content saved as draft!', 'success')
                } else if (selectedContent) {
                  showToast(`Content "${title}" updated and published!`, 'success')
                } else {
                  showToast('Content published successfully!', 'success')
                }

                setShowEditor(false)
                setSelectedContent(null)
              }}
            >
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="content-title" className="block text-xs font-medium text-slate-600">
                        Title *
                      </label>
                      <input
                        id="content-title"
                        type="text"
                        name="title"
                        required
                        defaultValue={selectedContent?.title || ''}
                        placeholder="Enter content title"
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      />
                    </div>
                    <div>
                      <label htmlFor="content-type" className="block text-xs font-medium text-slate-600">
                        Content Type *
                      </label>
                      <select
                        id="content-type"
                        name="type"
                        required
                        defaultValue={selectedContent?.type || 'Article'}
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      >
                        <option>Article</option>
                        <option>Page</option>
                        <option>Blog</option>
                        <option>Product</option>
                        <option>Document</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="content-body" className="block text-xs font-medium text-slate-600">
                      Content *
                    </label>
                    <textarea
                      id="content-body"
                      name="content"
                      required
                      rows={12}
                      placeholder="Write your content here..."
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      defaultValue={
                        selectedContent
                          ? 'This is the content body. In a real app, this would be a rich text editor.'
                          : ''
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="content-category" className="block text-xs font-medium text-slate-600">
                        Category
                      </label>
                      <input
                        id="content-category"
                        type="text"
                        name="category"
                        defaultValue={selectedContent?.category || ''}
                        placeholder="Enter category"
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      />
                    </div>
                    <div>
                      <label htmlFor="content-tags" className="block text-xs font-medium text-slate-600">
                        Tags (comma separated)
                      </label>
                      <input
                        id="content-tags"
                        type="text"
                        name="tags"
                        defaultValue={selectedContent?.tags?.join(', ') || ''}
                        placeholder="tag1, tag2, tag3"
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="content-status" className="block text-xs font-medium text-slate-600">
                        Status *
                      </label>
                      <select
                        id="content-status"
                        name="status"
                        required
                        defaultValue={selectedContent?.status || 'Draft'}
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      >
                        <option>Draft</option>
                        <option>Published</option>
                        <option>Scheduled</option>
                        <option>Archived</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="content-schedule" className="block text-xs font-medium text-slate-600">
                        Schedule Date (optional)
                      </label>
                      <input
                        id="content-schedule"
                        type="datetime-local"
                        name="scheduleDate"
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditor(false)
                    setSelectedContent(null)
                  }}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  name="action"
                  value="draft"
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  name="action"
                  value="publish"
                  className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  {selectedContent ? 'Update' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Content Modal */}
      {showViewModal && selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-lg font-semibold text-brand">
                  {selectedContent.type[0]}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{selectedContent.title}</h2>
                  <p className="text-xs text-slate-600">
                    {selectedContent.type} • {selectedContent.category || 'Uncategorized'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedContent(selectedContent)
                    setShowViewModal(false)
                    setShowEditor(true)
                  }}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-gray-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    setSelectedContent(null)
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Content Metadata */}
              <div className="mb-6 grid gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-slate-500">Status</p>
                  <p className="mt-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        selectedContent.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-700'
                          : selectedContent.status === 'Draft'
                            ? 'bg-amber-100 text-amber-700'
                            : selectedContent.status === 'Scheduled'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {selectedContent.status}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Views</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selectedContent.views.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Author</p>
                  <p className="mt-1 text-sm text-slate-900">{selectedContent.author}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Content Type</p>
                  <p className="mt-1 text-sm text-slate-900">{selectedContent.type}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Created</p>
                  <p className="mt-1 text-sm text-slate-900">{selectedContent.createdAt}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Last Updated</p>
                  <p className="mt-1 text-sm text-slate-900">{selectedContent.updatedAt}</p>
                </div>
                {selectedContent.scheduledDate && (
                  <div>
                    <p className="text-xs font-medium text-slate-500">Scheduled For</p>
                    <p className="mt-1 text-sm text-slate-900">{selectedContent.scheduledDate}</p>
                  </div>
                )}
                {selectedContent.category && (
                  <div>
                    <p className="text-xs font-medium text-slate-500">Category</p>
                    <p className="mt-1 text-sm text-slate-900">{selectedContent.category}</p>
                  </div>
                )}
              </div>

              {/* Tags */}
              {selectedContent.tags && selectedContent.tags.length > 0 && (
                <div className="mb-6">
                  <p className="mb-2 text-xs font-medium text-slate-500">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedContent.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Preview */}
              <div>
                <p className="mb-2 text-xs font-medium text-slate-500">Content Preview</p>
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <div className="prose prose-sm max-w-none">
                    <h3 className="text-lg font-semibold text-slate-900">{selectedContent.title}</h3>
                    <div className="mt-4 text-sm text-slate-700">
                      <p className="mb-4">
                        This is a preview of the content. In a real application, this would display the actual
                        rendered content with all formatting, images, and rich text elements.
                      </p>
                      <p className="mb-4">
                        For "{selectedContent.title}", the content would include all the details, formatting, and
                        media that was added during creation or editing.
                      </p>
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <p className="text-xs font-medium text-slate-600">Content Type: {selectedContent.type}</p>
                        <p className="mt-2 text-xs text-slate-600">
                          This {selectedContent.type.toLowerCase()} was created by {selectedContent.author} on{' '}
                          {selectedContent.createdAt} and last updated on {selectedContent.updatedAt}.
                        </p>
                        {selectedContent.status === 'Published' && (
                          <p className="mt-2 text-xs text-slate-600">
                            This content is currently live and has been viewed {selectedContent.views.toLocaleString()}{' '}
                            times.
                          </p>
                        )}
                        {selectedContent.status === 'Draft' && (
                          <p className="mt-2 text-xs text-amber-700">
                            This content is currently in draft mode and is not visible to the public.
                          </p>
                        )}
                        {selectedContent.status === 'Scheduled' && selectedContent.scheduledDate && (
                          <p className="mt-2 text-xs text-blue-700">
                            This content is scheduled to be published on {selectedContent.scheduledDate}.
                          </p>
                        )}
                        {selectedContent.status === 'Archived' && (
                          <p className="mt-2 text-xs text-gray-700">
                            This content has been archived and is no longer publicly accessible.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="mb-3 text-xs font-medium text-slate-500">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedContent(selectedContent)
                      setShowViewModal(false)
                      setShowEditor(true)
                    }}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-gray-400"
                  >
                    ✏️ Edit Content
                  </button>
                  {selectedContent.status === 'Published' && (
                  <button
                    onClick={() => {
                      showToast(`Opening "${selectedContent.title}" in new tab...`, 'info')
                    }}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-gray-400"
                  >
                    🔗 View Live
                  </button>
                )}
                <button
                  onClick={() => {
                    const content = `Content: ${selectedContent.title}\n\nType: ${selectedContent.type}\nStatus: ${selectedContent.status}\nAuthor: ${selectedContent.author}\nCreated: ${selectedContent.createdAt}\nUpdated: ${selectedContent.updatedAt}\nViews: ${selectedContent.views}\nCategory: ${selectedContent.category || 'N/A'}\nTags: ${selectedContent.tags?.join(', ') || 'N/A'}\n\nThis is a preview of the content. In production, this would contain the full content body.`
                      const blob = new Blob([content], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const link = document.createElement('a')
                      link.href = url
                      link.download = `${selectedContent.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                      URL.revokeObjectURL(url)
                      showToast(`Content "${selectedContent.title}" downloaded`, 'success')
                    }}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-gray-400"
                  >
                    💾 Download
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${selectedContent.title}"?`)) {
                        showToast(`Content "${selectedContent.title}" deleted`, 'success')
                        setShowViewModal(false)
                        setSelectedContent(null)
                      }
                    }}
                    className="rounded-md border border-rose-300 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 hover:border-rose-400"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => {
                  setShowViewModal(false)
                  setSelectedContent(null)
                }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedContent(selectedContent)
                  setShowViewModal(false)
                  setShowEditor(true)
                }}
                className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
              >
                Edit Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

