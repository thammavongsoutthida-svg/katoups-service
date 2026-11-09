'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // 🔑 ກວດສອບ Passcode (ອັບເດດ passcode ສຳລັບ MONGKHON)
    if (password === 'mongkhon2026' || password === 'katoups2026' || password === '123456' || password === 'admin') {
      
      // 1. ເພີ່ມ Cookie ສຳລັບ Middleware (ອັບເດດ session key)
      document.cookie = "mongkhon_admin_session=authenticated; path=/; max-age=" + (7 * 24 * 60 * 60);

      // 2. ເພີ່ມ localStorage Token (ອັບເດດ token key)
      localStorage.setItem('mongkhon_admin_token', 'true');

      // 3. ເຂົ້າໄປໜ້າ Admin
      router.push('/admin');
      router.refresh();
    } else {
      setErrorMsg('ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ! ກະລຸນາລອງໃໝ່');
    }
  };

  return (
    <div className="min-h-screen bg-[#F1EBDD] flex items-center justify-center p-4 font-['Noto_Sans_Lao',sans-serif] text-[#292A25]">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#B49A70]/30 shadow-xl text-center space-y-6">
        
        {/* 🖼️ ໂລໂກ້ MONGKHON */}
        <div className="w-36 h-24 mx-auto flex items-center justify-center p-1">
          <img src="/logo.png" alt="MONGKHON COMPANY CO., LTD" className="w-full h-full object-contain" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-[#292A25] tracking-wide">MONGKHON ADMIN LOGIN</h1>
          <p className="text-xs text-[#B49A70] font-bold mt-1">ລະບົບຫຼັງບ້ານສຳລັບຜູ້ດູແລ ບໍລິສັດ ມຸງຄົນ ຈຳກັດ</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold py-2.5 rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left">
            <label className="text-xs font-bold text-[#292A25] block mb-1">Passcode ເຂົ້າສູ່ລະບົບ Admin</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B49A70]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#B49A70] hover:bg-[#292A25] text-white font-bold py-3.5 rounded-xl shadow-md transition text-sm flex items-center justify-center gap-2"
          >
            🔒 ເຂົ້າສູ່ລະບົບ Admin
          </button>
        </form>

        <a href="/" className="block text-xs font-bold text-[#687568] hover:text-[#292A25] hover:underline transition">
          ← ກັບໄປໜ້າລູກຄ້າ
        </a>
      </div>
    </div>
  );
}