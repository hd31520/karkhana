import { NextResponse } from 'next/server';

const ROOT_DOMAIN = process.env.NODE_ENV === 'production' 
  ? 'karkhana.shop' 
  : 'localhost:3000';

const ADMIN_DOMAIN = `admin.${ROOT_DOMAIN}`;

export function middleware(req) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host');

  // Handle local development
  if (!hostname) {
    return NextResponse.next();
  }

  // Handle admin domain
  if (hostname === ADMIN_DOMAIN) {
    url.pathname = `/admin${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Handle tenant subdomains (*.karkhana.shop)
  if (hostname.includes(`.${ROOT_DOMAIN}`) && !hostname.startsWith('www.')) {
    const subdomain = hostname.replace(`.${ROOT_DOMAIN}`, '');
    
    // Skip if it's admin or main domain
    if (subdomain !== 'admin' && subdomain !== 'karkhana') {
      url.pathname = `/${subdomain}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};