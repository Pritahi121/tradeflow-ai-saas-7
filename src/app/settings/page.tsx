'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Settings,
  Zap,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Save
} from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    company: 'Tech Solutions Ltd',
    phone: '+91 98765 43210',
    timezone: 'Asia/Calcutta'
  })

  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: false,
    processing_complete: true,
    processing_failed: true,
    low_credits: true,
    weekly_summary: false
  })

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY'
  })

  const handleSave = () => {
    alert('Settings saved successfully!')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-foreground">TradeFlow AI</h1>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="/dashboard" className="text-muted-foreground">Dashboard</a>
              <a href="/integrations" className="text-muted-foreground">Integrations</a>
              <a href="/billing" className="text-muted-foreground">Billing</a>
              <a href="/settings" className="text-primary font-medium">Settings</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign Out</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="bg-card border-border rounded-xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <User className="h-5 w-5 text-primary" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Update your personal and company information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="border-input"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-foreground">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="border-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company" className="text-foreground">Company Name</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => setProfile({...profile, company: e.target.value})}
                    className="border-input"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="border-input"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="timezone" className="text-foreground">Timezone</Label>
                <Select value={profile.timezone} onValueChange={(value) => setProfile({...profile, timezone: value})}>
                  <SelectTrigger className="border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Calcutta">Asia/Calcutta (IST)</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-card border-border rounded-xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <Bell className="h-5 w-5 text-accent" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Choose how you want to be notified about PO processing updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="text-foreground">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="whatsapp-notifications" className="text-foreground">WhatsApp Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via WhatsApp</p>
                  </div>
                  <Switch
                    id="whatsapp-notifications"
                    checked={notifications.whatsapp}
                    onCheckedChange={(checked) => setNotifications({...notifications, whatsapp: checked})}
                    className="data-[state=checked]:bg-accent"
                  />
                </div>
              </div>

              <div className="border-border pt-4">
                <h4 className="font-medium text-foreground mb-3">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="processing-complete" className="text-foreground">Processing Complete</Label>
                    <Switch
                      id="processing-complete"
                      checked={notifications.processing_complete}
                      onCheckedChange={(checked) => setNotifications({...notifications, processing_complete: checked})}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="processing-failed" className="text-foreground">Processing Failed</Label>
                    <Switch
                      id="processing-failed"
                      checked={notifications.processing_failed}
                      onCheckedChange={(checked) => setNotifications({...notifications, processing_failed: checked})}
                      className="data-[state=checked]:bg-destructive"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="low-credits" className="text-foreground">Low Credits Warning</Label>
                    <Switch
                      id="low-credits"
                      checked={notifications.low_credits}
                      onCheckedChange={(checked) => setNotifications({...notifications, low_credits: checked})}
                      className="data-[state=checked]:bg-accent"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weekly-summary" className="text-foreground">Weekly Summary</Label>
                    <Switch
                      id="weekly-summary"
                      checked={notifications.weekly_summary}
                      onCheckedChange={(checked) => setNotifications({...notifications, weekly_summary: checked})}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="bg-card border-border rounded-xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <Palette className="h-5 w-5 text-primary" />
                <span>Preferences</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Customize your application experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme" className="text-foreground">Theme</Label>
                  <Select value={preferences.theme} onValueChange={(value) => setPreferences({...preferences, theme: value})}>
                    <SelectTrigger className="border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language" className="text-foreground">Language</Label>
                  <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
                    <SelectTrigger className="border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency" className="text-foreground">Currency</Label>
                  <Select value={preferences.currency} onValueChange={(value) => setPreferences({...preferences, currency: value})}>
                    <SelectTrigger className="border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date-format" className="text-foreground">Date Format</Label>
                  <Select value={preferences.dateFormat} onValueChange={(value) => setPreferences({...preferences, dateFormat: value})}>
                    <SelectTrigger className="border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-card border-border rounded-xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <Shield className="h-5 w-5 text-accent" />
                <span>Security</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password" className="text-foreground">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter current password"
                  className="border-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-password" className="text-foreground">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    className="border-input"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password" className="text-foreground">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    className="border-input"
                  />
                </div>
              </div>
              <Button variant="outline" className="border-primary text-primary">Change Password</Button>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="flex items-center space-x-2 bg-primary text-primary-foreground">
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}