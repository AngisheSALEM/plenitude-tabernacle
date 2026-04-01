"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface UseAuthOptions {
  required?: boolean
  adminOnly?: boolean
  redirectTo?: string
}

export function useAuth({
  required = false,
  adminOnly = false,
  redirectTo = "/connexion",
}: UseAuthOptions = {}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"
  const isUnauthenticated = status === "unauthenticated"
  const isAdmin = session?.user?.role === "ADMIN"

  useEffect(() => {
    if (isLoading) return
    if (required && isUnauthenticated) {
      router.push(redirectTo)
      return
    }
    if (adminOnly && isAuthenticated && !isAdmin) {
      router.push("/espace-membre")
    }
  }, [isLoading, isAuthenticated, isUnauthenticated, required, adminOnly, isAdmin, redirectTo, router])

  return {
    session,
    status,
    user: session?.user,
    isLoading,
    isAuthenticated,
    isUnauthenticated,
    isAdmin,
  }
}
