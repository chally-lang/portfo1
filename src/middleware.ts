import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about", 
  "/projects", 
  "/blog", 
  "/blog/(.*)",
  "/blogs",
  "/blogs/(.*)",
  "/contact", 
  "/api/blogs", 
  "/api/contact",
  "/api/subscribe",
  "/api/comments",
  "/api/assistant",
  "/api/webhooks/clerk"
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return;
  // Only protect non-public routes
  auth.protect();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}; 