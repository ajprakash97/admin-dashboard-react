import { useToast } from '../contexts/ToastContext'

export const SettingsPage = () => {
  const { showToast } = useToast()

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Configure your workspace, API keys, and environment-specific settings. This structure maps well to
          a future React Native settings screen.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.currentTarget
            const formData = new FormData(form)
            const workspaceName = formData.get('workspaceName') as string
            const timezone = formData.get('timezone') as string

            if (!workspaceName || !workspaceName.trim()) {
              showToast('Please enter a workspace name', 'warning')
              return
            }

            showToast(`Settings saved: ${workspaceName} (${timezone})`, 'success')
          }}
        >
          <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Workspace</h2>
            <p className="mt-1 text-xs text-slate-600">
              Basic metadata that you&apos;ll likely share between web and mobile clients.
            </p>
            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label htmlFor="workspace-name" className="block text-slate-600">
                  Workspace name *
                </label>
                <input
                  id="workspace-name"
                  name="workspaceName"
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-0 focus:border-brand focus:ring-1 focus:ring-brand"
                  placeholder="Acme Inc. Admin"
                />
              </div>
              <div>
                <label htmlFor="workspace-timezone" className="block text-slate-600">
                  Default timezone *
                </label>
                <select
                  id="workspace-timezone"
                  name="timezone"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-0 focus:border-brand focus:ring-1 focus:ring-brand"
                >
                  <option>UTC</option>
                  <option>America/New_York</option>
                  <option>Europe/London</option>
                  <option>Asia/Kolkata</option>
                </select>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-md bg-brand px-3 py-2 text-xs font-medium text-white hover:bg-brand-dark"
                >
                  Save Workspace Settings
                </button>
              </div>
            </div>
          </article>
        </form>

        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">API access</h2>
          <p className="mt-1 text-xs text-slate-600">
            Keep secrets on the server. Clients (web or mobile) only use short-lived tokens.
          </p>
          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
              <div>
                <p className="text-slate-900">Public client key</p>
                <p className="text-[11px] text-slate-500">Used by your React / React Native apps.</p>
              </div>
              <button className="rounded-full border border-gray-300 px-3 py-1 text-[11px] font-medium text-slate-700 hover:border-gray-400">
                Copy
              </button>
            </div>
            <button className="w-full rounded-md border border-dashed border-gray-300 bg-white px-3 py-2 text-[11px] font-medium text-slate-700 hover:border-gray-400">
              Rotate secret key
            </button>
          </div>
        </article>
      </section>
    </div>
  )
}
