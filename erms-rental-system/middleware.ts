import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🔒 ກວດສອບຄວາມຮັກສາຄວາມປອດໄພໜ້າ /admin
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const mongkhonSession = request.cookies.get('mongkhon_admin_session');
    const katoupsSession = request.cookies.get('katoups_admin_session');

    // ຖ້າບໍ່ມີ session ທັງສອງຢ່າງ ຫຼື session ບໍ່ແມ່ນ authenticated ໃຫ້ redirect ໄປໜ້າ login
    const isAuth =
      (mongkhonSession && mongkhonSession.value === 'authenticated') ||
      (katoupsSession && katoupsSession.value === 'authenticated');

    if (!isAuth) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};