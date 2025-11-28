// app/settings/page.tsx
"use client"

import React, { useState } from 'react'
import { Separator } from '@/components/ui/separator'

// Import komponen pecahan
import { SettingsSidebar } from './components/SettingsSidebar'
import { ProfileContent } from './components/ProfileContent'


const SettingPages = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="w-full max-w-5xl p-6">
      
      {/* Header Halaman */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-2">Kelolah pengaturan akun anda.</p>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* 1. Sidebar Navigasi */}
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 2. Content Area (Switch Case Logic) */}
        <main className="flex-1 max-w-2xl">
          {activeTab === "profile" && <ProfileContent />}

          {/* Fallback untuk tab Account yang belum ada isinya */}
          {activeTab === "account" && (
             <div className="flex items-center justify-center h-40 text-slate-400">
                Account Settings Coming Soon
             </div>
          )}
        </main>
        
      </div>
    </div>
  )
}

export default SettingPages