'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, authClient } from '@/lib/auth-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Zap,
  Mail,
  FileSpreadsheet,
  Settings,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Bell
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function IntegrationsPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  
  const [googleConnected, setGoogleConnected] = useState(false)
  const [connectingGoogle, setConnectingGoogle] = useState(false)
  const [notificationEmail, setNotificationEmail] = useState('')
  const [requireApproval, setRequireApproval] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [loading, setLoading] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login')
    }
  }, [session, isPending, router])

  // Check Google connection status
  useEffect(() => {
    const checkGoogleConnection = async () => {
      if (!session) return

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
      } finally {
        setLoading(false)
      }
    }

    checkGoogleConnection()
  }, [session])

  // Handle OAuth callback messages
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    
    if (params.get('google_connected') === 'true') {
      setAlertMessage({ type: 'success', message: 'Google account connected successfully! Gmail and Google Sheets are now integrated.' })
      setGoogleConnected(true)
      window.history.replaceState({}, '', '/integrations')
    } else if (params.get('error')) {
      const error = params.get('error')
      let message = 'Failed to connect Google account. Please try again.'
      if (error === 'oauth_cancelled') message = 'Google authentication was cancelled.'
      if (error === 'invalid_callback') message = 'Invalid OAuth callback. Please try again.'
      setAlertMessage({ type: 'error', message })
      window.history.replaceState({}, '', '/integrations')
    }

    if (params.get('google_connected') || params.get('error')) {
      setTimeout(() => setAlertMessage(null), 5000)
    }
  }, [])

  // Load notification settings
  useEffect(() => {
    if (session) {
      setNotificationEmail(session.email || '')
    }
  }, [session])

  const handleConnectGoogle = async () => {
    if (!session) return
    
    setConnectingGoogle(true)
    try {
      // Custom API-level Google OAuth flow
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      if (!clientId) {
        setAlertMessage({ type: 'error', message: 'Google OAuth is not configured. Please contact support.' })
        setConnectingGoogle(false)
        return
      }

      const redirectUri = `${window.location.origin}/api/auth/google/callback`
      const state = session.id // Pass user ID as state
      const scope = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/spreadsheets'
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(scope)}&` +
        `state=${state}&` +
        `access_type=offline&` +
        `prompt=consent`

      window.location.href = authUrl
    } catch (error) {
      console.error('Error connecting Google:', error)
      setAlertMessage({ type: 'error', message: 'An error occurred. Please try again.' })
      setConnectingGoogle(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!session) return

    setSavingSettings(true)
    try {
      const token = localStorage.getItem('bearer_token')
      const response = await fetch('/api/user-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          notificationEmail,
          requireApproval
        })
      })

      if (response.ok) {
        setAlertMessage({ type: 'success', message: 'Settings saved successfully!' })
        setTimeout(() => setAlertMessage(null), 3000)
      } else {
        setAlertMessage({ type: 'error', message: 'Failed to save settings. Please try again.' })
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setAlertMessage({ type: 'error', message: 'An error occurred. Please try again.' })
    } finally {
      setSavingSettings(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await authClient.signOut()
      localStorage.removeItem('bearer_token')
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="ml-3 text-xl font-bold text-foreground">TradeFlow AI</span>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-96 mb-8" />
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
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
              <a href="/dashboard" className="text-muted-foreground">Dashboard</a>
              <a href="/integrations" className="text-primary font-medium">Integrations</a>
              <a href="/billing" className="text-muted-foreground">Billing</a>
              <a href="/settings" className="text-muted-foreground">Settings</a>
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {session?.name || session?.email}
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
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Integrations</h1>
          <p className="text-muted-foreground">
            Connect your accounts and configure settings to automate your PO workflow.
          </p>
        </div>

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

        <div className="space-y-6">
          {/* Step 1 & 2: Connect Google Account (Gmail + Sheets) */}
          <Card className="bg-card border-border rounded-xl shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground text-xl">Step 1 & 2: Connect Google Account</CardTitle>
                  <CardDescription className="text-muted-foreground mt-2">
                    Connect Gmail and Google Sheets with a single click
                  </CardDescription>
                </div>
                {googleConnected && (
                  <Badge className="bg-accent text-accent-foreground px-3 py-1">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {googleConnected ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-accent/10 border border-accent rounded-lg">
                    <Mail className="h-8 w-8 text-accent" />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Gmail Connected</p>
                      <p className="text-sm text-muted-foreground">Receiving purchase orders from your inbox</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-accent/10 border border-accent rounded-lg">
                    <FileSpreadsheet className="h-8 w-8 text-accent" />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Google Sheets Connected</p>
                      <p className="text-sm text-muted-foreground">Data automatically exported to your spreadsheet</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-secondary rounded-lg border">
                    <div>
                      <p className="text-sm font-medium text-foreground">Need to reconnect?</p>
                      <p className="text-xs text-muted-foreground">Refresh your Google connection</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleConnectGoogle}
                      disabled={connectingGoogle}
                      className="border-primary text-primary"
                    >
                      {connectingGoogle ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Reconnecting...
                        </>
                      ) : (
                        'Reconnect'
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-6 bg-secondary rounded-lg border text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-primary/10 rounded-full">
                        <svg className="w-12 h-12" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Connect Your Google Account</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      By connecting your Google account, you'll enable both Gmail and Google Sheets integrations simultaneously. 
                      This allows TradeFlow AI to receive POs from your inbox and automatically export data to your spreadsheets.
                    </p>
                    <Button
                      onClick={handleConnectGoogle}
                      disabled={connectingGoogle}
                      className="bg-accent text-accent-foreground font-semibold px-8 py-6"
                    >
                      {connectingGoogle ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          Connect Google Account
                        </>
                      )}
                    </Button>
                  </div>

                  <Alert className="bg-primary/10 border-primary">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-foreground">
                      <strong>What you'll authorize:</strong> Gmail read access (to receive POs) and Google Sheets access (to export processed data)
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 3: Configure Notifications & Approvals */}
          <Card className="bg-card border-border rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground text-xl">Step 3: Configure Notifications & Approvals</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Set up email notifications and approval workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Email */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <label className="text-sm font-semibold text-foreground">Notification Email</label>
                </div>
                <Input
                  type="email"
                  placeholder="notifications@company.com"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  className="border-input bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  Receive notifications when purchase orders are processed
                </p>
              </div>

              {/* Require Manager Approval */}
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <p className="font-semibold text-foreground">Require Manager Approval</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enable this to require manager approval before processing POs
                  </p>
                </div>
                <Switch
                  checked={requireApproval}
                  onCheckedChange={setRequireApproval}
                />
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="w-full bg-accent text-accent-foreground font-semibold py-6 rounded-lg shadow-md"
              >
                {savingSettings ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Settings...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Setup Complete Message */}
          {googleConnected && (
            <Alert className="bg-accent/10 border-accent">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <AlertDescription className="text-accent-foreground">
                <strong>Setup Complete!</strong> Your integrations are active. Head to the{' '}
                <Link href="/dashboard" className="underline font-semibold">
                  Dashboard
                </Link>{' '}
                to start processing purchase orders.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>
    </div>
  )
}