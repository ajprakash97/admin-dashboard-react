import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'

export const ProfilePage = () => {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'activity'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Administrator of the Admin Dashboard',
    location: 'New York, USA',
    timezone: 'America/New_York',
    language: 'English',
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    marketingEmails: false,
    weeklyDigest: true,
    darkMode: false,
  })

  const activityLog = [
    { id: 1, action: 'Logged in', time: '2 hours ago', ip: '192.168.1.1' },
    { id: 2, action: 'Updated profile', time: '1 day ago', ip: '192.168.1.1' },
    { id: 3, action: 'Changed password', time: '3 days ago', ip: '192.168.1.1' },
    { id: 4, action: 'Exported data', time: '1 week ago', ip: '192.168.1.1' },
    { id: 5, action: 'Logged in', time: '2 weeks ago', ip: '192.168.1.2' },
  ]

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    showToast('Profile updated successfully!', 'success')
    setIsEditing(false)
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error')
      return
    }
    if (passwordForm.newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error')
      return
    }
    showToast('Password changed successfully!', 'success')
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handlePreferencesUpdate = () => {
    showToast('Preferences saved successfully!', 'success')
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Profile</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your personal information, security settings, and preferences.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Summary Card */}
        <aside className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand text-2xl font-semibold text-white">
                AU
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                {profileForm.firstName} {profileForm.lastName}
              </h2>
              <p className="mt-1 text-sm text-slate-600">{profileForm.email}</p>
              <p className="mt-1 text-xs text-slate-500">{profileForm.location}</p>
              <div className="mt-4 w-full space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs">
                  <span className="text-slate-600">Role</span>
                  <span className="font-medium text-slate-900">Administrator</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs">
                  <span className="text-slate-600">Member since</span>
                  <span className="font-medium text-slate-900">Jan 2024</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs">
                  <span className="text-slate-600">Last active</span>
                  <span className="font-medium text-slate-900">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="mb-4 flex gap-2 border-b border-gray-200">
            {[
              { id: 'profile', label: 'Profile', icon: '👤' },
              { id: 'security', label: 'Security', icon: '🔐' },
              { id: 'preferences', label: 'Preferences', icon: '⚙️' },
              { id: 'activity', label: 'Activity', icon: '📋' },
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

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleProfileUpdate} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-medium text-slate-600">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand disabled:bg-gray-50 disabled:text-slate-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-medium text-slate-600">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand disabled:bg-gray-50 disabled:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-slate-600">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand disabled:bg-gray-50 disabled:text-slate-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-slate-600">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand disabled:bg-gray-50 disabled:text-slate-500"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-xs font-medium text-slate-600">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand disabled:bg-gray-50 disabled:text-slate-500"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="location" className="block text-xs font-medium text-slate-600">
                      Location
                    </label>
                    <input
                      id="location"
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand disabled:bg-gray-50 disabled:text-slate-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="timezone" className="block text-xs font-medium text-slate-600">
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      value={profileForm.timezone}
                      onChange={(e) => setProfileForm({ ...profileForm, timezone: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand disabled:bg-gray-50 disabled:text-slate-500"
                    >
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="America/Chicago">America/Chicago (CST)</option>
                      <option value="America/Denver">America/Denver (MST)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false)
                        // Reset form to original values
                        setProfileForm({
                          firstName: 'Admin',
                          lastName: 'User',
                          email: 'admin@example.com',
                          phone: '+1 (555) 123-4567',
                          bio: 'Administrator of the Admin Dashboard',
                          location: 'New York, USA',
                          timezone: 'America/New_York',
                          language: 'English',
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
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-xs font-medium text-slate-600">
                      Current Password *
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-xs font-medium text-slate-600">
                      New Password *
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      required
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                    <p className="mt-1 text-xs text-slate-500">Must be at least 8 characters</p>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-medium text-slate-600">
                      Confirm New Password *
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      required
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Two-Factor Authentication</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
                <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">2FA Status</p>
                    <p className="text-xs text-slate-600">Not enabled</p>
                  </div>
                  <button className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
                    Enable 2FA
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Active Sessions</h2>
                <p className="mt-1 text-sm text-slate-600">Manage your active login sessions across devices.</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Current Session</p>
                      <p className="text-xs text-slate-600">Windows • Chrome • 192.168.1.1</p>
                      <p className="text-xs text-slate-500">Active now</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Mobile Device</p>
                      <p className="text-xs text-slate-600">iOS • Safari • 192.168.1.2</p>
                      <p className="text-xs text-slate-500">2 hours ago</p>
                    </div>
                    <button className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-slate-700 hover:border-gray-400">
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Notification Preferences</h2>
              <p className="mt-1 text-sm text-slate-600">Choose how you want to be notified about updates and activities.</p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Email Notifications</p>
                    <p className="text-xs text-slate-600">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Push Notifications</p>
                    <p className="text-xs text-slate-600">Receive browser push notifications</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={preferences.pushNotifications}
                      onChange={(e) => setPreferences({ ...preferences, pushNotifications: e.target.checked })}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">SMS Notifications</p>
                    <p className="text-xs text-slate-600">Receive notifications via SMS</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={preferences.smsNotifications}
                      onChange={(e) => setPreferences({ ...preferences, smsNotifications: e.target.checked })}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Marketing Emails</p>
                    <p className="text-xs text-slate-600">Receive marketing and promotional emails</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={preferences.marketingEmails}
                      onChange={(e) => setPreferences({ ...preferences, marketingEmails: e.target.checked })}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Weekly Digest</p>
                    <p className="text-xs text-slate-600">Receive a weekly summary of activities</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={preferences.weeklyDigest}
                      onChange={(e) => setPreferences({ ...preferences, weeklyDigest: e.target.checked })}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handlePreferencesUpdate}
                  className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Account Activity</h2>
              <p className="mt-1 text-sm text-slate-600">Recent activity and login history for your account.</p>

              <div className="mt-6 space-y-3">
                {activityLog.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                      <p className="text-xs text-slate-600">
                        {activity.time} • {activity.ip}
                      </p>
                    </div>
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-gray-400">
                  Load More
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

