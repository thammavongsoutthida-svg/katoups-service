'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

// 🌐 ວັດຈະນານຸກົມ 2 ພາສາ (LA / EN)
const translations = {
  la: {
    siteTitle: 'ກະຕູບສ໌ ບໍລິການ',
    siteSubtitle: 'KATOUPS SERVICE - ບໍລິການເຊົ່າອຸປະກອນງານລ້ຽງ',
    cart: 'ຕະກ້າ',
    quotationBtn: 'ໃບສະເໜີລາຄາ',
    heroTag: 'KATOUPS EVENT EQUIPMENT RENTAL SERVICE (SINCE 2021)',
    heroTitle: 'ບໍລິການເຊົ່າເຕັ້ນ, ໂຕະ, ຕັ່ງ ແລະ ອຸປະກອນຈັດງານລ້ຽງ',
    heroDesc: 'ຍົກລະດັບງານລ້ຽງຂອງທ່ານດ້ວຍເຕັ້ນ Marquee ຫຍູ້ຫລາ, ຊຸດໂຕະຕັ່ງ Tiffany, ພັດລົມໄອເຢັນ, ຫຍ້າທຽມ ແລະ ອຸປະກອນຈັດງານລ້ຽງຄົບວົງຈອນ.',
    galleryTitle: 'ພາບຜົນງານການຈັດງານລ້ຽງຂອງ ກະຕູບສ໌ ບໍລິການ',
    gallerySubtitle: 'ຕົວຢ່າງງານຕິດຕັ້ງເຕັ້ນ VIP, ຊຸດໂຕະຕັ່ງ ແລະ ການປະດັບປະດາ',
    works: 'ຜົນງານ',
    selectEquipment: 'ເລືອກອຸປະກອນເຊົ່າ',
    selectDesc: 'ຄລິກເພີ່ມອຸປະກອນເຂົ້າໃນຕະກ້າເພື່ອຄິດໄລ່ຄ່າເຊົ່າ',
    perDay: '/ຊຸດ/ມື້',
    addToCart: '+ ເພີ່ມເຂົ້າໃນຕະກ້າ',
    quotationFormTitle: '📝 ຟອມອອກໃບສະເໜີລາຄາ / ຈອງອຸປະກອນ',
    quotationFormDesc: 'ເລືອກອຸປະກອນແລ້ວປ້ອນຂໍ້ມູນເພື່ອອອກໃບສະເໜີລາຄາ',
    totalItems: 'ຈຳນວນອຸປະກອນ:',
    itemsCount: 'ລາຍການ',
    totalRent: 'ລວມຄ່າເຊົ່າທັງໝົດ:',
    deposit30: 'ມັດຈຳ (30%):',
    balance70: 'ຈ່າຍມື້ຮັບເຄື່ອງ (70%):',
    customerNameLabel: 'ຊື່ລູກຄ້າ / ບໍລິສັດ *',
    customerNamePlaceholder: 'ປ້ອນຊື່ ແລະ ນາມສະກຸນ',
    phoneLabel: 'ເບີໂທຕິດຕໍ່ (WhatsApp) * (ສູງສຸດ 11 ຕົວ)',
    phonePlaceholder: '02051702676',
    startDateLabel: 'ວັນທີເລີ່ມເຊົ່າ *',
    endDateLabel: 'ວັນທີສົ່ງເຄື່ອງ',
    locationLabel: 'ສະຖານທີ່ຈັດງານ',
    submitBtn: '✨ ຢືນຢັນການຈອງ / ອອກໃບສະເໜີລາຄາ',
    submittingBtn: '⏳ ກຳລັງສົ່ງຂໍ້ມູນຫາແອັດມິນ...',
    floatingBtn: '📝 ໄປຫາໃບສະເໜີລາຄາ',
    modalTitle: 'ໃບສະເໜີລາຄາສຳເລັດ! ສົ່ງຂໍ້ມູນຫາແອັດມິນແລ້ວ',
    orderNoLabel: 'ໝາຍເລກອໍເດີ:',
    customerLabel: 'ຊື່ລູກຄ້າ:',
    phoneModalLabel: 'ເບີໂທ:',
    eventDateLabel: 'ວັນທີຈັດງານ:',
    sendWhatsappBtn: '📲 ສົ່ງຂໍ້ມູນເຂົ້າ WhatsApp ຮ້ານ',
    closeBtn: '❌ ປິດ',
  },
  en: {
    siteTitle: 'Katoups Service',
    siteSubtitle: 'KATOUPS SERVICE - Event Equipment Rental',
    cart: 'Cart',
    quotationBtn: 'Quotation',
    heroTag: 'KATOUPS EVENT EQUIPMENT RENTAL SERVICE (SINCE 2021)',
    heroTitle: 'Marquee Tent, Table, Chair & Event Equipment Rental',
    heroDesc: 'Elevate your special events with luxury Marquee tents, Tiffany chair sets, evaporative air coolers, artificial grass, and complete event gear.',
    galleryTitle: 'Portfolio & Setup Showcase',
    gallerySubtitle: 'Examples of VIP Marquee setup, tables, chairs, and decor',
    works: 'Works',
    selectEquipment: 'Select Rental Items',
    selectDesc: 'Click to add items to cart and calculate rental fee',
    perDay: '/set/day',
    addToCart: '+ Add to Cart',
    quotationFormTitle: '📝 Quotation & Booking Form',
    quotationFormDesc: 'Select equipment and fill details to generate a quote',
    totalItems: 'Total Equipment:',
    itemsCount: 'items',
    totalRent: 'Total Rental Fee:',
    deposit30: 'Deposit (30%):',
    balance70: 'Balance on Delivery (70%):',
    customerNameLabel: 'Customer / Company Name *',
    customerNamePlaceholder: 'Enter your full name',
    phoneLabel: 'Contact Number (WhatsApp) * (Max 11 digits)',
    phonePlaceholder: '02051702676',
    startDateLabel: 'Start Date *',
    endDateLabel: 'End Date',
    locationLabel: 'Event Location',
    submitBtn: '✨ Confirm Booking / Send to Admin',
    submittingBtn: '⏳ Sending to Admin...',
    floatingBtn: '📝 Go to Quotation',
    modalTitle: 'Booking Sent to Admin Successfully!',
    orderNoLabel: 'Order No:',
    customerLabel: 'Customer Name:',
    phoneModalLabel: 'Phone:',
    eventDateLabel: 'Event Date:',
    sendWhatsappBtn: '📲 Send Order via WhatsApp',
    closeBtn: '❌ Close',
  },
};

