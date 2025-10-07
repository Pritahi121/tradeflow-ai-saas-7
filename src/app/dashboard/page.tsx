'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, authClient } from '@/lib/auth-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Zap,
  FileText,
  TrendingUp,
  Settings,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  FileSpreadsheet
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface POHistoryItem {
  po_number: string
  vendor_name: string
  amount: number
  status: string
  date: string
}

interface DashboardData {
  po_history: POHistoryItem[]
  user_quotas: {
    total_credits: number
    used_credits: number
    remaining_credits: number
  }
  integrations: {
    gmail_connected: boolean
    sheets_connected: boolean
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [googleConnected, setGoogleConnected] = useState(false)
  const [connectingGoogle, setConnectingGoogle] = useState(false)
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login')
    }
  }, [session, isPending, router])

  // Fetch dashboard data from Edge Function
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session) return
      
      setLoading(true)
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        const token = localStorage.getItem('bearer_token')
        
        const response = await fetch(`${supabaseUrl}/functions/v1/dashboard-data?period=7d`, {
          headers: {
            'Authorization': `Bearer ${token || supabaseAnonKey}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setDashboardData(data)
          
          // Update Google connection status
          if (data.integrations) {
            setGoogleConnected(data.integrations.gmail_connected && data.integrations.sheets_connected)
          }
        } else {
          console.error('Failed to fetch dashboard data:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [session])

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
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const handleConnectGoogle = async () => {
    if (!session) return
    
    setConnectingGoogle(true)
    try {
      router.push('/integrations')
    } catch (error) {
      console.error('Error navigating to integrations:', error)
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
      title: "Available Credits",
      value: loading || !dashboardData ? "..." : `${dashboardData.user_quotas.remaining_credits}`,
      description: loading || !dashboardData ? "Loading..." : `${dashboardData.user_quotas.used_credits} of ${dashboardData.user_quotas.total_credits} used`,
      icon: Zap,
      color: "text-primary"
    },
    {
      title: "POs Processed (7d)",
      value: loading || !dashboardData ? "..." : dashboardData.po_history.length.toString(),
      description: loading || !dashboardData ? "Loading..." : `Last 7 days`,
      icon: FileText,
      color: "text-accent"
    },
    {
      title: "Gmail Integration",
      value: loading || !dashboardData ? "..." : (dashboardData.integrations.gmail_connected ? "Connected" : "Not Connected"),
      description: loading || !dashboardData ? "Loading..." : (dashboardData.integrations.gmail_connected ? "Receiving POs" : "Connect to receive"),
      icon: Mail,
      color: "text-primary"
    },
    {
      title: "Sheets Integration",
      value: loading || !dashboardData ? "..." : (dashboardData.integrations.sheets_connected ? "Connected" : "Not Connected"),
      description: loading || !dashboardData ? "Loading..." : (dashboardData.integrations.sheets_connected ? "Auto-exporting data" : "Connect to export"),
      icon: FileSpreadsheet,
      color: "text-accent"
    }
  ]

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="h-7 w-7 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="ml-3 text-xl font-bold text-foreground">TradeFlow AI</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="/dashboard" className="text-primary font-medium">Dashboard</a>
              <a href="/integrations" className="text-muted-foreground">Integrations</a>
              <a href="/billing" className="text-muted-foreground">Billing</a>
              <a href="/settings" className="text-muted-foreground">Settings</a>
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {session?.user?.name || session?.user?.email}
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
          <Alert className={`mb-6 ${alertMessage.type === 'success' ? 'bg-accent/10 border-accent' : 'bg-destructive/10 border-destructive'}`}>
            {alertMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-accent" />
            ) : (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
            <AlertDescription className={alertMessage.type === 'success' ? 'text-accent-foreground' : 'text-destructive-foreground'}>
              {alertMessage.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back! Here's your 7-day purchase order summary.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card border-border rounded-xl shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    )}
                    {loading ? (
                      <Skeleton className="h-4 w-24 mt-1" />
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                    )}
                  </div>
                  <div className="p-3 rounded-full bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Credits Usage */}
        <Card className="mb-8 bg-card border-border rounded-xl shadow-md">
          <CardHeader>
            <CardTitle className="text-foreground">Credits Usage</CardTitle>
            <CardDescription className="text-muted-foreground">
              {loading || !dashboardData ? (
                <Skeleton className="h-4 w-48" />
              ) : (
                `You've used ${dashboardData.user_quotas.used_credits} out of ${dashboardData.user_quotas.total_credits} credits`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Credits Used</span>
                {loading || !dashboardData ? (
                  <Skeleton className="h-4 w-12" />
                ) : (
                  <span>{dashboardData.user_quotas.used_credits}/{dashboardData.user_quotas.total_credits}</span>
                )}
              </div>
              {loading || !dashboardData ? (
                <Skeleton className="h-2 w-full" />
              ) : (
                <Progress 
                  value={dashboardData.user_quotas.total_credits > 0 ? (dashboardData.user_quotas.used_credits / dashboardData.user_quotas.total_credits) * 100 : 0} 
                  className="h-2 bg-muted" 
                />
              )}
              <p className="text-xs text-muted-foreground">
                {loading || !dashboardData ? (
                  <Skeleton className="h-3 w-32 inline" />
                ) : (
                  <>
                    {dashboardData.user_quotas.remaining_credits} credits remaining. 
                    <Link href="/billing" className="text-primary ml-1">
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
          <Card className="bg-card border-border rounded-xl shadow-md">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Connect Google Button */}
              {googleConnected ? (
                <div className="p-3 border border-accent bg-accent/10 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-accent-foreground">Google Connected</p>
                      <p className="text-xs text-accent-foreground/80">Gmail & Sheets integrated</p>
                    </div>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={handleConnectGoogle}
                  disabled={connectingGoogle}
                  className="w-full justify-start bg-primary text-primary-foreground"
                >
                  {connectingGoogle ? (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
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
              
              <Button variant="outline" asChild className="w-full justify-start border-primary text-primary">
                <Link href="/integrations">
                  <Plus className="mr-2 h-4 w-4" />
                  Manage Integrations
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start border-accent text-accent">
                <Link href="/billing">
                  <Zap className="mr-2 h-4 w-4" />
                  Buy More Credits
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* PO History (7 Days) */}
          <Card className="lg:col-span-2 bg-card border-border rounded-xl shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">PO History (Last 7 Days)</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Recent purchase orders processed
                  </CardDescription>
                </div>
                <Badge className="bg-primary/10 text-primary px-3 py-1">
                  7-Day View
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-card">
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
                ) : dashboardData && dashboardData.po_history.length > 0 ? (
                  dashboardData.po_history.map((po, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">{po.po_number}</p>
                          <p className="text-sm text-muted-foreground">{po.vendor_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="font-medium text-foreground">{formatCurrency(po.amount)}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(po.date)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No PO History Yet</h3>
                    <p className="text-muted-foreground mb-4">Your last 7 days of purchase orders will appear here.</p>
                    <p className="text-sm text-muted-foreground">
                      All processed POs are permanently saved in your Google Sheets.
                    </p>
                  </div>
                )}
              </div>
              {!loading && dashboardData && dashboardData.po_history.length > 0 && (
                <Alert className="mt-6 bg-primary/10 border-primary">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-foreground">
                    <strong>Note:</strong> This is your 7-day quick reference. All processed POs are permanently saved in your connected Google Sheets account.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}