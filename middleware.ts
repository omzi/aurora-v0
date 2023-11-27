import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export const middleware = async (request: NextRequest) => {
  const publicRoutes = ['/invoices/view/:invoiceId'];
  const token = await getToken({ req: request });
	const isRootRoute = request.nextUrl.pathname === '/';
  const excludePattern = /^\/(?!api|auth|api\/register|_next\/static|_next\/image|images|assets|favicon.ico|invoices\/view\/[a-zA-Z0-9]{12}).*/;
  
  if (!excludePattern.test(request.nextUrl.pathname) || isRootRoute) {
    return NextResponse.next();
  }

  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    const url = request.nextUrl.clone();
		url.searchParams.set('callbackUrl', url.pathname);
    url.pathname = '/auth/sign-in';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}
