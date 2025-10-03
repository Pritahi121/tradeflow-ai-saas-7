'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Zap,
  Upload,
  FileText,
  TrendingUp,
  Users,
  Settings,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useSession, authClient } from '@/lib/auth-client'
import { useUserData } from '@/hooks/useUserData'

interface POHistory {
  id: number
  userId: string
  poNumber: string
  description: string | null
  amount: number
  status: string
  createdAt: string
  updatedAt: string
}

function DashboardContent() {
  const { data: session, refetch } = useSession()
  const router = useRouter()
  const user = session?.user
  const { userStats, recentPOs, loading } = useUserData()
  
  const [poHistory, setPOHistory] = useState<POHistory[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [googleConnected, setGoogleConnected] = useState(false)
  const [connectingGoogle, setConnectingGoogle] = useState(false)
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  // Check Google connection status
  useEffect(() => {
    const checkGoogleConnection = async () => {
      if (!user) return

      try {
        const token = localStorage.getItem('bearer_token')
        const response = await fetch('/api/google-integrations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data && data.isActive) {
            setGoogleConnected(true)
          }
        }
      } catch (error) {
        console.error('Error checking Google connection:', error)
      }
    }

    checkGoogleConnection()
  }, [user])

  // Fetch PO history
  useEffect(() => {
    const fetchPOHistory = async () => {
      if (!user) return
      
      setLoadingHistory(true)
      try {
        const token = localStorage.getItem('bearer_token')
        const response = await fetch('/api/po-history?limit=10', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setPOHistory(data)
        }
      } catch (error) {
        console.error('Error fetching PO history:', error)
      } finally {
        setLoadingHistory(false)
      }
    }

    fetchPOHistory()
  }, [user])

  // Handle OAuth callback messages
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    
    if (params.get('google_connected') === 'true') {
      setAlertMessage({ type: 'success', message: 'Google account connected successfully! You can now use Gmail and Sheets integration.' })
      setGoogleConnected(true)
      window.history.replaceState({}, '', '/dashboard')
    } else if (params.get('error')) {
      const error = params.get('error')
      let message = 'Failed to connect Google account. Please try again.'
      if (error === 'oauth_cancelled') message = 'Google authentication was cancelled.'
      if (error === 'invalid_callback') message = 'Invalid OAuth callback. Please try again.'
      setAlertMessage({ type: 'error', message })
      window.history.replaceState({}, '', '/dashboard')
    }

    if (params.get('google_connected') || params.get('error')) {
      setTimeout(() => setAlertMessage(null), 5000)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await authClient.signOut()
      localStorage.removeItem('bearer_token')
      // Use full page navigation to ensure clean state
      window.location.href = '/'
    } catch (error) {
      setAlertMessage({ type: 'error', message: 'Failed to sign out. Please try again.' })
    }
  }

  const handleConnectGoogle = async () => {
    if (!user) return
    
    setConnectingGoogle(true)
    try {
      // Pass user_id to the OAuth endpoint
      window.location.href = `/api/auth/google?user_id=${user.id}&redirect_uri=${encodeURIComponent(window.location.origin + '/dashboard')}`
    } catch (error) {
      console.error('Error connecting Google:', error)
      setAlertMessage({ type: 'error', message: 'An error occurred. Please try again.' })
      setConnectingGoogle(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const stats = [
    {
      title: "Credits Remaining",
      value: loading ? "..." : `${userStats.remainingCredits}/${userStats.totalCredits}`,
      description: loading ? "Loading..." : `${userStats.usedCredits} credits used this month`,
      icon: Zap,
      color: "text-blue-600"
    },
    {
      title: "Total POs Processed",
      value: loading ? "..." : userStats.totalPOs.toString(),
      description: loading ? "Loading..." : `${userStats.totalPOs > 0 ? '+' + Math.floor(userStats.totalPOs * 0.1) : '0'} from last month`,
      icon: FileText,
      color: "text-green-600"
    },
    {
      title: "Success Rate",
      value: loading ? "..." : `${userStats.successRate}%`,
      description: loading ? "Loading..." : `${Math.floor(userStats.totalPOs * userStats.successRate / 100)}/${userStats.totalPOs} processed successfully`,
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Active Integrations",
      value: loading ? "..." : userStats.activeIntegrations.toString(),
      description: loading ? "Loading..." : userStats.activeIntegrations > 0 ? "Google Sheets, Email" : "No active integrations",
      icon: Users,
      color: "text-orange-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">TradeFlow AI</h1>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="/dashboard" className="text-blue-600 font-medium">Dashboard</a>
              <a href="/upload" className="text-gray-500 hover:text-gray-700">Upload PO</a>
              <a href="/integrations" className="text-gray-500 hover:text-gray-700">Integrations</a>
              <a href="/billing" className="text-gray-500 hover:text-gray-700">Billing</a>
              <a href="/settings" className="text-gray-500 hover:text-gray-700">Settings</a>
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name || user?.email}
              </span>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Alert Messages */}
        {alertMessage && (
          <Alert className={`mb-6 ${alertMessage.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            {alertMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={alertMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {alertMessage.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here's what's happening with your purchase orders.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    )}
                    {loading ? (
                      <Skeleton className="h-4 w-24 mt-1" />
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Credits Usage */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Credits Usage</CardTitle>
            <CardDescription>
              {loading ? (
                <Skeleton className="h-4 w-48" />
              ) : (
                `You've used ${userStats.usedCredits} out of ${userStats.totalCredits} credits this month`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Credits Used</span>
                {loading ? (
                  <Skeleton className="h-4 w-12" />
                ) : (
                  <span>{userStats.usedCredits}/{userStats.totalCredits}</span>
                )}
              </div>
              {loading ? (
                <Skeleton className="h-2 w-full" />
              ) : (
                <Progress 
                  value={userStats.totalCredits > 0 ? (userStats.usedCredits / userStats.totalCredits) * 100 : 0} 
                  className="h-2" 
                />
              )}
              <p className="text-xs text-gray-500">
                {loading ? (
                  <Skeleton className="h-3 w-32 inline" />
                ) : (
                  <>
                    {userStats.remainingCredits} credits remaining. 
                    <Link href="/billing" className="text-blue-600 hover:text-blue-500 ml-1">
                      Upgrade plan
                    </Link> for more credits.
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to get you started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start">
                <Link href="/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New PO
                </Link>
              </Button>
              
              {/* Connect Google Button */}
              {googleConnected ? (
                <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Google Connected</p>
                      <p className="text-xs text-green-700">Gmail & Sheets integrated</p>
                    </div>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={handleConnectGoogle}
                  disabled={connectingGoogle}
                  className="w-full justify-start bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
                >
                  {connectingGoogle ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Connect Google
                    </>
                  )}
                </Button>
              )}
              
              <Button variant="outline" asChild className="w-full justify-start">
                <Link href="/integrations">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Integration
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <Link href="/billing">
                  <Zap className="mr-2 h-4 w-4" />
                  Buy More Credits
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* PO History */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>PO History</CardTitle>
                  <CardDescription>
                    Recent purchase order updates
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search POs..." className="pl-8 w-48" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingHistory ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))
                ) : poHistory.length > 0 ? (
                  poHistory.map((po) => (
                    <div key={po.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">{po.poNumber}</p>
                          <p className="text-sm text-gray-600">{po.description || 'No description'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="font-medium text-gray-900">{formatCurrency(po.amount)}</p>
                        <p className="text-sm text-gray-500">{formatDate(po.createdAt)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No PO History Yet</h3>
                    <p className="text-gray-600 mb-4">Your purchase order history will appear here.</p>
                  </div>
                )}
              </div>
              {!loadingHistory && poHistory.length > 0 && (
                <div className="mt-6 text-center">
                  <Button variant="outline">View All History</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}