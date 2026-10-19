'use client'
import './globals.css' // 👈 ເພີ່ມແຖບນີ້ເຂົ້າໄປເທິງສຸດ
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* ໂຄ້ດສ່ວນທີ່ເຫຼືອຄືເກົ່າ */}
      {children}
    </div>
  )
}