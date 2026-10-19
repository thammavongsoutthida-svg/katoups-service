import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KATOUPS SERVICE - ບໍລິການເຊົ່າອຸປະກອນງານລ້ຽງ',
  description: 'ກະຕູບສ໌ ບໍລິການເຊົ່າເຕັ້ນ, ໂຕະ, ຕັ່ງ ແລະ ອຸປະກອນຈັດງານລ້ຽງ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lo">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FAF3F0] text-[#3D2B27] antialiased">
        {children}
      </body>
    </html>
  );
}