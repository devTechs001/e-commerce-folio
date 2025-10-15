import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SideNavbar from './SideNavbar'
import TopNavbar from './TopNavbar'
import { useAuth } from '../../context/AuthContext'
import Onboarding from '../onboarding/Onboarding'
import FloatingAI from '../common/FloatingAI'
import AIAssistantChat from '../common/AIAssistant/AIAssistantChat'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const { user } = useAuth()
  const location = useLocation()

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingCompleted = localStorage.getItem('onboarding_completed')
    if (!onboardingCompleted && user) {
      setShowOnboarding(true)
    }
  }, [user])

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    localStorage.setItem('onboarding_completed', 'true')
  }

  // Show onboarding if needed
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Hidden on mobile by default */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block fixed md:relative inset-y-0 left-0 z-50 w-64 transition-transform duration-300`}>
        <SideNavbar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <TopNavbar 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="capitalize">{location.pathname.split('/').filter(Boolean).join(' / ')}</span>
            </div>
            
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating AI Assistant */}
      <FloatingAI />
      
      {/* AI Assistant Chat */}
      <AIAssistantChat />
    </div>
  )
}

export default DashboardLayout