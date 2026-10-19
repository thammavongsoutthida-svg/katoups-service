'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function ClientHomePage() {
  const [lang, setLang] = useState<'la' | 'en'>('la');
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('ທ່າແຂກ, ຄຳມ່ວນ');
  const [showInvoiceModal, setShowInvoiceModal] = useState<any>(null);

  // 🎪 ລາຍການອຸປະກອນ (ສາມາດປ່ຽນ Path ຮູບຢູ່ຊ່ອງ img ເພື່ອດຶງຮູບອື່ນຈາກ public ມາໃສ່ຕາມຫຼັງໄດ້)
  const stockItems = [
    { id: 'eq-1', name: 'ເຕັ້ນ Marquee 10x12', price: 8000000, img: '/11.jpeg' },
    { id: 'eq-2', name: 'ເຕັ້ນ Marquee 6x8', price: 1500000, img: '/12.jpeg' },
    { id: 'eq-3', name: 'ເຕັ້ນ Marquee 5x8', price: 1000000, img: '/13.jpeg' },
    { id: 'eq-4', name: 'ເຕັ້ນ Marquee 4x6', price: 500000, img: '/45.jpeg' },
    { id: 'eq-5', name: 'ເຕັ້ນ Marquee 4x4', price: 400000, img: '/56.jpeg' },
    { id: 'eq-11', name: 'ຊຸດໂຕະຕັ່ງ Tiffany Classic (8 ທ່ານ)', price: 150000, img: '/65.jpeg' },
    { id: 'eq-12', name: 'ຊຸດໂຕະຕັ່ງ Tiffany Golden (8 ທ່ານ)', price: 250000, img: '/65.jpeg' },
    { id: 'eq-13', name: 'ຊຸດໂຕະຕັ່ງພລາສຕິກ (1) (8 ທ່ານ)', price: 60000, img: '/65.jpeg' },
    { id: 'eq-14', name: 'ຊຸດໂຕະຕັ່ງພລາສຕິກ + ຜ້າກວມ (2) (8 ທ່ານ)', price: 250000, img: '/65.jpeg' },
    { id: 'eq-15', name: 'ພັດລົມ (Fan)', price: 100000, img: '/65.jpeg' },
    { id: 'eq-16', name: 'ພັດລົມໄອເຢັນ (Evaporative Air Cooler)', price: 1000000, img: '/65.jpeg' },
    { id: 'eq-17', name: 'ຫຍ້າທຽມ (Artificial Grass)', price: 200000, img: '/65.jpeg' },
  ];

  const scrollToQuotation = () => {
    const element = document.getElementById('quotation-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[id] > 1) {
        updated[id] -= 1;
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const cartTotalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  const calculateTotal = () => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = stockItems.find((s) => s.id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  };

  const totalAmount = calculateTotal();
  const deposit30 = totalAmount * 0.3;
  const balance70 = totalAmount - deposit30;

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) return alert('ກະລຸນາປ້ອນຊື່ ແລະ ເບີໂທ WhatsApp');
    if (cartTotalItems === 0) return alert('ກະລຸນາເລືອກອຸປະກອນຢ່າງນ້ອຍ 1 ລາຍການ');

    const orderNo = `QUO-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      order_no: orderNo,
      customer_name: customerName,
      phone: phone,
      event_date: startDate || new Date().toISOString().split('T')[0],
      total_amount: totalAmount,
      deposit: deposit30,
      balance: balance70,
      status: 'PENDING',
    };

    try {
      await supabase.from('orders').insert([newOrder]);
    } catch (err) {
      console.error(err);
    }

    setShowInvoiceModal({
      orderNo,
      customerName,
      phone,
      eventDate: startDate || 'ບໍ່ໄດ້ລະບຸ',
      totalAmount,
      deposit30,
      balance70,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF3F0] font-['Noto_Sans_Lao',sans-serif] text-[#3D2B27]">
      {/* 👑 HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E8D0C8] px-4 md:px-8 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          {/* ໂລໂກ້ເທິງ Header - ແປງໃຫ້ພໍດີບໍ່ມີວົງມົນຊ້ອນ */}
          <div className="w-10 h-10 relative rounded-full overflow-hidden">
            <Image src="/logo.png" alt="Katoups Logo" fill className="object-cover" />
          </div>
          <div>
            <h1 className="font-extrabold text-[#C6936A] text-base leading-none">ກະຕູບສ໌ ບໍລິການ</h1>
            <p className="text-[10px] text-gray-400 font-bold tracking-tight mt-0.5">KATOUPS SERVICE - ບໍລິການເຊົ່າອຸປະກອນງານລ້ຽງ</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={scrollToQuotation}
            className="bg-[#8C5345] text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition"
          >
            <span>🛒 ຕະກ້າ ({cartTotalItems})</span>
          </button>

          <button
            onClick={scrollToQuotation}
            className="bg-[#C6936A] text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition"
          >
            <span>📄 ໃບສະເໜີລາຄາ</span>
          </button>

          <button
            onClick={() => setLang(lang === 'la' ? 'en' : 'la')}
            className="text-xs border border-[#C6936A] text-[#C6936A] font-bold px-2.5 py-1 rounded-full hover:bg-[#FAF3F0]"
          >
            🌐 {lang.toUpperCase()}
          </button>
        </div>
      </header>

      {/* 🎪 HERO SECTION */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <div className="text-center space-y-3">
          {/* ໂລໂກ້ກາງໜ້າ - ລົບບໍເດີ້ວົງມົນຊ້ອນອອກໃຫ້ພໍດີ */}
          <div className="w-24 h-24 mx-auto relative rounded-full overflow-hidden shadow-sm">
            <Image src="/logo.png" alt="Katoups Logo Large" fill className="object-cover" />
          </div>
          <div className="inline-block">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#A36B5E] bg-[#E8D0C8]/40 px-3.5 py-1 rounded-full border border-[#E8D0C8]">
              KATOUPS EVENT EQUIPMENT RENTAL SERVICE (SINCE 2021)
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#3D2B27]">
            ບໍລິການເຊົ່າເຕັ້ນ, ໂຕະ, ຕັ່ງ ແລະ ອຸປະກອນຈັດງານລ້ຽງ <span className="text-[#C6936A]">ກະຕູບສ໌ ບໍລິການ</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-500 max-w-2xl mx-auto">
            ຍົກລະດັບງານລ້ຽງຂອງທ່ານດ້ວຍເຕັ້ນ Marquee ຫຍູ້ຫລາ, ຊຸດໂຕະຕັ່ງ Tiffany, ພັດລົມໄອເຢັນ, ຫຍ້າທຽມ ແລະ ອຸປະກອນຈັດງານລ້ຽງຄົບວົງຈອນ.
          </p>
        </div>

        {/* 🛍️ PRODUCT GRID & QUOTATION FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ລາຍການອຸປະກອນ */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {stockItems.map((item) => {
              const qty = cart[item.id] || 0;
              return (
                <div key={item.id} className="bg-white rounded-3xl p-4 border border-[#E8D0C8] shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <div className="space-y-3">
                    {/* ຮູບອຸປະກອນ - ດຶງຈາກ public/ */}
                    <div className="h-36 w-full relative bg-[#FAF3F0] rounded-2xl overflow-hidden">
                      <Image 
                        src={item.img} 
                        alt={item.name} 
                        fill 
                        className="object-cover"
                        onError={(e: any) => {
                          e.target.src = '/logo.png'; // ຮູບສຳຮອງຖ້າຫາຮູບໃນ public ບໍ່ເຫັນ
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-[#3D2B27] min-h-[32px]">{item.name}</h3>
                      <p className="text-sm font-extrabold text-[#8C5345] mt-1">{item.price.toLocaleString()} LAK <span className="text-[10px] text-gray-400 font-normal">/ຊຸດ/ມື້</span></p>
                    </div>
                  </div>

                  <div className="mt-4">
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(item.id)}
                        className="w-full bg-[#8C5345] text-white text-xs font-bold py-2 rounded-xl hover:opacity-90 transition"
                      >
                        + ເພີ່ມເຂົ້າໃນຕະກ້າ
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-[#FAF3F0] rounded-xl p-1 border border-[#E8D0C8]">
                        <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 bg-white text-[#8C5345] font-bold rounded-lg shadow-sm text-sm flex items-center justify-center">-</button>
                        <span className="font-extrabold text-xs text-[#8C5345]">{qty}</span>
                        <button onClick={() => addToCart(item.id)} className="w-7 h-7 bg-[#8C5345] text-white font-bold rounded-lg shadow-sm text-sm flex items-center justify-center">+</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 📝 ຟອມອອກໃບສະເໜີລາຄາ */}
          <div id="quotation-form" className="bg-white p-6 rounded-3xl border-2 border-[#C6936A] shadow-md h-fit space-y-5 scroll-mt-24">
            <div>
              <h3 className="font-extrabold text-[#8C5345] text-base">📝 ຟອມອອກໃບສະເໜີລາຄາ / ຈອງອຸປະກອນ</h3>
              <p className="text-xs text-gray-400 font-bold mt-0.5">ເລືອກອຸປະກອນແລ້ວປ້ອນຂໍ້ມູນເພື່ອອອກໃບສະເໜີລາຄາ</p>
            </div>

            <div className="space-y-2 border-y border-[#E8D0C8] py-3 text-xs">
              <div className="flex justify-between font-bold text-gray-500">
                <span>ຈຳນວນອຸປະກອນ:</span>
                <span className="text-[#8C5345]">{cartTotalItems} ລາຍການ</span>
              </div>
              <div className="flex justify-between font-bold text-gray-500">
                <span>ລວມຄ່າເຊົ່າທັງໝົດ:</span>
                <span className="text-base font-black text-[#3D2B27]">{totalAmount.toLocaleString()} LAK</span>
              </div>
              <div className="flex justify-between font-bold text-gray-500">
                <span>ມັດຈຳ (30%):</span>
                <span className="text-[#8C5345]">{deposit30.toLocaleString()} LAK</span>
              </div>
              <div className="flex justify-between font-bold text-gray-500 pt-1 border-t border-dashed">
                <span>ຈ່າຍມື້ຮັບເຄື່ອງ (70%):</span>
                <span className="text-[#C6936A] font-extrabold">{balance70.toLocaleString()} LAK</span>
              </div>
            </div>

            <form onSubmit={handleCreateQuotation} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">ຊື່ລູກຄ້າ / ບໍລິສັດ *</label>
                <input
                  type="text"
                  required
                  placeholder="ປ້ອນຊື່ ແລະ ນາມສະກຸນ"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8C5345]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">ເບີໂທຕິດຕໍ່ (WhatsApp) *</label>
                <input
                  type="text"
                  required
                  placeholder="020 xxxx xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8C5345]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-600 block mb-1">ວັນທີເລີ່ມເຊົ່າ</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-[#8C5345]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-600 block mb-1">ວັນທີສົ່ງເຄື່ອງ</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-[#8C5345]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">ສະຖານທີ່ຈັດງານ</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8C5345]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#8C5345] text-white font-bold py-3 rounded-2xl text-xs hover:opacity-90 transition shadow-md mt-2 flex items-center justify-center gap-1.5"
              >
                <span>✨ ຢືນຢັນການຈອງ / ອອກໃບສະເໜີລາຄາ</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* 📱 ປຸ່ມລອຍໃບສະເໜີລາຄາ (ສະແດງສະເພາະມືຖື) */}
      <button
        onClick={scrollToQuotation}
        className="fixed bottom-6 right-4 bg-[#8C5345] text-white px-4 py-3 rounded-full shadow-2xl font-bold text-xs flex items-center gap-2 z-50 hover:scale-105 transition active:scale-95 md:hidden border-2 border-white"
      >
        <span>📝 ໄປຫາໃບສະເໜີລາຄາ</span>
        {cartTotalItems > 0 && (
          <span className="bg-amber-400 text-black w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black">
            {cartTotalItems}
          </span>
        )}
      </button>

      {/* 📄 MODAL INVOICE */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-[#E8D0C8]">
            <div className="text-center space-y-1">
              <span className="text-2xl">🎉</span>
              <h3 className="text-lg font-black text-[#8C5345]">ໃບສະເໜີລາຄາສຳເລັດ!</h3>
              <p className="text-xs text-gray-400">ໝາຍເລກອໍເດີ: <span className="font-bold text-[#C6936A]">{showInvoiceModal.orderNo}</span></p>
            </div>

            <div className="bg-[#FAF3F0] p-4 rounded-2xl space-y-2 text-xs border border-[#E8D0C8]">
              <div className="flex justify-between"><span>ຊື່ລູກຄ້າ:</span><b>{showInvoiceModal.customerName}</b></div>
              <div className="flex justify-between"><span>ເບີໂທ:</span><b>{showInvoiceModal.phone}</b></div>
              <div className="flex justify-between"><span>ວັນທີຈັດງານ:</span><b>{showInvoiceModal.eventDate}</b></div>
              <div className="flex justify-between border-t border-[#E8D0C8] pt-2 text-[#8C5345]"><span>ມັດຈຳ (30%):</span><b>{showInvoiceModal.deposit30.toLocaleString()} LAK</b></div>
            </div>

            <a
              href={`https://wa.me/8562051702676?text=${encodeURIComponent(`Katoups Service Order: ${showInvoiceModal.orderNo}\nລູກຄ້າ: ${showInvoiceModal.customerName}\nເບີໂທ: ${showInvoiceModal.phone}\nຍອດລວມ: ${showInvoiceModal.totalAmount.toLocaleString()} LAK`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full block text-center bg-[#25D366] text-white font-bold py-3 rounded-xl shadow hover:opacity-90 transition text-xs"
            >
              📲 ສົ່ງຂໍ້ມູນເຂົ້າ WhatsApp ຮ້ານ
            </a>

            <button onClick={() => setShowInvoiceModal(null)} className="w-full border border-gray-300 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50">
              ❌ ປິດ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}