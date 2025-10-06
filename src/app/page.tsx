'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  FileText, 
  Clock, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Upload,
  Mail,
  FileSpreadsheet,
  BarChart3,
  Users,
  Building,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LandingPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!isPending && session?.user) {
      router.push('/dashboard')
    }
  }, [session, isPending, router])

  // Show loading while checking session
  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const features = [
    {
      icon: Upload,
      title: "Smart File Processing",
      description: "Upload PDF, EML, or TXT files and get structured data in seconds"
    },
    {
      icon: Zap,
      title: "AI-Powered Extraction",
      description: "Advanced AI automatically extracts vendor details, items, and amounts"
    },
    {
      icon: Clock,
      title: "Real-time Processing",
      description: "Get results instantly with our lightning-fast processing engine"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee"
    },
    {
      icon: Mail,
      title: "Email Notifications",
      description: "Get notified when your purchase orders are processed"
    },
    {
      icon: FileSpreadsheet,
      title: "Google Sheets Export",
      description: "Export processed data directly to your spreadsheets"
    }
  ]

  const plans = [
    {
      name: "Starter",
      price: "₹299",
      period: "/month",
      credits: 10,
      description: "Perfect for small businesses",
      features: [
        "10 PO processing credits",
        "Email notifications",
        "Google Sheets export",
        "Basic support",
        "6 months data retention"
      ],
      popular: false,
      icon: Users
    },
    {
      name: "Professional",
      price: "₹999",
      period: "/month",
      credits: 100,
      description: "Ideal for growing businesses",
      features: [
        "100 PO processing credits",
        "Priority notifications",
        "Advanced analytics",
        "Priority support",
        "2 years data retention"
      ],
      popular: true,
      icon: Building
    },
    {
      name: "Business",
      price: "₹2,499",
      period: "/month",
      credits: 500,
      description: "For high-volume processing",
      features: [
        "500 PO processing credits",
        "Real-time notifications",
        "Custom reporting",
        "Phone & email support",
        "5 years data retention"
      ],
      popular: false,
      icon: Star
    }
  ]

  const stats = [
    { number: "10,000+", label: "POs Processed" },
    { number: "500+", label: "Happy Customers" },
    { number: "99.9%", label: "Uptime" },
    { number: "< 2s", label: "Processing Time" }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Clean, simple nav like Redmi: flat, minimal, yellow accents */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="ml-3 text-xl font-bold text-foreground">TradeFlow AI</span>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-muted-foreground font-medium">Features</a>
              <a href="#pricing" className="text-muted-foreground font-medium">Pricing</a>
              <a href="#about" className="text-muted-foreground font-medium">About</a>
            </nav>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild className="font-medium text-muted-foreground px-4 py-2">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-accent text-accent-foreground px-4 py-2 rounded-lg">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Redmi-like: clean hero with card-style content, no effects, yellow bg */}
      <section className="pt-20 pb-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-2xl p-8 mx-auto max-w-4xl text-center border">
            <Badge className="mb-4 inline-flex px-3 py-1 bg-primary/20 text-primary rounded-full">
              🚀 AI-Powered Purchase Order Processing
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
              Process Purchase Orders in
              <span className="block text-accent">Seconds</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Upload your PO files and get structured, validated data instantly. 
              Save hours of manual work with our AI-powered extraction technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild className="px-6 py-3 font-semibold bg-accent text-accent-foreground rounded-lg">
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-6 py-3 font-semibold border-primary text-primary rounded-lg">
                <Link href="/login">
                  View Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Grid of simple cards, no hovers */}
      <section className="py-16 bg-card -mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="p-4 bg-secondary rounded-lg border text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Yellow cards like image, flat */}
      <section id="features" className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to process POs efficiently
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform handles the entire PO processing workflow, 
              from upload to structured data export.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index}>
                <Card className="border border-primary/30 bg-secondary rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works - Simple steps cards, no lines/animations */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How TradeFlow AI Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple 3-step process to transform your PO workflow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Upload, title: '1. Upload Files', desc: 'Drag and drop your PO files (PDF, EML, TXT) or upload from your device', bg: 'bg-accent/20' },
              { icon: Zap, title: '2. AI Processing', desc: 'Our AI extracts vendor details, line items, amounts, and validates the data', bg: 'bg-primary/20' },
              { icon: FileSpreadsheet, title: '3. Export Data', desc: 'Get structured data exported to Google Sheets or download as CSV/Excel', bg: 'bg-accent/20' }
            ].map((step, index) => (
              <div key={index} className="text-center p-6 bg-secondary rounded-xl border shadow-md">
                <div className={`w-16 h-16 ${step.bg} rounded-xl flex items-center justify-center mx-auto mb-4 border`}>
                  <step.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Flat yellow cards, popular badge simple */}
      <section id="pricing" className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your business needs. No hidden fees.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index}>
                <Card className={`border rounded-xl p-6 shadow-lg ${plan.popular ? 'border-primary bg-primary/10' : 'border-border bg-secondary'}`}>
                  {plan.popular && (
                    <Badge className="mb-4 inline-flex bg-primary text-primary-foreground px-4 py-1 rounded-full font-medium">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground text-center mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground text-center mb-3 text-base">
                    {plan.description}
                  </CardDescription>
                  <div className="text-center mb-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground ml-1 text-lg">{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">{plan.credits} credits included</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                        <span className="text-foreground font-medium text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full py-3 font-semibold rounded-lg bg-accent text-accent-foreground"
                    asChild
                  >
                    <Link href="/signup">
                      Get Started
                    </Link>
                  </Button>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Simple card CTA, no relative */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your PO Processing?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-6 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of businesses already saving time and reducing errors with TradeFlow AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild className="px-6 py-3 font-semibold bg-accent text-accent-foreground rounded-lg">
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-6 py-3 font-semibold border-primary-foreground text-primary-foreground rounded-lg">
                <Link href="/login">
                  View Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Simple grid, yellow accents */}
      <footer className="bg-card text-foreground py-12 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="ml-2 text-xl font-bold">TradeFlow AI</span>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm">
                AI-powered purchase order processing for modern businesses.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-base mb-4 text-foreground">Product</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><a href="#features" className="text-foreground">Features</a></li>
                <li><a href="#pricing" className="text-foreground">Pricing</a></li>
                <li><a href="/login" className="text-foreground">Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-base mb-4 text-foreground">Support</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><a href="#" className="text-foreground">Help Center</a></li>
                <li><a href="#" className="text-foreground">Contact Us</a></li>
                <li><a href="#" className="text-foreground">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-base mb-4 text-foreground">Company</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><a href="#about" className="text-foreground">About</a></li>
                <li><a href="#" className="text-foreground">Privacy</a></li>
                <li><a href="#" className="text-foreground">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 pt-6 text-center text-muted-foreground text-sm">
            <p>&copy; 2024 TradeFlow AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}