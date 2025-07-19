// middleware.js
import constants from './constants/index';
import { NextResponse } from 'next/server';

export default function middleware(request) {
     const { pathname } = request.nextUrl;
  const token = request.cookies.get(constants.TOKEN_TYPE.ACCESS)?.value; // Assuming the token is stored in cookies.
    const userInfo = JSON.parse(request.cookies.get('userInfo')?.value|| '{}');

  // Check if the user is logged in
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
//ToDo   (in production, use proper JWT)
//     const decodeToken = JSON.parse(
//   Buffer.from(token, "base64").toString("utf-8")
// );
const role = userInfo.role

if (pathname.startsWith("/login" || "/" ) && token) {
    if (role==="admin") {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    if (role==="employee") {
        return NextResponse.redirect(new URL('/employee/dashboard', request.url))
    }
}
  // Route protection based on role
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname.startsWith('/employe') && role !== 'employee') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next();
}

// Use this middleware only on specific paths
export const config = {
  matcher: ['/login', '/employee/:path*', '/admin/:path*', "/workspace/:path*"],
};
