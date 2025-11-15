import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'

type FileType = 'image' | 'document' | 'video' | 'audio' | 'other'
type ViewMode = 'grid' | 'list'

interface FileItem {
  id: number
  name: string
  type: FileType
  size: string
  uploadedBy: string
  uploadedAt: string
  folder?: string
  url?: string
}

export const FilesPage = () => {
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | FileType>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [sortField, setSortField] = useState<'name' | 'type' | 'size' | 'uploadedAt'>('uploadedAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const folders = ['Documents', 'Images', 'Videos', 'Templates', 'Archives']

  const [files, setFiles] = useState<FileItem[]>([
    {
      id: 1,
      name: 'company-logo.png',
      type: 'image',
      size: '2.4 MB',
      uploadedBy: 'Jane Cooper',
      uploadedAt: '2024-03-10',
      folder: 'Images',
    },
    {
      id: 2,
      name: 'quarterly-report-2024.pdf',
      type: 'document',
      size: '5.1 MB',
      uploadedBy: 'Cody Fisher',
      uploadedAt: '2024-03-08',
      folder: 'Documents',
    },
    {
      id: 3,
      name: 'product-demo.mp4',
      type: 'video',
      size: '124.5 MB',
      uploadedBy: 'Kristin Watson',
      uploadedAt: '2024-03-05',
      folder: 'Videos',
    },
    {
      id: 4,
      name: 'invoice-template.docx',
      type: 'document',
      size: '892 KB',
      uploadedBy: 'Robert Fox',
      uploadedAt: '2024-03-01',
      folder: 'Templates',
    },
    {
      id: 5,
      name: 'hero-image.jpg',
      type: 'image',
      size: '3.2 MB',
      uploadedBy: 'Darlene Robertson',
      uploadedAt: '2024-02-28',
      folder: 'Images',
    },
    {
      id: 6,
      name: 'background-music.mp3',
      type: 'audio',
      size: '4.8 MB',
      uploadedBy: 'Jane Cooper',
      uploadedAt: '2024-02-25',
      folder: 'Archives',
    },
    {
      id: 7,
      name: 'user-manual.pdf',
      type: 'document',
      size: '12.3 MB',
      uploadedBy: 'Cody Fisher',
      uploadedAt: '2024-02-20',
      folder: 'Documents',
    },
    {
      id: 8,
      name: 'screenshot-2024.png',
      type: 'image',
      size: '1.8 MB',
      uploadedBy: 'Kristin Watson',
      uploadedAt: '2024-02-15',
      folder: 'Images',
    },
  ])

  // Store actual File objects for uploaded files
  const [fileObjects, setFileObjects] = useState<Map<number, File>>(new Map())

  const filteredFiles = files
    .filter((file) => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = typeFilter === 'all' || file.type === typeFilter
      const matchesFolder = !currentFolder || file.folder === currentFolder
      return matchesSearch && matchesType && matchesFolder
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
        case 'size':
          // Extract numeric value from size string (e.g., "2.4 MB" -> 2.4)
          aValue = parseFloat(a.size.replace(/[^0-9.]/g, '')) || 0
          bValue = parseFloat(b.size.replace(/[^0-9.]/g, '')) || 0
          break
        case 'uploadedAt':
          aValue = a.uploadedAt
          bValue = b.uploadedAt
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  const handleSort = (field: 'name' | 'type' | 'size' | 'uploadedAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const stats = {
    total: files.length,
    totalSize: '153.2 MB',
    images: files.filter((f) => f.type === 'image').length,
    documents: files.filter((f) => f.type === 'document').length,
  }

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'image':
        return '🖼️'
      case 'document':
        return '📄'
      case 'video':
        return '🎥'
      case 'audio':
        return '🎵'
      default:
        return '📦'
    }
  }

  const getFileTypeColor = (type: FileType) => {
    switch (type) {
      case 'image':
        return 'bg-purple-100 text-purple-700'
      case 'document':
        return 'bg-blue-100 text-blue-700'
      case 'video':
        return 'bg-red-100 text-red-700'
      case 'audio':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileTypeFromMime = (mimeType: string): FileType => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (
      mimeType.includes('pdf') ||
      mimeType.includes('document') ||
      mimeType.includes('text') ||
      mimeType.includes('word') ||
      mimeType.includes('excel') ||
      mimeType.includes('spreadsheet')
    )
      return 'document'
    return 'other'
  }

  const handleFileUpload = async (fileList: FileList | null, targetFolder: string) => {
    if (!fileList || fileList.length === 0) {
      showToast('Please select files to upload', 'warning')
      return
    }

    const maxSize = 100 * 1024 * 1024 // 100MB
    const filesToUpload: File[] = []
    const invalidFiles: string[] = []

    // Validate files
    Array.from(fileList).forEach((file) => {
      if (file.size > maxSize) {
        invalidFiles.push(`${file.name} (exceeds 100MB limit)`)
      } else {
        filesToUpload.push(file)
      }
    })

    if (invalidFiles.length > 0) {
      showToast(`Some files exceed size limit: ${invalidFiles.join(', ')}`, 'error')
    }

    if (filesToUpload.length === 0) return

    // Simulate upload progress
    filesToUpload.forEach((file) => {
      const fileName = file.name
      setUploadingFiles((prev) => [...prev, fileName])

      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)

          // Add file to list
          const newFile: FileItem = {
            id: Date.now() + Math.random(),
            name: file.name,
            type: getFileTypeFromMime(file.type),
            size: formatFileSize(file.size),
            uploadedBy: 'Current User',
            uploadedAt: new Date().toISOString().split('T')[0],
            folder: targetFolder || 'Root',
          }

          setFiles((prev) => [...prev, newFile])
          setFileObjects((prev) => {
            const newMap = new Map(prev)
            newMap.set(newFile.id, file)
            return newMap
          })

          setUploadingFiles((prev) => {
            const updated = prev.filter((f) => f !== fileName)
            // Close modal if all uploads are complete
            if (updated.length === 0) {
              setTimeout(() => {
                setShowUploadModal(false)
              }, 500)
            }
            return updated
          })
          setUploadProgress((prev) => {
            const newProgress = { ...prev }
            delete newProgress[fileName]
            return newProgress
          })

          showToast(`File "${file.name}" uploaded successfully!`, 'success')
        } else {
          setUploadProgress((prev) => ({ ...prev, [fileName]: progress }))
        }
      }, 200)
    })

    showToast(`Uploading ${filesToUpload.length} file(s)...`, 'info')
  }

  const handleFileDownload = (file: FileItem) => {
    const fileObj = fileObjects.get(file.id)

    if (fileObj) {
      // Download actual uploaded file
      const url = URL.createObjectURL(fileObj)
      const link = document.createElement('a')
      link.href = url
      link.download = fileObj.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      showToast(`Downloading ${file.name}...`, 'info')
    } else {
      // For demo files, create a dummy file
      const blob = new Blob(['This is a demo file. In production, this would be the actual file content.'], {
        type: 'text/plain',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      showToast(`Downloading ${file.name}...`, 'info')
    }
  }

  const handleFileDelete = (file: FileItem) => {
    if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
      setFiles((prev) => prev.filter((f) => f.id !== file.id))
      setFileObjects((prev) => {
        const newMap = new Map(prev)
        newMap.delete(file.id)
        return newMap
      })
      showToast(`File "${file.name}" deleted successfully!`, 'success')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">File Management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Upload, organize, and manage your files. Support for images, documents, videos, and more.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-dark"
          >
            Upload Files
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Files</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.total}</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Size</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.totalSize}</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Images</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.images}</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Documents</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.documents}</p>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-[200px,1fr]">
        <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-slate-900">Folders</h2>
            <button className="text-xs text-brand hover:text-brand-dark">+ New</button>
          </div>
          <div className="space-y-1">
            <button
              onClick={() => setCurrentFolder(null)}
              className={`w-full rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                !currentFolder
                  ? 'bg-gray-100 text-slate-900'
                  : 'text-slate-600 hover:bg-gray-50'
              }`}
            >
              📁 All Files
            </button>
            {folders.map((folder) => (
              <button
                key={folder}
                onClick={() => setCurrentFolder(folder)}
                className={`w-full rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                  currentFolder === folder
                    ? 'bg-gray-100 text-slate-900'
                    : 'text-slate-600 hover:bg-gray-50'
                }`}
              >
                📁 {folder}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'all' | FileType)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="document">Documents</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="other">Other</option>
              </select>
              <select
                value={`${sortField}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-')
                  setSortField(field as 'name' | 'type' | 'size' | 'uploadedAt')
                  setSortDirection(direction as 'asc' | 'desc')
                }}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="uploadedAt-desc">Sort: Newest First</option>
                <option value="uploadedAt-asc">Sort: Oldest First</option>
                <option value="name-asc">Sort: Name A-Z</option>
                <option value="name-desc">Sort: Name Z-A</option>
                <option value="size-desc">Sort: Largest First</option>
                <option value="size-asc">Sort: Smallest First</option>
                <option value="type-asc">Sort: Type A-Z</option>
              </select>
              <div className="flex rounded-md border border-gray-300 bg-white">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-2 py-1 text-xs ${
                    viewMode === 'grid' ? 'bg-gray-100 text-slate-900' : 'text-slate-600'
                  }`}
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-2 py-1 text-xs ${
                    viewMode === 'list' ? 'bg-gray-100 text-slate-900' : 'text-slate-600'
                  }`}
                >
                  ☰
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="group rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-24 items-center justify-center rounded-lg bg-gray-100 text-3xl">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="mt-2">
                    <p className="truncate text-xs font-medium text-slate-900" title={file.name}>
                      {file.name}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-600">{file.size}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${getFileTypeColor(file.type)}`}
                      >
                        {file.type}
                      </span>
                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => handleFileDownload(file)}
                          className="rounded p-1 text-slate-600 hover:bg-gray-100"
                          title="Download"
                        >
                          📥
                        </button>
                        <button
                          onClick={() => handleFileDelete(file)}
                          className="rounded p-1 text-slate-600 hover:bg-gray-100"
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="divide-y divide-gray-200">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50"
                  >
                    <div className="flex flex-1 items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xl">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{file.name}</p>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-600">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>{file.folder}</span>
                          <span>•</span>
                          <span>By {file.uploadedBy}</span>
                          <span>•</span>
                          <span>{file.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getFileTypeColor(file.type)}`}
                      >
                        {file.type}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleFileDownload(file)}
                          className="rounded-md border border-gray-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-gray-400"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleFileDelete(file)}
                          className="rounded-md border border-gray-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-gray-400"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredFiles.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-sm text-slate-600">No files found matching your criteria</p>
            </div>
          )}
        </div>
      </section>

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Upload Files</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4">
              <div
                className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-brand bg-brand/5'
                    : 'border-gray-300 bg-gray-50'
                }`}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  const targetFolder = (document.getElementById('upload-folder') as HTMLSelectElement)?.value || 'Root'
                  handleFileUpload(e.dataTransfer.files, targetFolder)
                }}
              >
                <p className="mb-2 text-sm font-medium text-slate-900">Drag and drop files here</p>
                <p className="mb-4 text-xs text-slate-600">or</p>
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const targetFolder = (document.getElementById('upload-folder') as HTMLSelectElement)?.value || 'Root'
                    handleFileUpload(e.target.files, targetFolder)
                    // Reset input
                    e.target.value = ''
                  }}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  Browse Files
                </label>
                <p className="mt-4 text-xs text-slate-500">
                  Supported: Images, PDFs, Documents, Videos (Max 100MB per file)
                </p>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-600">Upload to Folder</label>
                <select
                  id="upload-folder"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option>Root</option>
                  {folders.map((folder) => (
                    <option key={folder}>{folder}</option>
                  ))}
                </select>
              </div>
              {uploadingFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium text-slate-600">Uploading files...</p>
                  {uploadingFiles.map((fileName) => (
                    <div key={fileName} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-700">{fileName}</span>
                        <span className="text-slate-600">
                          {Math.round(uploadProgress[fileName] || 0)}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-brand transition-all"
                          style={{ width: `${uploadProgress[fileName] || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setUploadingFiles([])
                  setUploadProgress({})
                  setIsDragging(false)
                }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={uploadingFiles.length > 0}
              >
                {uploadingFiles.length > 0 ? 'Uploading...' : 'Close'}
              </button>
              {uploadingFiles.length === 0 && (
                <button
                  onClick={() => {
                    const fileInput = document.getElementById('file-upload') as HTMLInputElement
                    if (fileInput) {
                      fileInput.click()
                    }
                  }}
                  className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  Select Files
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

