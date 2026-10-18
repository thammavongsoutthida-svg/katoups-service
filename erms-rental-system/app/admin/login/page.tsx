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

    // 🔑 ກວດສອບ Passcode (ສາມາດຕັ້ງລະຫັດຜ່ານຢູ່ບ່ອນນີ້)
    if (password === 'katoups2026' || password === '123456' || password === 'admin') {
      
      // 1. ເພີ່ມ Cookie ສຳລັບ Middleware
      document.cookie = "katoups_admin_session=authenticated; path=/; max-age=" + (7 * 24 * 60 * 60);

      // 2. ເພີ່ມ localStorage Token
      localStorage.setItem('katoups_admin_token', 'true');

      // 3. ເຂົ້າໄປໜ້າ Admin
      router.push('/admin');
      router.refresh();
    } else {
      setErrorMsg('ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ! ກະລຸນາລອງໃໝ່');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3F0] flex items-center justify-center p-4 font-['Noto_Sans_Lao',sans-serif]">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#E8D0C8] shadow-xl text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#A36B5E] bg-[#F8ECE9] flex items-center justify-center shadow-sm">
          <img src="/logo.png" alt="Katoups Service" className="w-full h-full object-cover scale-110" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-[#8C5345] tracking-wide">KATOUPS ADMIN LOGIN</h1>
          <p className="text-xs text-gray-400 font-bold mt-1">ລະບົບຫຼັງບ້ານສຳລັບຜູ້ດູແລ ກະຕູບສ໌ ບໍລິການ</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold py-2 rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left">
            <label className="text-xs font-bold text-gray-600 block mb-1">Passcode ເຂົ້າສູ່ລະບົບ Admin</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8C5345]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#A36B5E] to-[#8C5345] text-white font-bold py-3.5 rounded-xl shadow-md hover:opacity-95 transition text-sm flex items-center justify-center gap-2"
          >
            🔒 ເຂົ້າສູ່ລະບົບ Admin
          </button>
        </form>

        <a href="/" className="block text-xs font-bold text-[#8C5345] hover:underline">
          ← ກັບໄປໜ້າລູກຄ້າ
        </a>
      </div>
    </div>
  );
}