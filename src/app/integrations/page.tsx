'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Package,
  Settings,
  Mail,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useSession, authClient } from '@/lib/auth-client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

function IntegrationsContent() {
  const { data: session } = useSession()
  const user = session?.user
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [sheetsEnabled, setSheetsEnabled] = useState(false)
  const [notificationEmail, setNotificationEmail] = useState(user?.email || '')
  
  // Add Google integration state
  const [googleConnected, setGoogleConnected] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(true)
  const [connectingGoogle, setConnectingGoogle] = useState(false)

  // Fetch Google integration status
  useEffect(() => {
    const checkGoogleConnection = async () => {
      if (!user) {
        setLoadingGoogle(false)
        return
      }

      try {
        setLoadingGoogle(true)
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
            setSheetsEnabled(true)  // Enable sheets if connected
          }
        }
      } catch (error) {
        console.error('Error checking Google connection:', error)
      } finally {
        setLoadingGoogle(false)
      }
    }

    checkGoogleConnection()
  }, [user])

  const handleSignOut = async () => {
    try {
      await authClient.signOut()
      localStorage.removeItem('bearer_token')
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const integrations = [
    {
      id: 'email',
      name: 'Email Notifications',
      description: 'Get notified when your POs are processed',
      icon: Mail,
      enabled: emailEnabled,
      status: 'active',
      category: 'notifications',
      setup: true
    },
    {
      id: 'sheets',
      name: 'Google Sheets',
      description: 'Export processed PO data directly to spreadsheets',
      icon: FileSpreadsheet,
      enabled: sheetsEnabled,
      status: googleConnected ? 'active' : 'available',
      category: 'export',
      setup: googleConnected ? true : false
    }
  ]

  const handleToggle = (id: string, enabled: boolean) => {
    if (id === 'email') {
      setEmailEnabled(enabled)
    } else if (id === 'sheets' && !googleConnected) {
      setSheetsEnabled(enabled)
    }
  }

  // Add Google connect handler
  const handleConnectGoogle = async () => {
    if (!user) return
    
    setConnectingGoogle(true)
    try {
      const response = await fetch(`/api/auth/google?user_id=${user.id}`)
      if (!response.ok) {
        throw new Error('Failed to get OAuth URL')
      }
      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error connecting Google:', error)
      toast.error('Failed to connect Google account')
    } finally {
      setConnectingGoogle(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" asChild className="mr-4">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-xl font-semibold text-gray-900">TradeFlow AI</h1>
                </div>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="/dashboard" className="text-gray-500 hover:text-gray-700">Dashboard</a>
              <a href="/upload" className="text-gray-500 hover:text-gray-700">Upload PO</a>
              <a href="/integrations" className="text-blue-600 font-medium">Integrations</a>
              <a href="/billing" className="text-gray-500 hover:text-gray-700">Billing</a>
              <a href="/settings" className="text-gray-500 hover:text-gray-700">Settings</a>
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.user_metadata?.name || user?.email}
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
          <p className="mt-2 text-gray-600">
            Connect TradeFlow AI with your favorite tools to streamline your workflow.
          </p>
        </div>

        {/* Active Integrations Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
            <CardDescription>
              Overview of your connected services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">
                    {integrations.filter(i => i.enabled).length} Active
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {integrations.filter(i => !i.enabled).length} Available
                  </span>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200">
                All Systems Operational
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Available Integrations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {integrations.map((integration) => (
            <Card key={integration.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <integration.icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={integration.enabled}
                    disabled={connectingGoogle || loadingGoogle}
                    onCheckedChange={(checked) => handleToggle(integration.id, checked)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge 
                      variant={integration.enabled && googleConnected ? "default" : "secondary"}
                      className={integration.enabled && googleConnected ? "bg-green-100 text-green-800" : ""}
                    >
                      {loadingGoogle ? 'Loading...' : (googleConnected ? 'Connected' : 'Not Connected')}
                    </Badge>
                  </div>
                  
                  {integration.enabled && googleConnected && (
                    <div className="pt-4 border-t bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Google Sheets integration active - PO data will be exported automatically</span>
                      </div>
                    </div>
                  )}

                  {integration.enabled && !googleConnected && !loadingGoogle && (
                    <div className="pt-4 border-t">
                      <Button 
                        className="w-full" 
                        variant="outline" 
                        onClick={handleConnectGoogle}
                        disabled={connectingGoogle}
                      >
                        {connectingGoogle ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Connect Google Account for Sheets
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Get assistance with setting up your integrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">📧 Email Notifications</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Automatically receive updates when your purchase orders are processed.
                </p>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">📊 Google Sheets Export</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Export your processed PO data directly to Google Sheets for analysis.
                </p>
                <Button variant="outline" size="sm">
                  Setup Guide
                </Button>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">More Integrations Coming Soon</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    We're working on additional integrations based on user feedback. 
                    Contact us if you have specific integration requests.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function IntegrationsPage() {
  return (
    <ProtectedRoute>
      <IntegrationsContent />
    </ProtectedRoute>
  )
}