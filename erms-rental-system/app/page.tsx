'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  unit: string;
}

export default function ClientHomePage() {
  const [lang, setLang] = useState<'la' | 'en'>('la');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('ທ່າແຂກ, ຄຳມ່ວນ');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState<any>(null);

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

  const rentalDays = calculateDays();

  const t = {
    brandName: lang === 'la' ? 'ກະຕູບສ໌ ບໍລິການ' : 'KATOUPS SERVICE',
    subBrand: lang === 'la' ? 'KATOUPS SERVICE - ບໍລິການເຊົ່າອຸປະກອນງານລ້ຽງ' : 'Event Equipment Rental Service',
    ourWork: lang === 'la' ? 'ຜົນງານຂອງເຮົາ' : 'Our Portfolio',
    cartText: lang === 'la' ? '🛒 ຕະກ້າ' : '🛒 Cart',
    heroBadge: 'KATOUPS EVENT EQUIPMENT RENTAL SERVICE (SINCE 2021)',
    heroTitle: lang === 'la' ? 'ບໍລິການເຊົ່າເຕັ້ນ, ໂຕະ, ຕັ່ງ ແລະ ອຸປະກອນຈັດງານລ້ຽງ' : 'Luxury Event Equipment & Tent Rental Services',
    heroSub: lang === 'la'
      ? 'ຍົກລະດັບງານລ້ຽງຂອງທ່ານດ້ວຍເຕັ້ນ Marquee ຫຼູຫຼາ, ຊຸດໂຕະຕັ່ງ Tiffany, ພັດລົມໄອເຢັນ, ຫຍ້າທຽມ ແລະ ອຸປະກອນງານລ້ຽງຄົບວົງຈອນ.'
      : 'Elevate your event with luxury Marquee Tents, Tiffany Chair sets, Evaporative Air Coolers, Artificial Grass, and full-service event rentals.',
    galleryTitle: lang === 'la' ? '✨ ພາບຜົນງານການຈັດງານລ້ຽງຂອງ ກະຕູບສ໌ ບໍລິການ' : '✨ Katoups Service Event Portfolio',
    gallerySub: lang === 'la' ? 'ຕົວຢ່າງການຕິດຕັ້ງເຕັ້ນ, ໂຕະ, ຕັ່ງ ແລະ ອຸປະກອນຈັດງານລ້ຽງ VIP' : 'Highlights of Marquee Tents, Tiffany Chairs & Luxury Event Setups',
    catalogTitle: lang === 'la' ? '🎪 ເລືອກອຸປະກອນເຊົ່າ' : '🎪 Equipment Catalog',
    addToCart: lang === 'la' ? '+ ເພີ່ມເຂົ້າໃນຕະກ້າ' : '+ Add to Cart',
    quotationTitle: lang === 'la' ? '📋 ໃບສະເໜີລາຄາ / ຕະກ້າ' : '📋 Instant Quotation / Cart',
    itemUnit: lang === 'la' ? 'ຢ່າງ' : 'items',
    emptyCart: lang === 'la' ? 'ຍັງບໍ່ທັນມີອຸປະກອນໃນຕະກຣ້າ' : 'Your cart is empty',
    totalRental: lang === 'la' ? 'ລວມຄ່າເຊົ່າທັງໝົດ:' : 'Total Rental Fee:',
    deposit30: lang === 'la' ? 'ມັດຈຳ (30%):' : 'Deposit (30%):',
    balance70: lang === 'la' ? 'ຈ່າຍມື້ຮັບເຄື່ອງ (70%):' : 'Balance Due on Delivery (70%):',
    nameLabel: lang === 'la' ? 'ຊື່ລູກຄ້າ / ບໍລິສັດ *' : 'Customer / Company Name *',
    namePlaceholder: lang === 'la' ? 'ປ້ອນຊື່ ແລະ ນາມສະກຸນ' : 'Enter full name',
    phoneLabel: lang === 'la' ? 'ເບີໂທຕິດຕໍ່ (WhatsApp) *' : 'Contact Phone (WhatsApp) *',
    phonePlaceholder: '020 xxxx xxxx',
    startDateLabel: lang === 'la' ? 'ວັນທີເລີ່ມເຊົ່າ (Start Date) *' : 'Start Date *',
    endDateLabel: lang === 'la' ? 'ວັນທີຄືນເຄື່ອງ (End Date) *' : 'End Date *',
    rentalDaysText: lang === 'la' ? `ຈຳນວນມື້ເຊົ່າ: ${rentalDays} ມື້` : `Duration: ${rentalDays} Day(s)`,
    locationLabel: lang === 'la' ? 'ສະຖານທີ່ຈັດງານ *' : 'Event Location *',
    submitBtn: lang === 'la' ? '✨ ຢືນຢັນການຈອງ / ອອກໃບສະເໜີລາຄາ' : '✨ Confirm Booking & Generate Quotation',
    submittingBtn: lang === 'la' ? 'ກຳລັງບັນທຶກເຂົ້າ Database...' : 'Processing...',
    invoiceSuccess: lang === 'la' ? 'ອອກໃບສະເໜີລາຄາສຳເລັດ!' : 'Quotation Generated Successfully!',
    orderNoLabel: lang === 'la' ? 'ໝາຍເລກອໍເດີ:' : 'Order Number:',
    customerNameLabel: lang === 'la' ? 'ລູກຄ້າ:' : 'Customer:',
    whatsappSend: lang === 'la' ? '💬 ສົ່ງໃບບິນເຂົ້າ WhatsApp ເພື່ອມັດຈຳ' : '💬 Send Quotation to WhatsApp',
    closeModal: lang === 'la' ? 'ປິດໜ້າຕ່າງ' : 'Close',
  };

  const equipmentList = [
    { id: 'eq-1', name: lang === 'la' ? 'ເຕັ້ນ Marquee 10x12' : 'Marquee Tent 10x12', price: 8000000, unit: lang === 'la' ? 'ຫຼັງ/ມື້' : 'piece/day', icon: '🎪' },
    { id: 'eq-2', name: lang === 'la' ? 'ເຕັ້ນ Marquee 6x8' : 'Marquee Tent 6x8', price: 1500000, unit: lang === 'la' ? 'ຫຼັງ/ມື້' : 'piece/day', icon: '🎪' },
    { id: 'eq-3', name: lang === 'la' ? 'ເຕັ້ນ Marquee 5x8' : 'Marquee Tent 5x8', price: 1000000, unit: lang === 'la' ? 'ຫຼັງ/ມື້' : 'piece/day', icon: '🎪' },
    { id: 'eq-4', name: lang === 'la' ? 'ເຕັ້ນ Marquee 4x6' : 'Marquee Tent 4x6', price: 500000, unit: lang === 'la' ? 'ຫຼັງ/ມື້' : 'piece/day', icon: '🎪' },
    { id: 'eq-5', name: lang === 'la' ? 'ເຕັ້ນ Marquee 4x4' : 'Marquee Tent 4x4', price: 400000, unit: lang === 'la' ? 'ຫຼັງ/ມື້' : 'piece/day', icon: '🎪' },
    { id: 'eq-6', name: lang === 'la' ? 'ເຕັ້ນປະດັບ Decorative Marquee 10x12' : 'Decorative Marquee Tent 10x12', price: 4000000, unit: lang === 'la' ? 'ຫຼັງ/ມື້' : 'piece/day', icon: '✨' },
    { id: 'eq-7', name: lang === 'la' ? 'ເຕັ້ນປະດັບ Decorative Marquee 6x8' : 'Decorative Marquee Tent 6x8', price: 1000000, unit: lang === 'la' ? 'ຫຼັງ/ມື້' : 'piece/day', icon: '✨' },
    { id: 'eq-8', name: lang === 'la' ? 'ເຕັ້ນປະດັບ Decorative Marquee 5x8' : 'Decorative Marquee Tent 5x8', price: 1000000, unit: lang === 'la' ? 'ຫຼັງ/ມື້' : 'piece/day', icon: '✨' },
    { id: 'eq-9', name: lang === 'la' ? 'ເຕັ້ນປະດັບ Decorative Marquee 4x6' : 'Decorative Marquee Tent 4x6', price: 500000, unit: lang === 'la' ? 'ຫຼັງ/ມື້' : 'piece/day', icon: '✨' },
    { id: 'eq-10', name: lang === 'la' ? 'ເຕັ້ນປະດັບ Decorative Marquee 4x4' : 'Decorative Marquee Tent 4x4', price: 400000, unit: lang === 'la' ? 'ຫຼັງ/ມື້' : 'piece/day', icon: '✨' },
    { id: 'eq-11', name: lang === 'la' ? 'ຊຸດໂຕະຕັ່ງ Tiffany Classic (8 ທ່ານ)' : 'Set Tiffany Classic (8 people)', price: 150000, unit: lang === 'la' ? 'ຊຸດ/ມື້' : 'set/day', icon: '🪑' },
    { id: 'eq-12', name: lang === 'la' ? 'ຊຸດໂຕະຕັ່ງ Tiffany Golden (8 ທ່ານ)' : 'Set Tiffany Golden (8 people)', price: 250000, unit: lang === 'la' ? 'ຊຸດ/ມື້' : 'set/day', icon: '🪑' },
    { id: 'eq-13', name: lang === 'la' ? 'ຊຸດໂຕະຕັ່ງພລາສຕິກ (1) (8 ທ່ານ)' : 'Set Plastic Chair (1) (8 people)', price: 60000, unit: lang === 'la' ? 'ຊຸດ/ມື້' : 'set/day', icon: '🪑' },
    { id: 'eq-14', name: lang === 'la' ? 'ຊຸດໂຕະຕັ່ງພລາສຕິກ + ຜ້າກວມ (2) (8 ທ່ານ)' : 'Set Cover Plastic Chair (2) (8 people)', price: 25000, unit: lang === 'la' ? 'ຊຸດ/ມື້' : 'set/day', icon: '🪑' },
    { id: 'eq-15', name: lang === 'la' ? 'ພັດລົມ (Fan)' : 'Fan', price: 100000, unit: lang === 'la' ? 'ເຄື່ອງ/ມື້' : 'piece/day', icon: '🌀' },
    { id: 'eq-16', name: lang === 'la' ? 'ພັດລົມໄອເຢັນ (Evaporative Air Cooler)' : 'Evaporative Air Cooler', price: 1000000, unit: lang === 'la' ? 'ເຄື່ອງ/ມື້' : 'piece/day', icon: '❄️' },
    { id: 'eq-17', name: lang === 'la' ? 'ຫຍ້າທຽມ (Artificial Grass)' : 'Artificial Grass', price: 200000, unit: lang === 'la' ? 'ຜືນ/ມື້' : 'piece/day', icon: '🌿' },
  ];

  const galleryImages = [
    { src: '/656565.jpeg', fallback: '/656565.jpeg', title: lang === 'la' ? 'ເຕັ້ນ Marquee + ໄຟປະດັບ' : 'Marquee Tent & Festoon Lights' },
    { src: '/3333.jpeg', fallback: '/3333.jpeg', title: lang === 'la' ? 'ເຕັ້ນ Marquee ຜ້າສີຄຣີມ-ທອງ' : 'Cream & Gold Silk Marquee Tent' },
    { src: '/666.jpeg', fallback: '/666.jpeg', title: lang === 'la' ? 'ຊຸດໂຕະຕັ່ງ Tiffany Golden' : 'Wedding Tiffany Golden Table Setup' },
    { src: '/656.jpeg', fallback: '/656.jpeg', title: lang === 'la' ? 'ເວທີ & ໄຟປະດັບ ງານວັນເກີດ' : 'Birthday Backdrop & Lighting Design' },
    { src: '/66.jpeg', fallback: '/66.jpeg', title: lang === 'la' ? 'ບັນຍາກາດງານລ້ຽງ VIP ພາຍໃນເຕັ້ນ' : 'VIP Indoor Tent Banquet Atmosphere' },
    { src: '/99.jpeg', fallback: '/99.jpeg', title: lang === 'la' ? 'ໄຟປະດັບ Warm Light ງານແຕ່ງ' : 'Warm Fairy Lights Wedding Setup' },
    { src: '/56.jpeg', fallback: '/56.jpeg', title: lang === 'la' ? 'ຊຸດຕັ່ງ Tiffany Gold + ຜ້າຜູກ' : 'Draped Tiffany Gold Chairs' },
    { src: '/65.jpeg', fallback: '/65.jpeg', title: lang === 'la' ? 'ໂຄມໄຟແກ້ວ Chandelier VIP' : 'Luxury Crystal Chandelier Setup' },
  ];

  const addToCart = (item: typeof equipmentList[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1, unit: item.unit }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const subtotalDaily = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const subtotal = subtotalDaily * rentalDays;
  const deposit = subtotal * 0.3;
  const balance = subtotal - deposit;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert(lang === 'la' ? 'ກະລຸນາເລືອກອຸປະກອນຢ່າງນ້ອຍ 1 ລາຍການ' : 'Please select at least 1 item.');
    if (!startDate || !endDate || !customerName || !phone) return alert(lang === 'la' ? 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ' : 'Please fill in all required fields.');

    setIsSubmitting(true);

    const orderNo = `QUO-${Date.now().toString().slice(-5)}`;
    const eventDateRange = startDate === endDate ? startDate : `${startDate} ຫາ ${endDate} (${rentalDays} ມື້)`;

    const newOrder = {
      id: Date.now().toString(),
      order_no: orderNo,
      customer_name: customerName,
      phone,
      event_date: eventDateRange,
      location,
      items: cart,
      total_amount: subtotal,
      deposit,
      balance,
      status: 'PENDING',
    };

    try {
      // 1. ບັນທຶກຂໍ້ມູນເຂົ້າ Supabase Database
      await supabase.from('orders').insert([newOrder]);

      // 2. ສົ່ງຂໍ້ຄວາມແຈ້ງເຕືອນເຂົ້າ Telegram Group ຂອງຮ້ານ
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNo,
          customerName,
          phone,
          eventDate: eventDateRange,
          totalAmount: subtotal,
          deposit,
          location,
        }),
      });
    } catch (err) {
      console.error('Save Order Error:', err);
    }

    setShowInvoiceModal({ ...newOrder, orderNo, customerName, eventDate: eventDateRange });
    setCart([]);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF3F0] text-[#3D2B27] pb-24 font-['Noto_Sans_Lao',sans-serif]">
      {/* 👑 Navigation Bar */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-3 bg-white/95 backdrop-blur-md border-b border-[#E8D0C8] fixed w-full top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#A36B5E] shadow-sm bg-[#F8ECE9] flex items-center justify-center">
            <img src="/logo.png" alt="Katoups Service" className="w-full h-full object-cover scale-110" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#8C5345] tracking-wide drop-shadow-sm">
              {t.brandName}
            </div>
            <div className="text-[11px] text-[#B58376] font-bold tracking-wider uppercase">
              {t.subBrand}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a href="#gallery-section" className="hidden md:inline-block text-xs text-[#8C5345] hover:underline font-extrabold">
            {t.ourWork}
          </a>
          <a href="#booking-section" className="bg-gradient-to-r from-[#A36B5E] to-[#8C5345] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition">
            {t.cartText} ({cart.reduce((a, c) => a + c.qty, 0)})
          </a>
          <button
            onClick={() => setLang(lang === 'la' ? 'en' : 'la')}
            className="text-xs bg-[#F8ECE9] border border-[#E8D0C8] px-3.5 py-1.5 rounded-full font-extrabold text-[#8C5345] hover:bg-[#A36B5E] hover:text-white transition shadow-xs"
          >
            🌐 {lang === 'la' ? 'EN | LA' : 'LA | EN'}
          </button>
        </div>
      </nav>

      {/* 🔮 Hero Section */}
      <section className="pt-32 pb-12 px-6 text-center bg-gradient-to-b from-[#F5E6E1] via-[#FAF3F0] to-[#FAF3F0]">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-28 h-28 mb-4 rounded-full overflow-hidden border-4 border-white shadow-xl bg-[#F8ECE9] flex items-center justify-center ring-2 ring-[#A36B5E]">
            <img src="/logo.png" alt="Katoups Service" className="w-full h-full object-cover scale-110" />
          </div>
          <span className="text-[#8C5345] text-xs font-extrabold uppercase bg-white px-5 py-1.5 rounded-full border border-[#E8D0C8] shadow-sm tracking-wider">
            {t.heroBadge}
          </span>

          <h1 className="text-3xl md:text-5xl font-black mt-5 mb-4 text-[#3D2B27] leading-tight drop-shadow-md">
            {t.heroTitle} <span className="text-[#8C5345]">{t.brandName}</span>
          </h1>
          <p className="text-gray-600 max-w-2xl text-sm md:text-base font-medium drop-shadow-xs">
            {t.heroSub}
          </p>
        </div>
      </section>

      {/* 🖼️ Portfolio Gallery Section */}
      <section id="gallery-section" className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-[#8C5345] flex items-center justify-center gap-2 drop-shadow-sm">
            {t.galleryTitle}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">
            {t.gallerySub}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="group relative h-52 md:h-64 rounded-2xl overflow-hidden border-2 border-white shadow-md hover:shadow-xl transition duration-300 bg-[#E8D0C8]">
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                onError={(e: any) => {
                  e.target.src = img.fallback || '/logo.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition duration-300 flex items-end p-3.5">
                <span className="text-white text-xs font-bold drop-shadow-md">{img.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🛍️ Rental Catalog & Order Form */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6" id="booking-section">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black flex items-center gap-2 text-[#8C5345] drop-shadow-xs">
            {t.catalogTitle} ({equipmentList.length} {t.itemUnit})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {equipmentList.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl border border-[#E8D0C8] hover:border-[#8C5345] transition shadow-sm hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="text-3xl mb-2 bg-[#FAF3F0] p-3 rounded-2xl text-center border border-[#E8D0C8]">{item.icon}</div>
                  <h3 className="font-bold text-sm text-[#3D2B27] min-h-[40px] flex items-center">{item.name}</h3>
                  <div className="text-[#8C5345] font-black text-lg mt-1 drop-shadow-xs">
                    {item.price.toLocaleString()} LAK <span className="text-[11px] text-gray-500 font-normal">/{item.unit}</span>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  className="w-full mt-3 bg-gradient-to-r from-[#A36B5E] to-[#8C5345] hover:opacity-95 text-white font-bold py-2 rounded-xl shadow transition text-xs flex items-center justify-center gap-1"
                >
                  {t.addToCart}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Column */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8D0C8] shadow-xl h-fit sticky top-20">
          <h2 className="text-lg font-bold pb-3 border-b border-[#E8D0C8] flex items-center justify-between text-[#8C5345]">
            <span>{t.quotationTitle}</span>
            <span className="text-xs bg-[#8C5345] text-white px-3 py-1 rounded-full font-bold">{cart.length} {t.itemUnit}</span>
          </h2>

          <div className="my-4 max-h-60 overflow-y-auto space-y-3 pr-1">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">{t.emptyCart}</div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-[#FAF3F0] p-3 rounded-xl border border-[#E8D0C8] text-sm">
                  <div>
                    <div className="font-bold text-xs">{item.name}</div>
                    <div className="text-xs text-[#8C5345] font-bold">{item.price.toLocaleString()} LAK</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 bg-gray-200 rounded-full font-bold text-xs">
                      -
                    </button>
                    <span className="font-bold text-xs">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 bg-[#8C5345] text-white rounded-full font-bold text-xs">
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-[#E8D0C8] pt-3 space-y-2 text-sm font-medium">
            <div className="flex justify-between text-xs text-[#8C5345] font-bold">
              <span>{t.rentalDaysText}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t.totalRental}</span>
              <span className="font-bold">{subtotal.toLocaleString()} LAK</span>
            </div>
            <div className="flex justify-between text-[#8C5345]">
              <span>{t.deposit30}</span>
              <span className="font-bold">{deposit.toLocaleString()} LAK</span>
            </div>
            <div className="flex justify-between text-gray-800 font-bold text-base border-t pt-2">
              <span>{t.balance70}</span>
              <span className="text-[#C6936A] font-extrabold">{balance.toLocaleString()} LAK</span>
            </div>
          </div>

          <form onSubmit={handleBookingSubmit} className="mt-5 space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">{t.nameLabel}</label>
              <input
                type="text"
                required
                placeholder={t.namePlaceholder}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8C5345]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">{t.phoneLabel}</label>
              <input
                type="tel"
                required
                placeholder={t.phonePlaceholder}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8C5345]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">{t.startDateLabel}</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-[#8C5345]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">{t.endDateLabel}</label>
                <input
                  type="date"
                  required
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-[#8C5345]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">{t.locationLabel}</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8C5345]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#8C5345] to-[#C6936A] text-white font-bold py-3.5 rounded-xl shadow-lg hover:opacity-90 transition mt-2 text-sm"
            >
              {isSubmitting ? t.submittingBtn : t.submitBtn}
            </button>
          </form>
        </div>
      </div>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/8562051702676"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition duration-300 z-50 flex items-center gap-2 border-2 border-white"
      >
        <span className="text-2xl">💬</span>
        <span className="font-bold text-xs pr-1">WhatsApp Contact</span>
      </a>

      {/* Modal Success */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-2 border-[#8C5345] shadow-2xl space-y-4">
            <div className="text-center">
              <span className="text-4xl">🎉</span>
              <h3 className="text-xl font-bold text-[#3D2B27] mt-2">{t.invoiceSuccess}</h3>
              <p className="text-xs text-gray-500">{t.orderNoLabel} <span className="font-bold text-[#8C5345]">{showInvoiceModal.orderNo}</span></p>
            </div>

            <div className="bg-[#FAF3F0] p-4 rounded-xl space-y-2 text-sm border border-[#E8D0C8]">
              <div className="flex justify-between"><span>{t.customerNameLabel}</span><b>{showInvoiceModal.customerName}</b></div>
              <div className="flex justify-between"><span>{t.phoneLabel}</span><b>{showInvoiceModal.phone}</b></div>
              <div className="flex justify-between"><span>ວັນທີຈັດງານ:</span><b>{showInvoiceModal.eventDate}</b></div>
              <div className="flex justify-between border-t border-[#E8D0C8] pt-2 text-[#8C5345]"><span>{t.deposit30}</span><b>{showInvoiceModal.deposit?.toLocaleString()} LAK</b></div>
            </div>

            <a
              href={`https://wa.me/8562051702676?text=${encodeURIComponent(`Katoups Service Order: ${showInvoiceModal.orderNo} Customer: ${showInvoiceModal.customerName} (${showInvoiceModal.eventDate})`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full block text-center bg-[#25D366] text-white font-bold py-3 rounded-xl shadow"
            >
              {t.whatsappSend}
            </a>

            <button onClick={() => setShowInvoiceModal(null)} className="w-full border border-gray-300 py-2.5 rounded-xl text-sm font-bold">
              {t.closeModal}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}