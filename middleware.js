// middleware.js
import constants from './constants/index';
import is from "./utils/is";
import { NextResponse } from 'next/server';

const getCookies = (name, request) => {
  const val = decodeURIComponent(request.cookies.get(name)?.value);
  if (is.null(val) || is.undefined(val) || val == 'undefined') return "";
  return JSON.parse(val || '{}')
}

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = getCookies(constants.CONTEXT_TYPE.TOKEN, request)?.[constants.TOKEN_TYPE.ACCESS] //request.cookies.get(constants.CONTEXT_TYPE.TOKEN)?.value; // Assuming the token is stored in cookies.
  const userInfo = getCookies(constants.CONTEXT_TYPE.USER_INFO, request) //JSON.parse(request.cookies.get(constants.CONTEXT_TYPE.USER_INFO)?.value || '{}');
  // console.log(!token, "role 1");

  //ToDo   (in production, use proper JWT)
  //     const decodeToken = JSON.parse(
  //   Buffer.from(token, "base64").toString("utf-8")
  // );

  // Check if the user is logged in
  if (!token && !(pathname.startsWith("/login") || pathname === "/")) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  const role = userInfo.role
  console.log(!token, "role 2");

  if ((pathname.startsWith("/login") || pathname === "/") && token) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }
    if (role === "employee") {
      if (userInfo.isDefaultPassword) {
        console.log("dfff");

        return NextResponse.redirect(new URL('/employee/profile?acive_tab=settings', request.url))
      }
      return NextResponse.redirect(new URL('/employee/dashboard', request.url))
    }
  }


  // Route protection based on role
  // const requiredRole= ["admin", "employee"];
  // if (pathname.startsWith('/admin') && role !== 'admin') {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  // if (pathname.startsWith('/employe') && requiredRole.includes('employee')) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  return NextResponse.next();
}

// Use this middleware only on specific paths
export const config = {
  matcher: ["/", '/login', '/employee/:path*', '/admin/:path*', "/workspace/:path*"],
};
