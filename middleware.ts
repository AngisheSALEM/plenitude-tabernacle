import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/espace-membre", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        if (pathname.startsWith("/admin")) return !!token
        if (pathname.startsWith("/espace-membre")) return !!token
        if (pathname.startsWith("/profil")) return !!token
        if (pathname.startsWith("/parametres")) return !!token
        return true
      },
    },
    pages: {
      signIn: "/connexion",
    },
  }
)

export const config = {
  matcher: [
    "/espace-membre/:path*",
    "/profil/:path*",
    "/admin/:path*",
    "/parametres/:path*",
  ],
}
