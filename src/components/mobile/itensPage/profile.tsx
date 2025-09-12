'use client'

import React, { useEffect } from 'react'
import { User, Settings, LogOut } from 'lucide-react'
import { RippleButton } from '@/components/ui/RippleButton'
import { useNavigationStore } from '@/stores/navigationStore'

export default function ProfilePage() {
  const { setPageLoading } = useNavigationStore()
  
  // When the component is mounted, set loading to false
  useEffect(() => {
    // Simulate component loading time
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 600) // 600ms delay to simulate loading
    
    return () => clearTimeout(timer)
  }, [setPageLoading])
  
  return (
    <div className="min-h-screen  text-white flex flex-col">
      <main className="flex-1 overflow-auto pb-16">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          
          {/* User Information */}
          <div className="bg-[#1a1a2e] rounded-lg p-4 border border-gray-800 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mr-4">
                <User className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">User</h2>
                <p className="text-gray-400 text-sm">user@example.com</p>
              </div>
            </div>
            <RippleButton
              onClick={() => {}}
              className="w-full mt-2 bg-purple-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Edit Profile
            </RippleButton>
          </div>
          
          {/* Settings */}
          <div className="bg-[#1a1a2e] rounded-lg p-4 border border-gray-800 mb-6">
            <h2 className="font-semibold text-lg mb-3">Settings</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 hover:bg-[#232342] rounded-lg transition-colors">
                <span>Notifications</span>
                <div className="w-10 h-5 bg-purple-600 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-[#232342] rounded-lg transition-colors">
                <span>Dark Theme</span>
                <div className="w-10 h-5 bg-purple-600 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-[#232342] rounded-lg transition-colors">
                <span>Two-Factor Authentication</span>
                <div className="w-10 h-5 bg-gray-600 rounded-full relative">
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          <RippleButton
            onClick={() => {}}
            className="w-full bg-red-600/20 text-red-400 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </RippleButton>
        </div>
      </main>
    </div>
  )
}