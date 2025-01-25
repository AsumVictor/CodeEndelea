"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type User = {
  email: string
  role: "student" | "instructor"
} | null

type AuthContextType = {
  user: User
  login: (email: string, password: string, role: "student" | "instructor") => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null)
  const router = useRouter()

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (email: string, password: string, role: "student" | "instructor") => {
    // Here you would typically validate credentials with a backend
    // For this example, we'll just set the user directly
    const newUser = { email, role }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    router.push(`/${role}/dashboard`)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

