import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'

type UserStatus = 'Active' | 'Invited' | 'Suspended' | 'Inactive'
type UserRole = 'Admin' | 'Editor' | 'Viewer' | 'Manager'

interface User {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  lastSeen: string
  joinedDate: string
  permissions: string[]
  department?: string
}

const users: User[] = [
  {
    id: 1,
    name: 'Jane Cooper',
    email: 'jane@example.com',
    role: 'Admin',
    status: 'Active',
    lastSeen: '2m ago',
    joinedDate: '2024-01-15',
    permissions: ['Full Access'],
    department: 'Engineering',
  },
  {
    id: 2,
    name: 'Cody Fisher',
    email: 'cody@example.com',
    role: 'Editor',
    status: 'Invited',
    lastSeen: '—',
    joinedDate: '—',
    permissions: ['Edit Content', 'View Reports'],
    department: 'Marketing',
  },
  {
    id: 3,
    name: 'Kristin Watson',
    email: 'kristin@example.com',
    role: 'Viewer',
    status: 'Active',
    lastSeen: '18m ago',
    joinedDate: '2024-02-20',
    permissions: ['View Only'],
    department: 'Sales',
  },
  {
    id: 4,
    name: 'Jerome Bell',
    email: 'jerome@example.com',
    role: 'Viewer',
    status: 'Suspended',
    lastSeen: '2d ago',
    joinedDate: '2024-01-10',
    permissions: ['View Only'],
    department: 'Support',
  },
  {
    id: 5,
    name: 'Robert Fox',
    email: 'robert@example.com',
    role: 'Admin',
    status: 'Active',
    lastSeen: '1h ago',
    joinedDate: '2023-12-05',
    permissions: ['Full Access'],
    department: 'Engineering',
  },
  {
    id: 6,
    name: 'Darlene Robertson',
    email: 'darlene@example.com',
    role: 'Editor',
    status: 'Active',
    lastSeen: '3h ago',
    joinedDate: '2024-03-01',
    permissions: ['Edit Content', 'View Reports', 'Manage Users'],
    department: 'Marketing',
  },
  {
    id: 7,
    name: 'Leslie Alexander',
    email: 'leslie@example.com',
    role: 'Manager',
    status: 'Active',
    lastSeen: '5m ago',
    joinedDate: '2024-01-25',
    permissions: ['View Reports', 'Manage Team'],
    department: 'Sales',
  },
  {
    id: 8,
    name: 'Emily Johnson',
    email: 'emily@example.com',
    role: 'Viewer',
    status: 'Inactive',
    lastSeen: '1w ago',
    joinedDate: '2024-02-15',
    permissions: ['View Only'],
    department: 'Support',
  },
]

const roleColors: Record<UserRole, string> = {
  Admin: 'bg-purple-100 text-purple-700',
  Editor: 'bg-blue-100 text-blue-700',
  Viewer: 'bg-gray-100 text-gray-700',
  Manager: 'bg-amber-100 text-amber-700',
}

