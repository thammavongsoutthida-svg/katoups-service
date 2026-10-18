'use client'
import { useState } from 'react'
import { Menu, X } from 'lucide-react' // ຫຼື ໃຊ້ Icon ຕາມ Project

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* 1. Header Navbar ສຳລັບ Mobile */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="font-bold text-lg text-[#8B4513]">KATOUPS ADMIN</div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 2. Sidebar Component */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* ເນື້ອຫາ Sidebar / ເມນູ ເກົ່າຂອງທ່ານ */}
      </aside>

      {/* Overlay ສຳລັບປິດເມນູຕອນຄລິກດ້ານນອກ (Mobile Only) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 3. Main Content (ໃຫ້ຂະຫຍາຍເຕັມ flex-1) */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        {children}
      </main>

    </div>
  )
}