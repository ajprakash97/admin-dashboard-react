import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastProvider } from './contexts/ToastContext'
import { DashboardLayout } from './layout/DashboardLayout'
import { DashboardPage } from './pages/DashboardPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { AdvancedAnalyticsPage } from './pages/AdvancedAnalyticsPage'
import { UsersPage } from './pages/UsersPage'
import { ProductsPage } from './pages/ProductsPage'
import { ReportsPage } from './pages/ReportsPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { ContentPage } from './pages/ContentPage'
import { FilesPage } from './pages/FilesPage'
import { CustomFieldsPage } from './pages/CustomFieldsPage'
import { DataInsightsPage } from './pages/DataInsightsPage'
import { SettingsPage } from './pages/SettingsPage'
import { ProfilePage } from './pages/ProfilePage'
import { AccountPage } from './pages/AccountPage'

function App() {
  return (
    <ToastProvider>
      <BrowserRouter basename="/react-admin-dashboard">
        <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/advanced-analytics" element={<AdvancedAnalyticsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/content" element={<ContentPage />} />
          <Route path="/files" element={<FilesPage />} />
          <Route path="/custom-fields" element={<CustomFieldsPage />} />
          <Route path="/data-insights" element={<DataInsightsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </ToastProvider>
  )
}

export default App
