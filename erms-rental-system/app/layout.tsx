import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ກະຕູບສ໌ ບໍລິການ (Katoups Service) - ເຊົ່າເຕັ້ນ Marquee & ອຸປະກອນງານລ້ຽງ ທ່າແຂກ ຄຳມ່ວນ',
  description: 'ບໍລິການເຊົ່າເຕັ້ນ Marquee ຫຼູຫຼາ, ຊຸດໂຕະຕັ່ງ Tiffany, ພັດລົມໄອເຢັນ, ຫຍ້າທຽມ ແລະ ອຸປະກອນງານລ້ຽງຄົບວົງຈອນ ໃນແຂວງຄຳມ່ວນ.',
  keywords: ['ກະຕູບສ໌', 'Katoups', 'ເຊົ່າເຕັ້ນທ່າແຂກ', 'ເຊົ່າອຸປະກອນງານລ້ຽງ', 'Marquee Tent Laos', 'ເຊົ່າໂຕະຕັ່ງຄຳມ່ວນ'],
  openGraph: {
    title: 'ກະຕູບສ໌ ບໍລິການ (Katoups Service) - ເຊົ່າເຕັ້ນ Marquee & ອຸປະກອນງານລ້ຽງ',
    description: 'ບໍລິການເຊົ່າໂຕະ ຕັ່ງ ເຕັ້ນ, ຊຸດໂຕະຕັ່ງ Tiffany, ພັດລົມໄອເຢັນ, ຫຍ້າທຽມ ຄົບວົງຈອນ.',
    url: 'https://katoups-service.com',
    siteName: 'Katoups Service',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Katoups Service Logo',
      },
    ],
    locale: 'lo_LA',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lo">
      <body>{children}</body>
    </html>
  );
}