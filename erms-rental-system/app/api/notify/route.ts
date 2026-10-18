import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderNo, customerName, phone, eventDate, totalAmount, deposit, location } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json({ success: false, message: 'Missing Bot Token/Chat ID' }, { status: 400 });
    }

    const message = `🔔 *ມີອໍເດີ້ຈອງໃໝ່ຈ້າ!* (ກະຕູບສ໌ ບໍລິການ)\n\n` +
      `📋 *ໝາຍເລກອໍເດີ:* \`${orderNo}\`\n` +
      `👤 *ລູກຄ້າ:* ${customerName}\n` +
      `📞 *ເບີໂທ:* ${phone}\n` +
      `📅 *ວັນທີຈັດງານ:* ${eventDate}\n` +
      `📍 *ສະຖານທີ່:* ${location || 'ທ່າແຂກ, ຄຳມ່ວນ'}\n` +
      `💰 *ຍອດລວມ:* ${Number(totalAmount).toLocaleString()} LAK\n` +
      `💵 *ມັດຈຳ (30%):* ${Number(deposit).toLocaleString()} LAK`;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Telegram Notify Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}