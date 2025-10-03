'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/auth-client'

interface UserStats {
  totalCredits: number
  usedCredits: number
  remainingCredits: number
  totalPOs: number
  successRate: number
  activeIntegrations: number
}

interface POHistoryItem {
  id: number
  userId: string
  poNumber: string
  description: string | null
  amount: number
  status: string
  createdAt: string
  updatedAt: string
}

export const useUserData = () => {
  const { data: session } = useSession()
  const user = session?.user

  const [userStats, setUserStats] = useState<UserStats>({
    totalCredits: 0,
    usedCredits: 0,
    remainingCredits: 0,
    totalPOs: 0,
    successRate: 0,
    activeIntegrations: 0
  })
  const [recentPOs, setRecentPOs] = useState<POHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    if (!user) return

    try {
      setLoading(true)
      const token = localStorage.getItem('bearer_token')

      // Fetch user quota
      const quotaResponse = await fetch('/api/user-quotas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      let quotaData = null
      if (quotaResponse.ok) {
        quotaData = await quotaResponse.json()
      }

      // Fetch purchase orders
      const poResponse = await fetch('/api/po-history?limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      let poData: POHistoryItem[] = []
      if (poResponse.ok) {
        poData = await poResponse.json()
      }

      // Fetch Google integrations
      const integrationsResponse = await fetch('/api/google-integrations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      let integrationsData = null
      if (integrationsResponse.ok) {
        integrationsData = await integrationsResponse.json()
      }

      // Calculate stats
      const totalPOs = poData?.length || 0
      const completedPOs = poData?.filter(po => po.status === 'completed').length || 0
      const successRate = totalPOs > 0 ? Math.round((completedPOs / totalPOs) * 100) : 100

      setUserStats({
        totalCredits: quotaData?.monthlyQuota || 10,
        usedCredits: (quotaData?.monthlyQuota || 10) - (quotaData?.remainingCredits || 10),
        remainingCredits: quotaData?.remainingCredits || 10,
        totalPOs,
        successRate,
        activeIntegrations: integrationsData?.isActive ? 1 : 0
      })

      setRecentPOs(poData || [])

    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    userStats,
    recentPOs,
    loading,
    refetch: fetchUserData
  }
}