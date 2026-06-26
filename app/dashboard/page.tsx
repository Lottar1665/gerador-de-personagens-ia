"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged, signOut, type User } from "firebase/auth"
import { use } from "react"

import { auth } from "@/lib/firebase"
import { isAdminEmail } from "@/lib/auth"
import { AuthScreen } from "@/components/auth-screen"
import { Dashboard } from "@/components/componentDashboard"
import { AdminDashboard } from "@/components/admin-dashboard"

const VALID_TABS = ["dashboard", "community", "meus"] as const

type TabValue = (typeof VALID_TABS)[number]

export default function DashboardPage({ searchParams }: { searchParams: Promise<{ tab?: string }> })
{
  const params = use(searchParams) 
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const initialTab = VALID_TABS.includes((params?.tab || "") as TabValue)
    ? (params?.tab as TabValue)
    : "generate"

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const handleLogout = async () => {
    if (!auth) return
    await signOut(auth)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Carregando autenticação...
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  if (isAdminEmail(user.email)) {
    return <AdminDashboard user={user} onLogout={handleLogout} />
  }

  return <Dashboard user={user} onLogout={handleLogout} initialTab={initialTab} />
}