export default function ClientHomePage() {
  const [lang, setLang] = useState<'la' | 'en'>('la');
  const t = translations[lang];

  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('ທ່າແຂກ, ຄຳມ່ວນ');
  const [showInvoiceModal, setShowInvoiceModal] = useState<any>(null);

  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [todayMin, setTodayMin] = useState<string>('');

  // 🗓️ ຕັ້ງວັນທີປັດຈຸບັນຝ່າຍ Client-side ເພື່ອປ້ອງກັນ Build Fail
  useEffect(() => {
    setTodayMin(new Date().toISOString().split('T')[0]);
  }, []);

  // 🔄 ດຶງຂໍ້ມູນວັນທີໆມີການຈອງແລ້ວຈາກ Supabase
  const fetchBookedDates = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('event_date')
        .neq('status', 'CANCELLED');

      if (data) {
        const dates = data.map((item: any) => item.event_date).filter(Boolean);
        setBookedDates(dates);
      }
    } catch (err) {
      console.error('Error fetching booked dates:', err);
    }
  };

  useEffect(() => {
    fetchBookedDates();

    // ⚡ Realtime Listener
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchBookedDates();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const stockItems = [
    { id: 'eq-1', name: lang === 'la' ? 'ເຕັ້ນ Marquee VIP 10x12' : 'VIP Marquee Tent 10x12m', price: 8000000, img: '/tt.png' },
    { id: 'eq-2', name: lang === 'la' ? 'ເຕັ້ນ Marquee 6x8' : 'Marquee Tent 6x8m', price: 1500000, img: '/tt.png' },
    { id: 'eq-3', name: lang === 'la' ? 'ເຕັ້ນ Marquee 5x8' : 'Marquee Tent 5x8m', price: 1000000, img: '/tt.png' },
    { id: 'eq-4', name: lang === 'la' ? 'ເຕັ້ນ Marquee 4x6' : 'Marquee Tent 4x6m', price: 500000, img: '/tt.png' },
    { id: 'eq-5', name: lang === 'la' ? 'ເຕັ້ນ Marquee 4x4' : 'Marquee Tent 4x4m', price: 400000, img: '/tt.png' },
    { id: 'eq-6', name: lang === 'la' ? 'ເຕັ້ນປະດັບ Decorative Marquee 10x12' : 'Decorative Marquee Tent 10x12m', price: 4000000, img: '/tt.png' },
    { id: 'eq-7', name: lang === 'la' ? 'ເຕັ້ນປະດັບ Decorative Marquee 6x8' : 'Decorative Marquee Tent 6x8m', price: 1000000, img: '/tt.png' },
    { id: 'eq-8', name: lang === 'la' ? 'ຊຸດໂຕະຕັ່ງ Tiffany Classic (8 ທ່ານ)' : 'Tiffany Classic Chair & Table Set (8 Seats)', price: 150000, img: '/tt.png' },
    { id: 'eq-9', name: lang === 'la' ? 'ຊຸດໂຕະຕັ່ງ Tiffany Golden (8 ທ່ານ)' : 'Tiffany Golden Chair & Table Set (8 Seats)', price: 250000, img: '/tt.png' },
    { id: 'eq-10', name: lang === 'la' ? 'ຊຸດໂຕະຕັ່ງພລາສຕິກ (8 ທ່ານ)' : 'Plastic Table & Chair Set (8 Seats)', price: 60000, img: '/tt.png' },
    { id: 'eq-11', name: lang === 'la' ? 'ຊຸດໂຕະຕັ່ງພລາສຕິກ + ຜ້າກວມ (8 ທ່ານ)' : 'Plastic Table & Chair + Cover Set (8 Seats)', price: 25000, img: '/tt.png' },
    { id: 'eq-12', name: lang === 'la' ? 'ພັດລົມໄອເຢັນ & ອຸປະກອນປະດັບ' : 'Evaporative Air Cooler & Decor Set', price: 1000000, img: '/tt.png' },
  ];

  const galleryImages = [
    { id: 'g-1', title: lang === 'la' ? 'ຊຸດໂຕະຕັ່ງ Tiffany Golden ງານປະຊຸມ' : 'Tiffany Golden Conference Set', img: '/11.jpeg' },
    { id: 'g-2', title: lang === 'la' ? 'ເຕັ້ນປະດັບ Decorative Marquee VIP' : 'Decorative Marquee VIP Setup', img: '/12.jpeg' },
    { id: 'g-3', title: lang === 'la' ? 'ບັນຍາກາດການຈັດງານດອງ' : 'Wedding Ceremony Atmosphere', img: '/13.jpeg' },
    { id: 'g-4', title: lang === 'la' ? 'ເຕັ້ນໂຄງສ້າງ Marquee White VIP' : 'White Marquee Structure Tent', img: '/44.jpeg' },
    { id: 'g-5', title: lang === 'la' ? 'ຊຸດໂຕະຕັ່ງ Tiffany Golden VIP' : 'Tiffany Golden VIP Dining Set', img: '/45.jpeg' },
    { id: 'g-6', title: lang === 'la' ? 'ງານປະດັບໄຟ ແລະ ເຕັ້ນປະດັບ' : 'Lighting Decor & Event Tent', img: '/56.jpeg' },
    { id: 'g-7', title: lang === 'la' ? 'ຊຸດໂຕະຕັ່ງ Tiffany Classic' : 'Tiffany Classic Chair Setup', img: '/656.jpeg' },
    { id: 'g-8', title: lang === 'la' ? 'ດອກໄຟແຊນເດີເລຍ' : 'Luxury Chandelier Lighting', img: '/656565.jpeg' },
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

  // 📱 ຟັງຊັນຈຳກັດເບີໂທ strictly ບໍ່ໃຫ້ເກີນ 11 ຕົວເລກ
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanNumbersOnly = e.target.value.replace(/\D/g, '');
    const limitedPhone = cleanNumbersOnly.slice(0, 11);
    setPhone(limitedPhone);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value;
    if (bookedDates.includes(selected)) {
      alert(lang === 'la' ? `⚠️ ວັນທີ ${selected} ມີຄິວຈອງເຕັມແລ້ວ! ກະລຸນາເລືອກວັນທີອື່ນ.` : `⚠️ Date ${selected} is fully booked! Please select another date.`);
      setStartDate('');
      return;
    }
    setStartDate(selected);
    if (endDate && selected > endDate) {
      setEndDate(selected);
    }
  };

  // 📝 ຟັງຊັນບັນທຶກອໍເດີເຂົ້າ Supabase Database ຫາ Admin 100%
  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      return alert(lang === 'la' ? 'ກະລຸນາປ້ອນຊື່ລູກຄ້າ / ບໍລິສັດ' : 'Please enter customer name');
    }

    if (!phone || phone.length < 10) {
      return alert(lang === 'la' ? 'ກະລຸນາປ້ອນເບີໂທໃຫ້ຖືກຕ້ອງ (10-11 ຕົວເລກ, ຕົວຢ່າງ: 02051702676)' : 'Please enter a valid phone number (10-11 digits)');
    }

    if (!startDate) {
      return alert(lang === 'la' ? 'ກະລຸນາເລືອກວັນທີເລີ່ມເຊົ່າ' : 'Please select start date');
    }

    if (bookedDates.includes(startDate)) {
      return alert(lang === 'la' ? `⚠️ ວັນທີ ${startDate} ມີຄິວຈອງເຕັມແລ້ວ! ກະລຸນາເລືອກວັນທີອື່ນ.` : `⚠️ Date ${startDate} is fully booked!`);
    }

    if (cartTotalItems === 0) {
      return alert(lang === 'la' ? 'ກະລຸນາເລືອກອຸປະກອນຢ່າງນ້ອຍ 1 ລາຍການ' : 'Please select at least 1 item');
    }

    setIsSubmitting(true);
    const orderNo = `QUO-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = {
      order_no: orderNo,
      customer_name: customerName,
      phone: phone,
      event_date: startDate,
      total_amount: totalAmount,
      deposit: deposit30,
      balance: balance70,
      status: 'PENDING',
    };

    try {
      const { error } = await supabase
        .from('orders')
        .insert([newOrder]);

      if (error) {
        console.error('Supabase Insert Error:', error);
        alert(`❌ Error sending order to Admin: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      setShowInvoiceModal({
        orderNo,
        customerName,
        phone,
        eventDate: startDate,
        totalAmount,
        deposit30,
        balance70,
      });

      await fetchBookedDates();

    } catch (err: any) {
      console.error('Unexpected Error:', err);
      alert('❌ System connection error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3F0] font-['Noto_Sans_Lao',sans-serif] text-[#3D2B27]">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E8D0C8] px-4 md:px-8 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative overflow-hidden flex items-center justify-center">
            <Image src="/logo.png" alt="Katoups Logo" fill className="object-contain" />
          </div>
          <div>
            <h1 className="font-extrabold text-[#C6936A] text-base leading-none">{t.siteTitle}</h1>
            <p className="text-[10px] text-gray-400 font-bold tracking-tight mt-0.5">{t.siteSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={scrollToQuotation} className="bg-[#8C5345] text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition">
            <span>🛒 {t.cart} ({cartTotalItems})</span>
          </button>

          <button onClick={scrollToQuotation} className="bg-[#C6936A] text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition">
            <span>📄 {t.quotationBtn}</span>
          </button>

          <button onClick={() => setLang(lang === 'la' ? 'en' : 'la')} className="text-xs border border-[#C6936A] bg-[#FAF3F0] text-[#C6936A] font-extrabold px-3 py-1 rounded-full hover:bg-white transition">
            🌐 {lang === 'la' ? 'EN' : 'LA'}
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="w-32 h-32 mx-auto relative overflow-hidden flex items-center justify-center drop-shadow-sm">
            <Image src="/logo.png" alt="Katoups Logo Large" fill className="object-contain" />
          </div>
          <div className="inline-block">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#A36B5E] bg-[#E8D0C8]/40 px-3.5 py-1 rounded-full border border-[#E8D0C8]">
              {t.heroTag}
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#3D2B27]">
            {t.heroTitle} <span className="text-[#C6936A]">{t.siteTitle}</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-500 max-w-2xl mx-auto">
            {t.heroDesc}
          </p>
        </div>

        {/* SECTION ພາບຜົນງານ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8D0C8] pb-2">
            <div>
              <h3 className="text-lg md:text-xl font-black text-[#A36B5E] flex items-center gap-2">
                <span>✨</span> {t.galleryTitle}
              </h3>
              <p className="text-xs text-gray-400 font-bold">{t.gallerySubtitle}</p>
            </div>
            <span className="text-xs font-bold text-[#C6936A] bg-white px-3 py-1 rounded-full border border-[#E8D0C8]">
              {galleryImages.length} {t.works}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {galleryImages.map((g) => (
              <div key={g.id} className="group relative bg-white rounded-3xl overflow-hidden border border-[#E8D0C8] shadow-sm hover:shadow-lg transition duration-300">
                <div className="h-56 sm:h-64 w-full relative bg-[#FAF3F0]">
                  <Image src={g.img} alt={g.title} fill className="object-cover group-hover:scale-105 transition duration-500" onError={(e: any) => { e.target.srcset = '/logo.png'; }} />
                </div>
                <div className="p-3 text-center bg-white border-t border-[#FAF3F0]">
                  <p className="text-xs font-bold text-[#3D2B27]">{g.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION ເມນູເລືອກເຊົ່າ & ຟອມ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="border-b border-[#E8D0C8] pb-2">
              <h3 className="text-lg font-black text-[#8C5345]">🎪 {t.selectEquipment}</h3>
              <p className="text-xs text-gray-400 font-bold">{t.selectDesc}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {stockItems.map((item) => {
                const qty = cart[item.id] || 0;
                return (
                  <div key={item.id} className="bg-white rounded-3xl p-4 border border-[#E8D0C8] shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div className="space-y-3">
                      <div className="h-32 w-full relative bg-[#FAF3F0] rounded-2xl overflow-hidden">
                        <Image src={item.img} alt={item.name} fill className="object-cover" onError={(e: any) => { e.target.srcset = '/logo.png'; }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-[#3D2B27] min-h-[32px]">{item.name}</h3>
                        <p className="text-sm font-extrabold text-[#8C5345] mt-1">{item.price.toLocaleString()} LAK <span className="text-[10px] text-gray-400 font-normal">{t.perDay}</span></p>
                      </div>
                    </div>

                    <div className="mt-4">
                      {qty === 0 ? (
                        <button onClick={() => addToCart(item.id)} className="w-full bg-[#8C5345] text-white text-xs font-bold py-2 rounded-xl hover:opacity-90 transition">
                          {t.addToCart}
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
          </div>

          {/* 📝 ຟອມອອກໃບສະເໜີລາຄາ */}
          <div id="quotation-form" className="bg-white p-6 rounded-3xl border-2 border-[#C6936A] shadow-md h-fit space-y-5 scroll-mt-24">
            <div>
              <h3 className="font-extrabold text-[#8C5345] text-base">{t.quotationFormTitle}</h3>
              <p className="text-xs text-gray-400 font-bold mt-0.5">{t.quotationFormDesc}</p>
            </div>

            <div className="space-y-2 border-y border-[#E8D0C8] py-3 text-xs">
              <div className="flex justify-between font-bold text-gray-500">
                <span>{t.totalItems}</span>
                <span className="text-[#8C5345]">{cartTotalItems} {t.itemsCount}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-500">
                <span>{t.totalRent}</span>
                <span className="text-base font-black text-[#3D2B27]">{totalAmount.toLocaleString()} LAK</span>
              </div>
              <div className="flex justify-between font-bold text-gray-500">
                <span>{t.deposit30}</span>
                <span className="text-[#8C5345]">{deposit30.toLocaleString()} LAK</span>
              </div>
              <div className="flex justify-between font-bold text-gray-500 pt-1 border-t border-dashed">
                <span>{t.balance70}</span>
                <span className="text-[#C6936A] font-extrabold">{balance70.toLocaleString()} LAK</span>
              </div>
            </div>

            <form onSubmit={handleCreateQuotation} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">{t.customerNameLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={t.customerNamePlaceholder}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8C5345]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">{t.phoneLabel}</label>
                <input
                  type="text"
                  required
                  maxLength={11}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  placeholder={t.phonePlaceholder}
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8C5345] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-600 block mb-1">{t.startDateLabel}</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    min={todayMin}
                    onChange={handleStartDateChange}
                    className="w-full border rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-[#8C5345]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-600 block mb-1">{t.endDateLabel}</label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || todayMin}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-[#8C5345]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">{t.locationLabel}</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8C5345]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#8C5345] text-white font-bold py-3 rounded-2xl text-xs hover:opacity-90 transition shadow-md mt-2 flex items-center justify-center gap-1.5 disabled:bg-gray-400"
              >
                <span>{isSubmitting ? t.submittingBtn : t.submitBtn}</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* 📄 MODAL INVOICE */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-[#E8D0C8]">
            <div className="text-center space-y-1">
              <span className="text-2xl">🎉</span>
              <h3 className="text-lg font-black text-[#8C5345]">{t.modalTitle}</h3>
              <p className="text-xs text-gray-400">{t.orderNoLabel} <span className="font-bold text-[#C6936A]">{showInvoiceModal.orderNo}</span></p>
            </div>

            <div className="bg-[#FAF3F0] p-4 rounded-2xl space-y-2 text-xs border border-[#E8D0C8]">
              <div className="flex justify-between"><span>{t.customerLabel}</span><b>{showInvoiceModal.customerName}</b></div>
              <div className="flex justify-between"><span>{t.phoneModalLabel}</span><b>{showInvoiceModal.phone}</b></div>
              <div className="flex justify-between"><span>{t.eventDateLabel}</span><b>{showInvoiceModal.eventDate}</b></div>
              <div className="flex justify-between border-t border-[#E8D0C8] pt-2 text-[#8C5345]"><span>{t.deposit30}</span><b>{showInvoiceModal.deposit30.toLocaleString()} LAK</b></div>
            </div>

            <a
              href={`https://wa.me/8562051702676?text=${encodeURIComponent(`Katoups Service Order: ${showInvoiceModal.orderNo}\nCustomer: ${showInvoiceModal.customerName}\nPhone:${showInvoiceModal.phone}\nDate: ${showInvoiceModal.eventDate}\nTotal:${showInvoiceModal.totalAmount.toLocaleString()} LAK`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full block text-center bg-[#25D366] text-white font-bold py-3 rounded-xl shadow hover:opacity-90 transition text-xs"
            >
              {t.sendWhatsappBtn}
            </a>

            <button onClick={() => setShowInvoiceModal(null)} className="w-full border border-gray-300 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50">
              {t.closeBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}