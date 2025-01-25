"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"

export function ProtectedRoute({
  children,
  requiredRole,
}: { children: React.ReactNode; requiredRole: "student" | "instructor" }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (user.role !== requiredRole) {
      router.push(`/${user.role}/dashboard`)
    }
  }, [user, requiredRole, router])

  if (!user || user.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}

