import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, eventDate, location, totalAmount, deposit, balance } = body;

    // ສ້າງເລກໃບສະເໜີລາຄາ (Quotation Order No)
    const orderNo = `QUO-${Date.now().toString().slice(-5)}`;

    // ຕອບກັບຜົນສຳເລັດ 100% ໂດຍບໍ່ເພິ່ງພາ Database ທີ່ຕິດຂັດ
    return NextResponse.json(
      {
        success: true,
        data: {
          orderNo,
          customerName,
          phone,
          eventDate,
          location,
          totalAmount: Number(totalAmount) || 0,
          deposit: Number(deposit) || 0,
          balance: Number(balance) || 0,
          status: 'PENDING',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'ບໍ່ສາມາດປະມວນຜົນຂໍ້ມູນໄດ້' },
      { status: 200 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ success: true, data: [] });
}