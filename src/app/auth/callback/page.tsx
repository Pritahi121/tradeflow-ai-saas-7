'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { Loader2, Zap } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending) {
      if (session?.user) {
        // Get redirect URL from query params or default to dashboard
        const redirect = searchParams.get('redirect') || '/dashboard'
        router.push(redirect)
      } else {
        // If no session after loading, redirect to login
        router.push('/login')
      }
    }
  }, [session, isPending, router, searchParams])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="h-16 w-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Zap className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Completing Sign In...
        </h2>
        <p className="text-muted-foreground mb-4">
          Please wait while we set up your account
        </p>
        <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
      </div>
    </div>
  )
}