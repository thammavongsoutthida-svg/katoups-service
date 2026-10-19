'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'stock' | 'dashboard'>('dashboard');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ☁️ ດຶງຂໍ້ມູນອໍເດີ້ທັງໝົດຈາກ Supabase (ເຄຼຍແຄສຂໍ້ມູນໃໝ່)
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        const formatted = data.map((o) => ({
          id: o.id,
          orderNo: o.order_no,
          customerName: o.customer_name,
          phone: o.phone,
          eventDate: o.event_date,
          totalAmount: Number(o.total_amount) || 0,
          deposit: Number(o.deposit) || 0,
          balance: Number(o.balance) || 0,
          status: o.status || 'PENDING',
          createdAt: o.created_at,
        }));
        setOrders(formatted);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const isAuth = localStorage.getItem('katoups_admin_token');
    if (!isAuth) {
      router.push('/admin/login');
      return;
    }
    fetchOrders();
  }, [router]);

  // 🗑️ ຟັງຊັນລົບອໍເດີ້ອອກຈາກ Database 100%
  const deleteOrder = async (orderId: string) => {
    if (confirm('ທ່ານຕ້ອງການລົບບິນນີ້ແທ້ບໍ? ຂໍ້ມູນຈະຖືກລົບອອກຈາກ Database ເດັດຂາດ.')) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      await supabase.from('orders').delete().eq('id', orderId);
      await fetchOrders(); // 🔥 ລ້າງແຄສ ເຄຼຍຍອດເງິນໃໝ່
    }
  };

  // 🔄 ຟັງຊັນອັບເດດສະຖານະ (ຖ້າເລືອກ "ຍົກເລີກ" ໃຫ້ລົບອອກຈາກ Database ເລີຍ)
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (newStatus === 'CANCELLED') {
      if (confirm('⚠️ ທ່ານເລືອກຍົກເລີກອໍເດີ! ລະບົບຈະລົບອໍເດີນີ້ອອກຈາກ Database ເພື່ອບໍ່ໃຫ້ຕົກຄ້າງ. ຢືນຢັນບໍ?')) {
        await deleteOrder(orderId);
        return;
      } else {
        return;
      }
    }

    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    await fetchOrders();
  };

  // 💰 ຄິດໄລ່ຍອດເງິນ ແລະ ສະຖິຕິສະເພາະອໍເດີ້ທີ່ຢູ່ Database ແທ້ (ບໍ່ມີຍົກເລີກ/ຕົກຄ້າງ)
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const totalDeposit = orders.reduce((sum, o) => sum + (Number(o.deposit) || 0), 0);

  const completedCount = orders.filter((o) => o.status === 'COMPLETED' || o.status === 'CONFIRMED').length;
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;

  const dynamicOrderStatusData = [
    { name: 'ສຳເລັດ/ມັດຈຳແລ້ວ', value: completedCount, color: '#10B981' },
    { name: 'ກຳລັງດຳເນີນການ', value: pendingCount, color: '#F59E0B' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('katoups_admin_token');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#FAF3F0] flex font-['Noto_Sans_Lao',sans-serif]">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-[#E8D0C8] p-6 flex flex-col justify-between shadow-sm">
        <div className="space-y-6">
          <div>
            <h1 className="font-extrabold text-[#C6936A] text-xl tracking-wider">KATOUPS</h1>
            <p className="text-[11px] text-[#A36B5E] font-bold uppercase tracking-widest mt-0.5">ADMIN PANEL</p>
          </div>

          <nav className="space-y-2">
            <button onClick={() => setActiveTab('orders')} className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs transition flex items-center gap-2 ${activeTab === 'orders' ? 'bg-gradient-to-r from-[#C6936A] to-[#A36B5E] text-white shadow-md' : 'text-gray-600 hover:bg-[#FAF3F0]'}`}>
              <span>📋</span><span>ຈັດການອໍເດີ (Full CRUD)</span>
            </button>
            <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs transition flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-[#C6936A] to-[#A36B5E] text-white shadow-md' : 'text-gray-600 hover:bg-[#FAF3F0]'}`}>
              <span>📈</span><span>ແຜງຄວບຄຸມ (Dashboard)</span>
            </button>
          </nav>
        </div>

        <div className="space-y-3">
          <a href="/" className="block text-center border border-[#C6936A] text-[#C6936A] text-xs font-bold py-2.5 rounded-full hover:bg-[#FAF3F0] transition">
            🌐 ເບິ່ງໜ້າລູກຄ້າ
          </a>
          <button onClick={handleLogout} className="w-full text-center bg-red-50 text-red-600 text-xs font-bold py-2.5 rounded-full hover:bg-red-100 transition">
            🚪 ອອກຈາກລະບົບ 
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#3D2B27]">
              {activeTab === 'orders' && '📋 ຈັດການອໍເດີ້ລູກຄ້າ'}
              {activeTab === 'dashboard' && '📈 ພາບລວມລະບົບ (Overview)'}
            </h1>
            <p className="text-xs text-gray-400 font-bold mt-1">Katoups Service Realtime Database Active</p>
          </div>
          <button onClick={fetchOrders} className="bg-white border border-[#E8D0C8] px-4 py-2 rounded-full text-xs font-bold text-[#8C5345] shadow-sm hover:bg-[#FAF3F0]">
            🔄 ດຶງຂໍ້ມູນໃໝ່ (Refresh Cache)
          </button>
        </div>

        {/* 📋 ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-[#E8D0C8] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#E8D0C8] flex justify-between items-center">
              <h3 className="font-bold text-[#3D2B27]">ລາຍການອໍເດີ້ທັງໝົດ</h3>
              <span className="text-xs text-gray-400 font-bold">ທັງໝົດ {orders.length} ອໍເດີ</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF3F0] text-[#8C5345] font-bold text-xs uppercase border-b border-[#E8D0C8]">
                  <tr>
                    <th className="p-4">ເລກອໍເດີ</th>
                    <th className="p-4">ລູກຄ້າ / ເບີໂທ</th>
                    <th className="p-4">ວັນທີຈັດງານ</th>
                    <th className="p-4">ຍອດລວມ</th>
                    <th className="p-4">ມັດຈຳ (30%)</th>
                    <th className="p-4">ສະຖານະ</th>
                    <th className="p-4 text-center">ຈັດການ (DELETE)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8D0C8]">
                  {loading ? (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-400 font-medium">ກຳລັງດຶງຂໍ້ມູນ...</td></tr>
                  ) : orders.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-400 font-medium">ຍັງບໍ່ທັນມີຂໍ້ມູນອໍເດີ້</td></tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#FAF3F0]/50 transition">
                        <td className="p-4 font-extrabold text-[#8C5345]">{o.orderNo}</td>
                        <td className="p-4"><div className="font-bold text-[#3D2B27]">{o.customerName}</div><div className="text-xs text-gray-400">{o.phone}</div></td>
                        <td className="p-4 font-medium">{o.eventDate}</td>
                        <td className="p-4 font-bold">{Number(o.totalAmount).toLocaleString()} LAK</td>
                        <td className="p-4 font-bold text-[#8C5345]">{Number(o.deposit).toLocaleString()} LAK</td>
                        <td className="p-4">
                          <select value={o.status || 'PENDING'} onChange={(e) => updateOrderStatus(o.id, e.target.value)} className="bg-[#FAF3F0] border border-[#E8D0C8] text-xs font-bold rounded-xl px-2 py-1.5 focus:outline-none">
                            <option value="PENDING">⏳ ຖໍາມັດຈໍາ</option>
                            <option value="CONFIRMED">✅ ມັດຈໍາແລ້ວ</option>
                            <option value="COMPLETED">🎉 ສຳເລັດງານ</option>
                            <option value="CANCELLED">❌ ຍົກເລີກ (ລົບອອກ DB)</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <button onClick={() => deleteOrder(o.id)} className="bg-red-50 text-red-600 px-3 py-1 rounded-xl text-xs font-bold hover:bg-red-100 transition">🗑️ ລົບ</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 📈 DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-[#E8D0C8] shadow-sm">
                <div className="text-2xl mb-2">💰</div>
                <p className="text-xs font-bold text-gray-400">ລາຍຮັບລວມ (ສຳເລັດ/ມັດຈຳ)</p>
                <h2 className="text-2xl font-black text-[#A36B5E] mt-1">{totalRevenue.toLocaleString()} LAK</h2>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-[#E8D0C8] shadow-sm">
                <div className="text-2xl mb-2">💵</div>
                <p className="text-xs font-bold text-gray-400">ຍອດມັດຈຳ (30%)</p>
                <h2 className="text-2xl font-black text-[#C6936A] mt-1">{totalDeposit.toLocaleString()} LAK</h2>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-[#E8D0C8] shadow-sm">
                <div className="text-2xl mb-2">✅</div>
                <p className="text-xs font-bold text-gray-400">ອໍເດີ້ທີ່ຢູ່ໃນ Database</p>
                <h2 className="text-2xl font-black text-[#A36B5E] mt-1">{orders.length} Orders</h2>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8D0C8] max-w-md">
              <h3 className="text-lg font-bold text-[#A36B5E] mb-1">📊 ສະຖິຕິອໍເດີແທ້</h3>
              <p className="text-xs text-gray-400 mb-4">ສະແດງສະເພາະອໍເດີ້ທີ່ສົມບູນໃນ Database</p>

              <div className="h-[200px] w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dynamicOrderStatusData} innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                      {dynamicOrderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value} ອໍເດີ`, '']} contentStyle={{ backgroundColor: '#FFF', borderRadius: '8px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}