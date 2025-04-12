import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthState } from './hooks/useAuthState'

// Layout components
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Dashboard pages
import Dashboard from './pages/dashboard/Dashboard'
import Trading from './pages/dashboard/Trading'
import Portfolio from './pages/dashboard/Portfolio'
import Wallet from './pages/dashboard/Wallet'
import Reports from './pages/dashboard/Reports'
import AdminPanel from './pages/dashboard/AdminPanel'

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthState()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Admin Route wrapper
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuthState()

  if (loading) return null

  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected dashboard routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trading" element={<Trading />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/reports" element={<Reports />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App