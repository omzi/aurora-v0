import { withAuth } from 'next-auth/middleware';

export default withAuth({ });

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/public (public API routes)
     * - auth (auth routes)
     * - / (home route)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/public|api/register|auth|_next/static|_next/image|images|assets|favicon.ico).*)'
  ],
};
