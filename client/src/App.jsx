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
import EnhancedMarketplace from './pages/TemplateMarketplace/EnhancedMarketplace'
import PortfolioView from './pages/PortfolioView/PortfolioView'
import Settings from './components/dashboard/Settings'
import Billing from './components/dashboard/billing/Billing'

// Analytics Components
import PerformanceChart from './components/dashboard/analytics/PerformanceChart'
import SEOAnalyzer from './components/dashboard/analytics/SEOAnalyzer'
import TrafficSources from './components/dashboard/analytics/TrafficSources'
import VisitorMap from './components/dashboard/analytics/VisitorMap'

// AI Components
import AIInsights from './components/dashboard/ai/AIInsights'
import ContentGenerator from './components/dashboard/ai/ContentGenerator'
import DesignOptimizer from './components/dashboard/ai/DesignOptimizer'
import SEOSuggestions from './components/dashboard/ai/SEOSuggestions'

// Collaboration Components
import CollaborationDashboard from './components/dashboard/collaboration/CollaborationDashboard'
import RealTimeEditor from './components/dashboard/collaboration/RealTimeEditor'
import RealTimeChat from './components/dashboard/collaboration/RealTimeChat'
import ShareModal from './components/dashboard/collaboration/ShareModal'
import TeamManagement from './components/dashboard/collaboration/TeamManagement'
import VersionHistory from './components/dashboard/collaboration/VersionHistory'

// Workspace Components
import CodeEditor from './components/dashboard/workspace/CodeEditor'
import FileExplorer from './components/dashboard/workspace/FileExplorer'
import ProjectManager from './components/dashboard/workspace/ProjectManager'

// Profile Component
import Profile from './components/dashboard/Profile'

// Standalone Pages
import AnalyticsPage from './pages/Analytics/AnalyticsPage'
import RevenueDashboard from './pages/Revenue/RevenueDashboard'
import AIPortfolioGenerator from './pages/AIGenerator/AIPortfolioGenerator'
import CheckoutPage from './pages/Checkout/CheckoutPage'
import FreelancingHub from './pages/Freelancing/FreelancingHub'
import PrivateMessages from './pages/Messages/PrivateMessages'
import ComprehensiveProfile from './pages/Profile/ComprehensiveProfile'
import TemplateBuilder from './pages/CreateTemplate/TemplateBuilder'
import HelpPage from './pages/Help/HelpPage'
import IntegrationsPage from './pages/Integrations/IntegrationsPage'
import EmailMarketing from './components/dashboard/marketing/EmailMarketing'
import SocialMediaIntegration from './components/dashboard/profile/SocialMediaIntegration'
import TierBasedPortfolioEditor from './components/portfolio/TierBasedPortfolioEditor'
import TemplateGallery from './pages/CreateTemplate/TemplateGallery'
import TemplatePreview from './pages/CreateTemplate/TemplatePreview'
import TemplateCustomizer from './pages/CreateTemplate/TemplateCustomizer'

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
          
          {/* Profile */}
          <Route path="profile" element={<Profile />} />
          <Route path="profile-full" element={<ComprehensiveProfile />} />
          
          {/* Standalone Pages */}
          <Route path="analytics-full" element={<AnalyticsPage />} />
          <Route path="revenue" element={<RevenueDashboard />} />
          <Route path="ai-generator" element={<AIPortfolioGenerator />} />
          <Route path="freelancing" element={<FreelancingHub />} />
          <Route path="messages" element={<PrivateMessages />} />
          <Route path="messages/:userId" element={<PrivateMessages />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="marketing" element={<EmailMarketing />} />
          <Route path="social-media" element={<SocialMediaIntegration />} />
          <Route path="portfolio-editor" element={<TierBasedPortfolioEditor />} />
          <Route path="portfolio-editor/:portfolioId" element={<TierBasedPortfolioEditor />} />
          
          {/* Template System */}
          <Route path="templates" element={<TemplateGallery />} />
          <Route path="templates/create" element={<TemplateBuilder />} />
          <Route path="templates/preview/:templateId" element={<TemplatePreview />} />
          <Route path="templates/edit/:templateId" element={<TemplateCustomizer />} />
          
          {/* Analytics Routes */}
          <Route path="analytics" element={<PerformanceChart />} />
          <Route path="analytics/seo" element={<SEOAnalyzer />} />
          <Route path="analytics/traffic" element={<TrafficSources />} />
          <Route path="analytics/visitors" element={<VisitorMap />} />
          
          {/* AI Routes */}
          <Route path="ai" element={<AIInsights />} />
          <Route path="ai/content" element={<ContentGenerator />} />
          <Route path="ai/design" element={<DesignOptimizer />} />
          <Route path="ai/seo" element={<SEOSuggestions />} />
          
          {/* Collaboration Routes */}
          <Route path="collaboration" element={<CollaborationDashboard />} />
          <Route path="team" element={<TeamManagement />} />
          <Route path="team/chat" element={<RealTimeChat />} />
          <Route path="team/editor/:portfolioId" element={<RealTimeEditor />} />
          <Route path="team/history/:portfolioId" element={<VersionHistory />} />
          
          {/* Workspace Routes */}
          <Route path="workspace" element={<ProjectManager />} />
          <Route path="workspace/editor" element={<CodeEditor />} />
          <Route path="workspace/files" element={<FileExplorer />} />
          
          {/* Other Routes */}
          <Route path="templates" element={<EnhancedMarketplace />} />
          <Route path="marketplace" element={<EnhancedMarketplace />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
          
          {/* Admin Routes */}
          <Route path="admin" element={<RoleRoute roles={["admin"]}><Dashboard /></RoleRoute>} />
          <Route path="admin/users" element={<RoleRoute roles={["admin"]}><TeamManagement /></RoleRoute>} />
          <Route path="admin/portfolios" element={<RoleRoute roles={["admin"]}><ProjectManager /></RoleRoute>} />
          <Route path="admin/templates" element={<RoleRoute roles={["admin"]}><TemplateMarketplace /></RoleRoute>} />
          
          {/* Owner Routes */}
          <Route path="owner" element={<RoleRoute roles={["owner"]}><Dashboard /></RoleRoute>} />
        </Route>

        {/* Checkout Route */}
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Public Analytics Routes */}
        <Route path="/revenue" element={<RevenueDashboard />} />

        {/* Help & Support Routes */}
        <Route path="/help" element={<HelpPage />} />

        {/* Portfolio View Route (Public) */}
        <Route path="/portfolio/:username" element={<PortfolioView />} />
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