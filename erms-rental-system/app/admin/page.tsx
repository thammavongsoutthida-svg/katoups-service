'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const monthlyRevenueData = [
  { month: 'ມ.ກ', revenue: 4500000, deposit: 1350000 },
  { month: 'ກ.ພ', revenue: 6200000, deposit: 1860000 },
  { month: 'ມີ.ນາ', revenue: 8100000, deposit: 2430000 },
  { month: 'ເມ.ສາ', revenue: 12500000, deposit: 3750000 },
  { month: 'ພ.ພ', revenue: 9400000, deposit: 2820000 },
  { month: 'ມິ.ຖ', revenue: 11000000, deposit: 3300000 },
];

const orderStatusData = [
  { name: 'ສຳເລັດແລ້ວ', value: 0, color: '#10B981' },
  { name: 'ກຳລັງດຳເນີນການ', value: 0, color: '#F59E0B' },
  { name: 'ຍົກເລີກ', value: 0, color: '#EF4444' },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'stock' | 'payroll' | 'finance' | 'balanceSheet' | 'cashScan' | 'dashboard'>('dashboard');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 1️⃣ ================= 📋 ORDERS STATE & CRUD =================
  const [orderCustomer, setOrderCustomer] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [orderTotal, setOrderTotal] = useState('');
  const [orderDeposit, setOrderDeposit] = useState('');
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  // 2️⃣ ================= 🎪 STOCK STATE & CRUD =================
  const [stockItems, setStockItems] = useState<any[]>([
    { id: 'eq-1', name: 'ເຕັ້ນ Marquee 10x12', total: 6, rented: 0, price: 8000000 },
    { id: 'eq-2', name: 'ເຕັ້ນ Marquee 6x8', total: 6, rented: 0, price: 1500000 },
    { id: 'eq-3', name: 'ເຕັ້ນ Marquee 5x8', total: 2, rented: 0, price: 1000000 },
    { id: 'eq-4', name: 'ເຕັ້ນ Marquee 4x6', total: 6, rented: 0, price: 500000 },
    { id: 'eq-5', name: 'ເຕັ້ນ Marquee 4x4', total: 4, rented: 0, price: 400000 },
    { id: 'eq-6', name: 'ເຕັ້ນປະດັບ Decorative Marquee 10x12', total: 0, rented: 0, price: 4000000 },
    { id: 'eq-7', name: 'ເຕັ້ນປະດັບ Decorative Marquee 6x8', total: 0, rented: 0, price: 1000000 },
    { id: 'eq-8', name: 'ເຕັ້ນປະດັບ Decorative Marquee 5x8', total: 0, rented: 0, price: 1000000 },
    { id: 'eq-9', name: 'ເຕັ້ນປະດັບ Decorative Marquee 4x6', total: 0, rented: 0, price: 500000 },
    { id: 'eq-10', name: 'ເຕັ້ນປະດັບ Decorative Marquee 4x4', total: 0, rented: 0, price: 400000 },
    { id: 'eq-11', name: 'ຊຸດໂຕະຕັ່ງ Tiffany Classic (8 ທ່ານ)', total: 20, rented: 0, price: 150000 },
    { id: 'eq-12', name: 'ຊຸດໂຕະຕັ່ງ Tiffany Golden (8 ທ່ານ)', total: 50, rented: 0, price: 250000 },
    { id: 'eq-13', name: 'ຊຸດໂຕະຕັ່ງພລາສຕິກ (1) (8 ທ່ານ)', total: 50, rented: 0, price: 60000 },
    { id: 'eq-14', name: 'ຊຸດໂຕະຕັ່ງພລາສຕິກ + ຜ້າກວມ (2) (8 ທ່ານ)', total: 0, rented: 0, price: 250000 },
    { id: 'eq-15', name: 'ພັດລົມ (Fan)', total: 10, rented: 0, price: 100000 },
    { id: 'eq-16', name: 'ພັດລົມໄອເຢັນ (Evaporative Air Cooler)', total: 2, rented: 0, price: 1000000 },
    { id: 'eq-17', name: 'ຫຍ້າທຽມ (Artificial Grass)', total: 20, rented: 0, price: 200000 },
  ]);
  const [newEqName, setNewEqName] = useState('');
  const [newEqPrice, setNewEqPrice] = useState('');
  const [newEqTotal, setNewEqTotal] = useState('');
  const [editingEqId, setEditingEqId] = useState<string | null>(null);

  // 3️⃣ ================= 👥 STAFF & ATTENDANCE STATE =================
  const [staffList, setStaffList] = useState<any[]>([
    { id: 'st-1', name: 'ທ້າວ ສົມຊາຍ', role: 'ຫົວໜ້າທີມຕິດຕັ້ງເຕັ້ນ', phone: '020 55112233', baseSalary: 3500000, jobAllowance: 150000, jobsDone: 0, absentDeductionPerDay: 100000, attendance: {} },
    { id: 'st-2', name: 'ທ້າວ ຄຳຜາຍ', role: 'ຊ່າງໄຟຟ້າ & ເທັກນິກ', phone: '020 55445566', baseSalary: 3000000, jobAllowance: 150000, jobsDone: 0, absentDeductionPerDay: 100000, attendance: {} },
  ]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffSalary, setNewStaffSalary] = useState('');
  const [newStaffAllowance, setNewStaffAllowance] = useState('');
  const [newStaffJobs, setNewStaffJobs] = useState('');
  const [newStaffDeduction, setNewStaffDeduction] = useState('100000');
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [selectedStaffForAttendance, setSelectedStaffForAttendance] = useState<any | null>(null);

  // 4️⃣ ================= 📸 CASH SCAN STATE =================
  const [cashLogs, setCashLogs] = useState<any[]>([
    { id: 'cs-1', orderNo: 'QUO-62215', customer: 'ເຊີລີ້', amount: 1230450, date: '2026-10-18', proofUrl: '/logo.png' },
  ]);
  const [proofOrderNo, setProofOrderNo] = useState('');
  const [proofAmount, setProofAmount] = useState('');
  const [proofInput, setProofInput] = useState('');
  const [editingCashId, setEditingCashId] = useState<string | null>(null);

  // 5️⃣ ================= 🏛️ BALANCE SHEET OVERRIDE =================
  const [customAssets, setCustomAssets] = useState<number | null>(null);
  const [customEquity, setCustomEquity] = useState<number | null>(null);
  const [editBalanceMode, setEditBalanceMode] = useState(false);
  const [inputAssets, setInputAssets] = useState('');
  const [inputEquity, setInputEquity] = useState('');

  // 6️⃣ ================= 📊 FINANCE LEDGER =================
  const [financeTimeframe, setFinanceTimeframe] = useState<'daily' | 'monthly' | 'yearly'>('monthly');

  // ☁️ Fetch Orders from Supabase
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

  // 📋 ORDERS HANDLERS
  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCustomer || !orderPhone || !orderTotal) return alert('ກະລຸນາປ້ອນຂໍ້ມູນອໍເດີ້ໃຫ້ຄົບຖ້ວນ');

    const total = Number(orderTotal) || 0;
    const dep = Number(orderDeposit) || total * 0.3;
    const bal = total - dep;

    if (editingOrderId) {
      const updated = {
        customer_name: orderCustomer,
        phone: orderPhone,
        event_date: orderDate,
        total_amount: total,
        deposit: dep,
        balance: bal,
      };
      await supabase.from('orders').update(updated).eq('id', editingOrderId);
      setEditingOrderId(null);
      alert('✅ ແກ້ໄຂຂໍ້ມູນອໍເດີ້ສຳເລັດ!');
    } else {
      const newOrd = {
        id: Date.now().toString(),
        order_no: `QUO-${Date.now().toString().slice(-5)}`,
        customer_name: orderCustomer,
        phone: orderPhone,
        event_date: orderDate || new Date().toISOString().split('T')[0],
        total_amount: total,
        deposit: dep,
        balance: bal,
        status: 'PENDING',
      };
      await supabase.from('orders').insert([newOrd]);
      alert('✅ ເພີ່ມອໍເດີ້ໃໝ່ສຳເລັດ!');
    }

    setOrderCustomer(''); setOrderPhone(''); setOrderDate(''); setOrderTotal(''); setOrderDeposit('');
    fetchOrders();
  };

  const handleEditOrder = (o: any) => {
    setEditingOrderId(o.id);
    setOrderCustomer(o.customerName);
    setOrderPhone(o.phone);
    setOrderDate(o.eventDate);
    setOrderTotal(o.totalAmount.toString());
    setOrderDeposit(o.deposit.toString());
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
  };

  const deleteOrder = async (orderId: string) => {
    if (confirm('ທ່ານຕ້ອງການລົບບິນນີ້ແທ້ບໍ? ຂໍ້ມູນຈະຖືກລົບອອກຈາກ Supabase Database.')) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      await supabase.from('orders').delete().eq('id', orderId);
    }
  };

  // 🎪 STOCK HANDLERS
  const clearEqForm = () => {
    setEditingEqId(null); setNewEqName(''); setNewEqPrice(''); setNewEqTotal('');
  };

  const handleSaveEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEqName || !newEqPrice || !newEqTotal) return alert('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ');

    if (editingEqId) {
      setStockItems((prev) =>
        prev.map((item) =>
          item.id === editingEqId
            ? { ...item, name: newEqName, price: Number(newEqPrice), total: Number(newEqTotal) }
            : item
        )
      );
      alert('✅ ແກ້ໄຂອຸປະກອນສຳເລັດ!');
    } else {
      const newItem = {
        id: `eq-${Date.now()}`,
        name: newEqName,
        price: Number(newEqPrice),
        total: Number(newEqTotal),
        rented: 0,
      };
      setStockItems([...stockItems, newItem]);
      alert('✅ ເພີ່ມອຸປະກອນໃໝ່ສຳເລັດ!');
    }
    clearEqForm();
  };

  const handleEditEq = (item: any) => {
    setEditingEqId(item.id); setNewEqName(item.name); setNewEqPrice(item.price.toString()); setNewEqTotal(item.total.toString());
  };

  const handleDeleteEq = (id: string) => {
    if (confirm('ທ່ານແນ່ໃຈບໍທີ່ຈະລົບອຸປະກອນນີ້ອອກຈາກສະຕັອກ?')) {
      setStockItems(stockItems.filter((i) => i.id !== id));
      if (editingEqId === id) clearEqForm();
    }
  };

  // 👥 STAFF & ATTENDANCE HANDLERS
  const clearStaffForm = () => {
    setEditingStaffId(null); setNewStaffName(''); setNewStaffRole(''); setNewStaffPhone(''); setNewStaffSalary(''); setNewStaffAllowance(''); setNewStaffJobs(''); setNewStaffDeduction('100000');
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffRole || !newStaffSalary) return alert('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ');

    if (editingStaffId) {
      setStaffList((prev) =>
        prev.map((s) =>
          s.id === editingStaffId
            ? {
                ...s,
                name: newStaffName,
                role: newStaffRole,
                phone: newStaffPhone,
                baseSalary: Number(newStaffSalary),
                jobAllowance: Number(newStaffAllowance) || 0,
                jobsDone: Number(newStaffJobs) || 0,
                absentDeductionPerDay: Number(newStaffDeduction) || 100000,
              }
            : s
        )
      );
      alert('✅ ແກ້ໄຂຂໍ້ມູນພະນັກງານສຳເລັດ!');
    } else {
      const newStaff = {
        id: `st-${Date.now()}`,
        name: newStaffName,
        role: newStaffRole,
        phone: newStaffPhone || '020 xxxx xxxx',
        baseSalary: Number(newStaffSalary),
        jobAllowance: Number(newStaffAllowance) || 0,
        jobsDone: Number(newStaffJobs) || 0,
        absentDeductionPerDay: Number(newStaffDeduction) || 100000,
        attendance: {},
      };
      setStaffList([...staffList, newStaff]);
      alert('✅ ເພີ່ມພະນັກງານໃໝ່ສຳເລັດ!');
    }
    clearStaffForm();
  };

  const handleEditStaff = (staff: any) => {
    setEditingStaffId(staff.id);
    setNewStaffName(staff.name);
    setNewStaffRole(staff.role);
    setNewStaffPhone(staff.phone);
    setNewStaffSalary(staff.baseSalary.toString());
    setNewStaffAllowance(staff.jobAllowance.toString());
    setNewStaffJobs(staff.jobsDone.toString());
    setNewStaffDeduction(staff.absentDeductionPerDay.toString());
  };

  const handleDeleteStaff = (id: string) => {
    if (confirm('ທ່ານແນ່ໃຈບໍທີ່ຈະລົບພະນັກງານທ່ານນີ້?')) {
      setStaffList(staffList.filter((s) => s.id !== id));
      if (editingStaffId === id) clearStaffForm();
    }
  };

  const toggleAttendance = (staffId: string, day: number, status: 'present' | 'absent' | 'leave') => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          const currentStatus = s.attendance?.[day];
          const newAtt = { ...s.attendance };
          if (currentStatus === status) {
            delete newAtt[day];
          } else {
            newAtt[day] = status;
          }
          const updatedStaff = { ...s, attendance: newAtt };
          if (selectedStaffForAttendance?.id === staffId) {
            setSelectedStaffForAttendance(updatedStaff);
          }
          return updatedStaff;
        }
        return s;
      })
    );
  };

  // 🏛️ BALANCE SHEET EDIT HANDLERS
  const handleSaveBalanceSheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputAssets !== '') setCustomAssets(Number(inputAssets));
    if (inputEquity !== '') setCustomEquity(Number(inputEquity));
    setEditBalanceMode(false);
    alert('✅ ອັບເດດຊັບສິນລວມ ແລະ ທຶນສຸດທິສຳເລັດ!');
  };

  const handleResetBalanceSheet = () => {
    setCustomAssets(null);
    setCustomEquity(null);
    setEditBalanceMode(false);
    alert('🔄 ປ່ຽນກັບມາໃຊ້ຄ່າຄິດໄລ່ອັດໂຕໂນມັດແລ້ວ!');
  };

  // 📊 CALCULATIONS
  const filteredOrders = orders.filter((o) => {
    if (!o.createdAt) return true;
    const orderDate = new Date(o.createdAt);
    const now = new Date();
    if (financeTimeframe === 'daily') return orderDate.toDateString() === now.toDateString();
    if (financeTimeframe === 'monthly') return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    if (financeTimeframe === 'yearly') return orderDate.getFullYear() === now.getFullYear();
    return true;
  });

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const totalDeposit = filteredOrders.reduce((sum, o) => sum + (Number(o.deposit) || 0), 0);
  const totalBalanceDue = filteredOrders.reduce((sum, o) => sum + (Number(o.balance) || 0), 0);

  const totalStaffPayroll = staffList.reduce((sum, s) => {
    const absentDays = Object.values(s.attendance || {}).filter((status) => status === 'absent').length;
    const deduction = absentDays * (s.absentDeductionPerDay || 100000);
    const net = s.baseSalary + s.jobAllowance * s.jobsDone - deduction;
    return sum + (net > 0 ? net : 0);
  }, 0);

  const stockAssetValue = stockItems.reduce((sum, item) => sum + item.total * item.price, 0);
  const calcAssets = totalDeposit + stockAssetValue + totalBalanceDue;
  const totalLiabilities = totalDeposit;
  const calcEquity = calcAssets - totalLiabilities;

  const displayAssets = customAssets !== null ? customAssets : calcAssets;
  const displayEquity = customEquity !== null ? customEquity : calcEquity;

  const handleLogout = () => {
    document.cookie = "katoups_admin_session=; path=/; max-age=0;";
    localStorage.removeItem('katoups_admin_token');
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FAF3F0] flex font-['Noto_Sans_Lao',sans-serif]">
      {/* 👑 Sidebar Navigation */}
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

            <button onClick={() => setActiveTab('stock')} className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs transition flex items-center gap-2 ${activeTab === 'stock' ? 'bg-gradient-to-r from-[#C6936A] to-[#A36B5E] text-white shadow-md' : 'text-gray-600 hover:bg-[#FAF3F0]'}`}>
              <span>🎪</span><span>ຄັງອຸປະກອນ (Full CRUD)</span>
            </button>

            <button onClick={() => setActiveTab('payroll')} className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs transition flex items-center gap-2 ${activeTab === 'payroll' ? 'bg-gradient-to-r from-[#C6936A] to-[#A36B5E] text-white shadow-md' : 'text-gray-600 hover:bg-[#FAF3F0]'}`}>
              <span>💳</span><span>ພະນັກງານ & ປະຕິທິນເຊັກຊື່</span>
            </button>

            <button onClick={() => setActiveTab('finance')} className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs transition flex items-center gap-2 ${activeTab === 'finance' ? 'bg-gradient-to-r from-[#C6936A] to-[#A36B5E] text-white shadow-md' : 'text-gray-600 hover:bg-[#FAF3F0]'}`}>
              <span>📊</span><span>ບັນຊີ ປະຈຳວັນ/ເດືອນ/ປີ</span>
            </button>

            <button onClick={() => setActiveTab('balanceSheet')} className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs transition flex items-center gap-2 ${activeTab === 'balanceSheet' ? 'bg-gradient-to-r from-[#C6936A] to-[#A36B5E] text-white shadow-md' : 'text-gray-600 hover:bg-[#FAF3F0]'}`}>
              <span>🏛️</span><span>ໃບຊັບສິນ & ໜີ້ສິນ (Editable)</span>
            </button>

            <button onClick={() => setActiveTab('cashScan')} className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs transition flex items-center gap-2 ${activeTab === 'cashScan' ? 'bg-gradient-to-r from-[#C6936A] to-[#A36B5E] text-white shadow-md' : 'text-gray-600 hover:bg-[#FAF3F0]'}`}>
              <span>📸</span><span>ໃບສະແກນເງິນສົດ</span>
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

      {/* 🔮 Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#3D2B27]">
              {activeTab === 'orders' && '📋 ຈັດການອໍເດີ້ລູກຄ້າ (Full CRUD)'}
              {activeTab === 'stock' && '🎪 ຈັດການຄັງອຸປະກອນເຊົ່າ (17 ລາຍການ)'}
              {activeTab === 'payroll' && '💳 ຈັດການພະນັກງານ, ເງິນເດືອນ & ຕາຕະລາງປະຕິທິນເຊັກຊື່'}
              {activeTab === 'finance' && '📊 ລາຍງານບັນຊີ ປະຈຳວັນ / ເດືອນ / ປີ'}
              {activeTab === 'balanceSheet' && '🏛️ ໃບສະຫຼຸບຊັບສິນ ແລະ ໜີ້ສິນ (Balance Sheet)'}
              {activeTab === 'cashScan' && '📸 ໃບສະແກນເງິນສົດ & ໃບບິນ'}
              {activeTab === 'dashboard' && '📈 ພາບລວມລະບົບ (Overview)'}
            </h1>
            <p className="text-xs text-gray-400 font-bold mt-1">Katoups Service Cloud Database Active</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchOrders} className="bg-white border border-[#E8D0C8] px-4 py-2 rounded-full text-xs font-bold text-[#8C5345] shadow-sm hover:bg-[#FAF3F0]">
              🔄 ດຶງຂໍ້ມູນໃໝ່ (Refresh)
            </button>
            <span className="bg-emerald-50 border border-emerald-200 px-5 py-2 rounded-full text-xs font-bold text-emerald-700 shadow-sm">
              🟢 Cloud Database Active
            </span>
          </div>
        </div>

        {/* 1️⃣ ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E8D0C8] shadow-sm">
              <h3 className="font-bold text-[#3D2B27] mb-4">
                {editingOrderId ? '✏️ ແກ້ໄຂຂໍ້ມູນອໍເດີ້' : '➕ ເພີ່ມອໍເດີ້ / ໃບສະເໜີລາຄາໃໝ່'}
              </h3>
              <form onSubmit={handleSaveOrder} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <input type="text" required placeholder="ຊື່ລູກຄ້າ *" value={orderCustomer} onChange={(e) => setOrderCustomer(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8C5345]" />
                <input type="text" required placeholder="ເບີໂທ WhatsApp *" value={orderPhone} onChange={(e) => setOrderPhone(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8C5345]" />
                <input type="text" placeholder="ວັນທີຈັດງານ (yyyy-mm-dd)" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8C5345]" />
                <input type="number" required placeholder="ຄ່າເຊົ່າລວມ (LAK) *" value={orderTotal} onChange={(e) => setOrderTotal(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8C5345]" />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-[#8C5345] text-white font-bold py-2 rounded-xl hover:opacity-90 transition text-sm">
                    {editingOrderId ? '💾 ບັນທຶກແກ້ໄຂ' : '➕ ເພີ່ມອໍເດີ້'}
                  </button>
                  {editingOrderId && (
                    <button type="button" onClick={() => setEditingOrderId(null)} className="bg-gray-200 px-3 py-2 rounded-xl text-xs font-bold">❌ ຍົກເລີກ</button>
                  )}
                </div>
              </form>
            </div>

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
                      <th className="p-4 text-center">ຈັດການ (EDIT / DELETE)</th>
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
                              <option value="CANCELLED">❌ ຍົກເລີກ</option>
                            </select>
                          </td>
                          <td className="p-4 text-center space-x-2">
                            <button onClick={() => handleEditOrder(o)} className="bg-amber-50 text-amber-700 px-3 py-1 rounded-xl text-xs font-bold hover:bg-amber-100 transition">✏️ ແກ້ໄຂ</button>
                            <button onClick={() => deleteOrder(o.id)} className="bg-red-50 text-red-600 px-3 py-1 rounded-xl text-xs font-bold hover:bg-red-100 transition">🗑️ ລົບ</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2️⃣ STOCK TAB */}
        {activeTab === 'stock' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E8D0C8] shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#3D2B27]">
                  {editingEqId ? '✏️ ແກ້ໄຂຂໍ້ມູນອຸປະກອນ' : '➕ ເພີ່ມອຸປະກອນໃໝ່ເຂົ້າຄັງສະຕັອກ'}
                </h3>
                {editingEqId && (
                  <button onClick={clearEqForm} className="bg-emerald-600 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow hover:bg-emerald-700 transition">
                    ➕ ປ່ຽນເປັນເພີ່ມອຸປະກອນໃໝ່
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveEquipment} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="text" required placeholder="ຊື່ອຸປະກອນ *" value={newEqName} onChange={(e) => setNewEqName(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8C5345]" />
                <input type="number" required placeholder="ລາຄາເຊົ່າ / ມື້ (LAK) *" value={newEqPrice} onChange={(e) => setNewEqPrice(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8C5345]" />
                <input type="number" required placeholder="ຈຳນວນໃນສະຕັອກ *" value={newEqTotal} onChange={(e) => setNewEqTotal(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8C5345]" />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-[#8C5345] text-white font-bold py-2 rounded-xl hover:opacity-90 transition text-sm">
                    {editingEqId ? '💾 ບັນທຶກແກ້ໄຂ' : '➕ ເພີ່ມອຸປະກອນ'}
                  </button>
                  {editingEqId && (
                    <button type="button" onClick={clearEqForm} className="bg-gray-200 px-3 py-2 rounded-xl text-xs font-bold">❌ ຍົກເລີກ</button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl border border-[#E8D0C8] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#E8D0C8] flex justify-between items-center">
                <h3 className="font-bold text-[#3D2B27]">ລາຍການອຸປະກອນ ແລະ ຈຳນວນສະຕັອກ (17 ລາຍການ)</h3>
                <span className="text-xs text-gray-400 font-bold">ທັງໝົດ {stockItems.length} ລາຍການ</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#FAF3F0] text-[#8C5345] font-bold text-xs uppercase border-b border-[#E8D0C8]">
                    <tr>
                      <th className="p-4">ຊື່ອຸປະກອນ</th>
                      <th className="p-4">ລາຄາເຊົ່າ / ມື້</th>
                      <th className="p-4 text-center">ຈຳນວນໃນສະຕັອກ</th>
                      <th className="p-4 text-center">ຖືກເຊົ່າຢູ່</th>
                      <th className="p-4 text-center">ຈັດການ (EDIT / DELETE)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8D0C8]">
                    {stockItems.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FAF3F0]/50 transition">
                        <td className="p-4 font-bold text-[#3D2B27]">{item.name}</td>
                        <td className="p-4 font-extrabold text-[#8C5345]">{item.price.toLocaleString()} LAK</td>
                        <td className="p-4 text-center font-bold text-base">{item.total}</td>
                        <td className="p-4 text-center font-bold text-gray-500">{item.rented}</td>
                        <td className="p-4 text-center space-x-2">
                          <button onClick={() => handleEditEq(item)} className="bg-amber-50 text-amber-700 px-3 py-1 rounded-xl text-xs font-bold hover:bg-amber-100 transition">✏️ ແກ້ໄຂ</button>
                          <button onClick={() => handleDeleteEq(item.id)} className="bg-red-50 text-red-600 px-3 py-1 rounded-xl text-xs font-bold hover:bg-red-100 transition">🗑️ ລົບ</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3️⃣ PAYROLL & ATTENDANCE TAB */}
        {activeTab === 'payroll' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E8D0C8] shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#3D2B27]">
                  {editingStaffId ? '✏️ ແກ້ໄຂຂໍ້ມູນພະນັກງານ' : '➕ ເພີ່ມພະນັກງານໃໝ່'}
                </h3>
                {editingStaffId && (
                  <button onClick={clearStaffForm} className="bg-emerald-600 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow hover:bg-emerald-700 transition">
                    ➕ ປ່ຽນເປັນເພີ່ມພະນັກງານໃໝ່
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveStaff} className="grid grid-cols-1 md:grid-cols-7 gap-2">
                <input type="text" required placeholder="ຊື່-ນາມສະກຸນ *" value={newStaffName} onChange={(e) => setNewStaffName(e.target.value)} className="border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8C5345]" />
                <input type="text" required placeholder="ຕຳແໜ່ງ *" value={newStaffRole} onChange={(e) => setNewStaffRole(e.target.value)} className="border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8C5345]" />
                <input type="number" required placeholder="ເງິນເດືອນ (LAK) *" value={newStaffSalary} onChange={(e) => setNewStaffSalary(e.target.value)} className="border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8C5345]" />
                <input type="number" placeholder="ຄ່າອອກງານ/ງານ" value={newStaffAllowance} onChange={(e) => setNewStaffAllowance(e.target.value)} className="border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8C5345]" />
                <input type="number" placeholder="ງານເດືອນນີ້" value={newStaffJobs} onChange={(e) => setNewStaffJobs(e.target.value)} className="border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8C5345]" />
                <input type="number" placeholder="ຫັກຂາດວຽກ/ມື້" value={newStaffDeduction} onChange={(e) => setNewStaffDeduction(e.target.value)} className="border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8C5345]" />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-[#8C5345] text-white font-bold py-2 rounded-xl hover:opacity-90 transition text-xs">
                    {editingStaffId ? '💾 ບັນທຶກ' : '➕ ເພີ່ມ'}
                  </button>
                  {editingStaffId && (
                    <button type="button" onClick={clearStaffForm} className="bg-gray-200 px-2 py-2 rounded-xl text-xs font-bold">❌ ຍົກເລີກ</button>
                  )}
                </div>
              </form>
            </div>

            {/* 📅 ATTENDANCE CALENDAR MODAL / PANEL */}
            {selectedStaffForAttendance && (
              <div className="bg-white p-6 rounded-3xl border-2 border-[#8C5345] shadow-lg space-y-4">
                <div className="flex justify-between items-center border-b border-[#E8D0C8] pb-3">
                  <div>
                    <h3 className="font-extrabold text-[#8C5345] text-lg">
                      📅 ປະຕິທິນເຊັກຊື່ມາວຽກ: {selectedStaffForAttendance.name} ({selectedStaffForAttendance.role})
                    </h3>
                    <p className="text-xs text-gray-500 font-bold">ຄລິກແຕ່ລະວັນເພື່ອຕິກ: 🟢 ມາວຽກ | 🔴 ຂາດວຽກ (ຫັກ {selectedStaffForAttendance.absentDeductionPerDay?.toLocaleString()} LAK/ມື້) | 🟡 ລາວຽກ</p>
                  </div>
                  <button onClick={() => setSelectedStaffForAttendance(null)} className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-xs font-bold">
                    ❌ ປິດປະຕິທິນ
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#8C5345]">
                  <div>ອາທິດ</div><div>ຈັນ</div><div>ອັງຄານ</div><div>ພຸດ</div><div>ພະຫັດ</div><div>ສຸກ</div><div>ເສົາ</div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const status = selectedStaffForAttendance.attendance?.[day];
                    return (
                      <div
                        key={day}
                        className={`p-3 rounded-2xl border flex flex-col items-center justify-between min-h-[60px] cursor-pointer transition ${
                          status === 'present'
                            ? 'bg-green-100 border-green-400 text-green-800'
                            : status === 'absent'
                            ? 'bg-red-100 border-red-400 text-red-800'
                            : status === 'leave'
                            ? 'bg-amber-100 border-amber-400 text-amber-800'
                            : 'bg-[#FAF3F0] border-[#E8D0C8] text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="font-extrabold text-sm">{day}</span>
                        <div className="flex gap-1 mt-1">
                          <button
                            type="button"
                            title="ມາວຽກ"
                            onClick={() => toggleAttendance(selectedStaffForAttendance.id, day, 'present')}
                            className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                              status === 'present' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            title="ຂາດວຽກ"
                            onClick={() => toggleAttendance(selectedStaffForAttendance.id, day, 'absent')}
                            className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                              status === 'absent' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            ✕
                          </button>
                          <button
                            type="button"
                            title="ລາວຽກ"
                            onClick={() => toggleAttendance(selectedStaffForAttendance.id, day, 'leave')}
                            className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                              status === 'leave' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            L
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-[#E8D0C8] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#E8D0C8]">
                <h3 className="font-bold text-[#3D2B27]">ຕາຕະລາງຄິດໄລ່ເງິນເດືອນ, ການຂາດວຽກ & ພະນັກງານ</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#FAF3F0] text-[#8C5345] font-bold text-xs uppercase border-b border-[#E8D0C8]">
                    <tr>
                      <th className="p-4">ຊື່ພະນັກງານ</th>
                      <th className="p-4">ຕຳແໜ່ງ</th>
                      <th className="p-4">ເງິນເດືອນພື້ນຖານ</th>
                      <th className="p-4">ຄ່າອອກງານ</th>
                      <th className="p-4 text-center">ຂາດວຽກ (ມື້)</th>
                      <th className="p-4 text-center">ຫັກເງິນຂາດວຽກ</th>
                      <th className="p-4">ເງິນເດືອນສຸດທິ</th>
                      <th className="p-4 text-center">ປະຕິທິນ / ຈັດການ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8D0C8]">
                    {staffList.map((staff) => {
                      const absentDays = Object.values(staff.attendance || {}).filter((s) => s === 'absent').length;
                      const deduction = absentDays * (staff.absentDeductionPerDay || 100000);
                      const netSalary = staff.baseSalary + staff.jobAllowance * staff.jobsDone - deduction;
                      return (
                        <tr key={staff.id} className="hover:bg-[#FAF3F0]/50 transition">
                          <td className="p-4 font-bold text-[#3D2B27]">{staff.name}</td>
                          <td className="p-4 text-xs font-medium text-gray-500">{staff.role}</td>
                          <td className="p-4 font-bold">{staff.baseSalary.toLocaleString()} LAK</td>
                          <td className="p-4 font-bold text-[#8C5345]">+{ (staff.jobAllowance * staff.jobsDone).toLocaleString()} LAK ({staff.jobsDone} ງານ)</td>
                          <td className="p-4 text-center font-bold text-red-600">{absentDays} ມື້</td>
                          <td className="p-4 text-center font-bold text-red-600">-{deduction.toLocaleString()} LAK</td>
                          <td className="p-4 font-black text-green-700 text-base">{(netSalary > 0 ? netSalary : 0).toLocaleString()} LAK</td>
                          <td className="p-4 text-center space-x-2">
                            <button
                              onClick={() => setSelectedStaffForAttendance(staff)}
                              className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl text-xs font-bold hover:bg-indigo-100 transition"
                            >
                              📅 ເຊັກຊື່
                            </button>
                            <button onClick={() => handleEditStaff(staff)} className="bg-amber-50 text-amber-700 px-3 py-1 rounded-xl text-xs font-bold hover:bg-amber-100 transition">✏️ ແກ້ໄຂ</button>
                            <button onClick={() => handleDeleteStaff(staff.id)} className="bg-red-50 text-red-600 px-3 py-1 rounded-xl text-xs font-bold hover:bg-red-100 transition">🗑️ ລົບ</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4️⃣ FINANCE LEDGER TAB */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="flex gap-3 bg-white p-3 rounded-2xl border border-[#E8D0C8] shadow-sm w-fit">
              <button
                onClick={() => setFinanceTimeframe('daily')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                  financeTimeframe === 'daily' ? 'bg-[#8C5345] text-white shadow' : 'text-gray-600 hover:bg-[#FAF3F0]'
                }`}
              >
                📅 ປະຈຳວັນ (Daily)
              </button>
              <button
                onClick={() => setFinanceTimeframe('monthly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                  financeTimeframe === 'monthly' ? 'bg-[#8C5345] text-white shadow' : 'text-gray-600 hover:bg-[#FAF3F0]'
                }`}
              >
                🗓️ ປະຈຳເດືອນ (Monthly)
              </button>
              <button
                onClick={() => setFinanceTimeframe('yearly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                  financeTimeframe === 'yearly' ? 'bg-[#8C5345] text-white shadow' : 'text-gray-600 hover:bg-[#FAF3F0]'
                }`}
              >
                📆 ປະຈຳປີ (Yearly)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-[#E8D0C8] shadow-sm">
                <div className="text-2xl mb-1">💰</div>
                <p className="text-xs font-bold text-gray-400 uppercase">ລາຍຮັບລວມ ({financeTimeframe})</p>
                <h2 className="text-2xl font-black text-[#A36B5E] mt-1">{totalRevenue.toLocaleString()} LAK</h2>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-[#E8D0C8] shadow-sm">
                <div className="text-2xl mb-1">💵</div>
                <p className="text-xs font-bold text-gray-400 uppercase">ຍອດມັດຈຳຮັບແລ້ວ (30%)</p>
                <h2 className="text-2xl font-black text-[#C6936A] mt-1">{totalDeposit.toLocaleString()} LAK</h2>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-[#E8D0C8] shadow-sm">
                <div className="text-2xl mb-1">💸</div>
                <p className="text-xs font-bold text-gray-400 uppercase">ລາຍຈ່າຍເງິນເດືອນພະນັກງານ</p>
                <h2 className="text-2xl font-black text-red-600 mt-1">{totalStaffPayroll.toLocaleString()} LAK</h2>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-[#E8D0C8] shadow-sm">
                <div className="text-2xl mb-1">📈</div>
                <p className="text-xs font-bold text-gray-400 uppercase">ກຳໄລປະມານການ</p>
                <h2 className="text-2xl font-black text-green-700 mt-1">{(totalRevenue - totalStaffPayroll).toLocaleString()} LAK</h2>
              </div>
            </div>
          </div>
        )}

        {/* 5️⃣ EDITABLE BALANCE SHEET TAB */}
        {activeTab === 'balanceSheet' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E8D0C8] shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[#3D2B27]">⚙️ ປັບແກ້ໄຂຕົວເລກໃບສະຫຼຸບຊັບສິນ & ທຶນ</h3>
                <p className="text-xs text-gray-400 font-bold mt-0.5">ທ່ານສາມາດປ້ອນຕົວເລກ ຊັບສິນລວມ ແລະ ທຶນສຸດທິ ໃໝ່ໄດ້ດ້ວຍຕົນເອງ</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditBalanceMode(!editBalanceMode)}
                  className="bg-[#8C5345] text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition shadow-sm"
                >
                  {editBalanceMode ? '❌ ປິດຟອມ' : '✏️ ແກ້ໄຂຕົວເລກຊັບສິນ & ທຶນ'}
                </button>
                {(customAssets !== null || customEquity !== null) && (
                  <button onClick={handleResetBalanceSheet} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-300 transition">
                    🔄 ໄລ່ອັດໂຕໂນມັດ
                  </button>
                )}
              </div>
            </div>

            {editBalanceMode && (
              <form onSubmit={handleSaveBalanceSheet} className="bg-white p-6 rounded-3xl border-2 border-[#8C5345] shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">1. ຊັບສິນລວມ (Total Assets LAK)</label>
                  <input
                    type="number"
                    placeholder={`ປັດຈຸບັນ: ${displayAssets.toLocaleString()}`}
                    value={inputAssets}
                    onChange={(e) => setInputAssets(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8C5345]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">3. ທຶນສຸດທິ (Owner's Equity LAK)</label>
                  <input
                    type="number"
                    placeholder={`ປັດຈຸບັນ: ${displayEquity.toLocaleString()}`}
                    value={inputEquity}
                    onChange={(e) => setInputEquity(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8C5345]"
                  />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full bg-[#8C5345] text-white font-bold py-2 rounded-xl text-sm hover:opacity-90 transition">
                    💾 ບັນທຶກຕົວເລກໃໝ່
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border-2 border-green-200 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase">1. ຊັບສິນລວມ (TOTAL ASSETS)</p>
                <h2 className="text-3xl font-black text-green-700 mt-2">{displayAssets.toLocaleString()} LAK</h2>
                {customAssets !== null && <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold mt-2 inline-block">✏️ ປັບແກ້ໄຂເອງ</span>}
              </div>
              <div className="bg-white p-6 rounded-3xl border-2 border-red-200 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase">2. ໜີ້ສິນລວມ (TOTAL LIABILITIES)</p>
                <h2 className="text-3xl font-black text-red-600 mt-2">{totalLiabilities.toLocaleString()} LAK</h2>
              </div>
              <div className="bg-white p-6 rounded-3xl border-2 border-[#8C5345] shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase">3. ທຶນສຸດທິ (OWNER'S EQUITY)</p>
                <h2 className="text-3xl font-black text-[#8C5345] mt-2">{displayEquity.toLocaleString()} LAK</h2>
                {customEquity !== null && <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold mt-2 inline-block">✏️ ປັບແກ້ໄຂເອງ</span>}
              </div>
            </div>
          </div>
        )}

        {/* 6️⃣ CASH SCAN TAB */}
        {activeTab === 'cashScan' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E8D0C8] shadow-sm">
              <h3 className="font-bold text-[#3D2B27] mb-4">
                {editingCashId ? '✏️ ແກ້ໄຂໃບສະແກນເງິນ' : '📸 ບັນທຶກໃບສະແກນເງິນສົດ / ໃບບິນ'}
              </h3>
              <form onSubmit={(e) => { e.preventDefault(); alert('✅ ບັນທຶກສຳເລັດ!'); }} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="text" required placeholder="ໝາຍເລກອໍເດີ *" value={proofOrderNo} onChange={(e) => setProofOrderNo(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8C5345]" />
                <input type="number" required placeholder="ຈຳນວນເງິນ (LAK) *" value={proofAmount} onChange={(e) => setProofAmount(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8C5345]" />
                <input type="text" placeholder="URL ຮູບໃບບິນ (/logo.png)" value={proofInput} onChange={(e) => setProofInput(e.target.value)} className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8C5345]" />
                <button type="submit" className="bg-[#8C5345] text-white font-bold py-2 rounded-xl hover:opacity-90 transition text-sm">➕ ບັນທຶກ</button>
              </form>
            </div>
          </div>
        )}

        {/* 7️⃣ DASHBOARD OVERVIEW TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-[#E8D0C8] shadow-sm">
                <div className="text-2xl mb-2">💰</div>
                <p className="text-xs font-bold text-gray-400">ລາຍຮັບລວມ</p>
                <h2 className="text-2xl font-black text-[#A36B5E] mt-1">{totalRevenue.toLocaleString()} LAK</h2>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-[#E8D0C8] shadow-sm">
                <div className="text-2xl mb-2">💵</div>
                <p className="text-xs font-bold text-gray-400">ຍອດມັດຈຳ (30%)</p>
                <h2 className="text-2xl font-black text-[#C6936A] mt-1">{totalDeposit.toLocaleString()} LAK</h2>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-[#E8D0C8] shadow-sm">
                <div className="text-2xl mb-2">✅</div>
                <p className="text-xs font-bold text-gray-400">ອໍເດີ້ທັງໝົດ</p>
                <h2 className="text-2xl font-black text-[#A36B5E] mt-1">{orders.length} Orders</h2>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-[#E8D0C8] shadow-sm">
                <div className="text-2xl mb-2">👥</div>
                <p className="text-xs font-bold text-gray-400">ພະນັກງານ</p>
                <h2 className="text-2xl font-black text-[#A36B5E] mt-1">{staffList.length} 👤</h2>
              </div>
            </div>

            {/* --- ສ່ວນກຣາຟ responsive --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* 1. ກຣາຟລາຍຮັບປະຈຳເດືອນ (Area Chart) */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-[#E8D0C8]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-[#A36B5E]">
                      📈 ແນວໂນ້ມລາຍຮັບປະຈຳເດືອນ
                    </h3>
                    <p className="text-xs text-gray-400">ສະແດງຜົນລາຍຮັບລວມ ແລະ ຍອດມັດຈຳ (LAK)</p>
                  </div>
                  <span className="self-start sm:self-auto text-xs bg-[#FDF8F6] text-[#A36B5E] font-bold px-3 py-1 rounded-full border border-[#E8D0C8]">
                    ປີ 2026
                  </span>
                </div>

                <div className="h-[260px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#A36B5E" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#A36B5E" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorDeposit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1C6936" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#1C6936" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                      <Tooltip
                        formatter={(value: any) => [`${Number(value).toLocaleString()} LAK`, '']}
                        contentStyle={{ backgroundColor: '#FFF', borderRadius: '16px', borderColor: '#E8D0C8', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="revenue" name="ລາຍຮັບລວມ" stroke="#A36B5E" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                      <Area type="monotone" dataKey="deposit" name="ຍອດມັດຈຳ (30%)" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorDeposit)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 2. ກຣາຟສະຖິຕິສະຖານະອໍເດີ (Donut Chart) */}
              <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-[#E8D0C8] flex flex-col justify-between">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-[#A36B5E] mb-1">📊 ສະຖິຕິອໍເດີ</h3>
                  <p className="text-xs text-gray-400 mb-4">ສັດສ່ວນສະຖານະອໍເດີທັງໝົດ</p>

                  <div className="h-[200px] w-full relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={orderStatusData} innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                          {orderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => [`${value} ອໍເດີ`, '']} contentStyle={{ backgroundColor: '#FFF', borderRadius: '8px', fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black text-[#A36B5E]">{orders.length}</span>
                      <span className="text-[10px] text-gray-400">ອໍເດີທັງໝົດ</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100 mt-2">
                  {orderStatusData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-500">{item.name}</span>
                      </div>
                      <span className="font-bold text-gray-700">{item.value} ອໍເດີ</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}