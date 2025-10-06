import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layout Components
import MainLayout from './components/layout/MainLayout'
import DashboardLayout from './components/dashboard/DashboardLayout'

// Page Components
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Pricing from './pages/Pricing/Pricing'
import Contact from './pages/Contact/Contact'
import Login from './components/auth/Login/Login'
import Register from './components/auth/Register/Register'
import Dashboard from './components/dashboard/Dashboard'
//import PortfolioBuilder from './pages/PortfolioBuilder/PortfolioBuilder'
import TemplateMarketplace from './pages/TemplateMarketplace/TemplateMarketplace'
import PortfolioView from './pages/PortfolioView/PortfolioView'
import PerformanceChart from './components/dashboard/analytics/PerformanceChart'
import Settings from './components/dashboard/Settings'

// Context
import { useAuth } from './context/AuthContext.jsx'
import { ProtectedRoute, GuestRoute, RoleRoute } from './routes/guards.jsx'
import { NotificationProvider } from './context/NotificationContext'
import { PortfolioProvider } from './context/PortfolioContext.jsx'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="App">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg border border-gray-200 dark:border-gray-700',
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="contact" element={<Contact />} />
          <Route path="templates" element={<TemplateMarketplace />} />
          <Route path="login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="register" element={<GuestRoute><Register /></GuestRoute>} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<PerformanceChart />} />
          <Route path="settings" element={<Settings />} />
          <Route path="templates" element={<TemplateMarketplace />} />
          <Route path="admin" element={<RoleRoute roles={["admin"]}><Dashboard /></RoleRoute>} />
          <Route path="owner" element={<RoleRoute roles={["owner"]}><Dashboard /></RoleRoute>} />
        </Route>

        {/* Portfolio View Route (Public) */}
        <Route path="/portfolio/:username" element={<PortfolioView />} />
        
        {/* 404 Route */}
        <Route path="*" element={
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Page not found</p>
              <a 
                href="/" 
                className="bg-gradient-to-r from-primary-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-primary-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Go Home
              </a>
            </div>
          </div>
        }/>
      </Routes>
    </div>
  )
}

function App() {
  return (
    <NotificationProvider>
      <PortfolioProvider>
        <AppContent />
      </PortfolioProvider>
    </NotificationProvider>
  )
}

export default App