export const UsersPage = () => {
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all')
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all')
  const [sortField, setSortField] = useState<'name' | 'email' | 'role' | 'status' | 'lastSeen'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importProgress, setImportProgress] = useState(0)
  const [isImporting, setIsImporting] = useState(false)
  const [isDraggingImport, setIsDraggingImport] = useState(false)
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'Viewer' as UserRole,
    department: '',
  })

  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      return matchesSearch && matchesStatus && matchesRole
    })
    .sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'email':
          aValue = a.email.toLowerCase()
          bValue = b.email.toLowerCase()
          break
        case 'role':
          aValue = a.role
          bValue = b.role
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'lastSeen':
          aValue = a.lastSeen
          bValue = b.lastSeen
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  const handleSort = (field: 'name' | 'email' | 'role' | 'status' | 'lastSeen') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'Active').length,
    invited: users.filter((u) => u.status === 'Invited').length,
    suspended: users.filter((u) => u.status === 'Suspended').length,
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">User Management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage user accounts, roles, permissions, and access control across your organization.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
          >
            Import Users
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
          >
            Export
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="rounded-md bg-brand px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-dark"
          >
            Invite User
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Users</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.total}</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Active</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.active}</p>
          <p className="mt-1 text-xs text-emerald-600">
            {((stats.active / stats.total) * 100).toFixed(1)}% of total
          </p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Invited</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.invited}</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Suspended</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.suspended}</p>
        </article>
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">All users</span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-slate-700">
                {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | UserStatus)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Invited">Invited</option>
                <option value="Suspended">Suspended</option>
                <option value="Inactive">Inactive</option>
              </select>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as 'all' | UserRole)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="all">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Manager">Manager</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs text-slate-700">
            <thead className="border-b border-gray-200 bg-gray-50 text-[11px] uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-2 font-medium">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-slate-900"
                  >
                    User
                    {sortField === 'name' && (
                      <span className="text-brand">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-2 font-medium">
                  <button
                    onClick={() => handleSort('role')}
                    className="flex items-center gap-1 hover:text-slate-900"
                  >
                    Role
                    {sortField === 'role' && (
                      <span className="text-brand">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-2 font-medium">Department</th>
                <th className="px-4 py-2 font-medium">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center gap-1 hover:text-slate-900"
                  >
                    Status
                    {sortField === 'status' && (
                      <span className="text-brand">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-2 font-medium">
                  <button
                    onClick={() => handleSort('lastSeen')}
                    className="flex items-center gap-1 hover:text-slate-900"
                  >
                    Last seen
                    {sortField === 'lastSeen' && (
                      <span className="text-brand">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-[11px] font-semibold text-slate-700">
                        {user.name
                          .split(' ')
                          .map((part) => part[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-600">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${roleColors[user.role]}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-700">{user.department || '—'}</td>
                  <td className="px-4 py-2">
                    <span
                      className={[
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
                        user.status === 'Active' && 'bg-emerald-100 text-emerald-700',
                        user.status === 'Invited' && 'bg-sky-100 text-sky-700',
                        user.status === 'Suspended' && 'bg-rose-100 text-rose-700',
                        user.status === 'Inactive' && 'bg-gray-100 text-gray-700',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">{user.lastSeen}</td>
                  <td className="px-4 py-2 text-right text-xs">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="rounded-full border border-gray-300 px-3 py-1 text-[11px] font-medium text-slate-700 hover:border-gray-400"
                      >
                        View
                      </button>
                      <button className="rounded-full border border-gray-300 px-3 py-1 text-[11px] font-medium text-slate-700 hover:border-gray-400">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="px-4 py-12 text-center">
            <p className="text-sm text-slate-600">No users found matching your criteria</p>
          </div>
        )}
      </section>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-600">Name</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Email</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Role</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedUser.role}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Department</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedUser.department || 'Not assigned'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Permissions</label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedUser.permissions.map((perm, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-slate-700"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Joined Date</label>
                  <p className="mt-1 text-sm text-slate-900">
                    {selectedUser.joinedDate === '—' ? 'Pending' : selectedUser.joinedDate}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
              >
                Close
              </button>
              <button className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
                Edit User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Invite User</h2>
              <button
                onClick={() => {
                  setShowInviteModal(false)
                  setInviteForm({ email: '', role: 'Viewer', department: '' })
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!inviteForm.email) {
                  showToast('Please enter an email address', 'warning')
                  return
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteForm.email)) {
                  showToast('Please enter a valid email address', 'error')
                  return
                }
                showToast(`Invitation sent to ${inviteForm.email} as ${inviteForm.role}`, 'success')
                setShowInviteModal(false)
                setInviteForm({ email: '', role: 'Viewer', department: '' })
              }}
            >
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="invite-email" className="block text-xs font-medium text-slate-600">
                      Email Address *
                    </label>
                    <input
                      id="invite-email"
                      type="email"
                      required
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                      placeholder="user@example.com"
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </div>
                  <div>
                    <label htmlFor="invite-role" className="block text-xs font-medium text-slate-600">
                      Role *
                    </label>
                    <select
                      id="invite-role"
                      required
                      value={inviteForm.role}
                      onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as UserRole })}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    >
                      <option value="Viewer">Viewer</option>
                      <option value="Editor">Editor</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="invite-department" className="block text-xs font-medium text-slate-600">
                      Department (Optional)
                    </label>
                    <input
                      id="invite-department"
                      type="text"
                      value={inviteForm.department}
                      onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
                      placeholder="e.g., Engineering, Marketing"
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false)
                    setInviteForm({ email: '', role: 'Viewer', department: '' })
                  }}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Users Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Import Users</h2>
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
                      id="user-import-file"
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
                      htmlFor="user-import-file"
                      className="cursor-pointer rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                    >
                      Browse Files
                    </label>
                    <p className="mt-4 text-xs text-slate-500">
                      CSV format: email, name, role, department (Max 5MB)
                    </p>
                  </>
                )}
              </div>
              {isImporting && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700">Importing users...</span>
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
                    <span>Skip duplicate emails</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-3 w-3 rounded border-gray-300 text-brand focus:ring-brand"
                    />
                    <span>Send invitation emails</span>
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
                        showToast('Users imported successfully!', 'success')
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
                {isImporting ? 'Importing...' : 'Import Users'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Export Users</h2>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4">
              <p className="mb-4 text-sm text-slate-600">Choose a format to export user data:</p>
              <div className="space-y-2">
                {['CSV', 'Excel', 'JSON'].map((format) => (
                  <button
                    key={format}
                    onClick={() => {
                      let content = ''
                      let mimeType = ''
                      let fileName = `users-export-${new Date().toISOString().split('T')[0]}`

                      const usersToExport = filteredUsers

                      if (format === 'CSV') {
                        content = 'Name,Email,Role,Status,Department,Last Seen\n'
                        usersToExport.forEach((user) => {
                          content += `${user.name},${user.email},${user.role},${user.status},${user.department || 'N/A'},${user.lastSeen}\n`
                        })
                        mimeType = 'text/csv'
                        fileName += '.csv'
                      } else if (format === 'JSON') {
                        content = JSON.stringify(
                          usersToExport.map((user) => ({
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            status: user.status,
                            department: user.department,
                            lastSeen: user.lastSeen,
                          })),
                          null,
                          2,
                        )
                        mimeType = 'application/json'
                        fileName += '.json'
                      } else {
                        content = 'Name,Email,Role,Status,Department,Last Seen\n'
                        usersToExport.forEach((user) => {
                          content += `${user.name},${user.email},${user.role},${user.status},${user.department || 'N/A'},${user.lastSeen}\n`
                        })
                        mimeType = 'application/vnd.ms-excel'
                        fileName += '.csv'
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

                      showToast(`Users exported as ${format}`, 'success')
                      setShowExportModal(false)
                    }}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:border-brand hover:bg-gray-50"
                  >
                    Export as {format}
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs font-medium text-slate-900">Export Filters</p>
                <div className="mt-2 space-y-1.5 text-xs text-slate-600">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-3 w-3 rounded border-gray-300 text-brand focus:ring-brand"
                    />
                    <span>Include email addresses</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-3 w-3 rounded border-gray-300 text-brand focus:ring-brand"
                    />
                    <span>Include permissions</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-3 w-3 rounded border-gray-300 text-brand focus:ring-brand"
                    />
                    <span>Include last seen dates</span>
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
