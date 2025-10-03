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
import { motion } from 'framer-motion'

export default function LandingPage() {
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
    <div className="min-h-screen bg-white">
      {/* Header - Apple-inspired clean, blurred nav */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900 tracking-tight">TradeFlow AI</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Pricing</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">About</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild className="font-medium">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section - Deeper emphasis on content, fluid gradient */}
      <section className="pt-20 pb-32 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/30 to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 inline-flex px-4 py-2 bg-blue-100/80 text-blue-800 hover:bg-blue-100/80 backdrop-blur-sm rounded-full">
                🚀 AI-Powered Purchase Order Processing
              </Badge>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Process Purchase Orders in
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Seconds</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Upload your PO files and get structured, validated data instantly. 
              Save hours of manual work with our AI-powered extraction technology.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" asChild className="text-lg px-8 py-4 font-semibold shadow-lg">
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 font-semibold border-2">
                <Link href="/login">
                  View Demo
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Zoho-inspired functional stats with depth */}
      <section className="py-20 bg-white relative -mt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Apple depth with subtle glass effects */}
      <section id="features" className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything you need to process POs efficiently
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform handles the entire PO processing workflow, 
              from upload to structured data export.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-semibold text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works - Zoho intuitive steps with fluid motion */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How TradeFlow AI Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple 3-step process to transform your PO workflow
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            {[ 
              { icon: Upload, color: 'blue', title: '1. Upload Files', desc: 'Drag and drop your PO files (PDF, EML, TXT) or upload from your device', bg: 'bg-blue-100' },
              { icon: Zap, color: 'purple', title: '2. AI Processing', desc: 'Our AI extracts vendor details, line items, amounts, and validates the data', bg: 'bg-purple-100' },
              { icon: FileSpreadsheet, color: 'green', title: '3. Export Data', desc: 'Get structured data exported to Google Sheets or download as CSV/Excel', bg: 'bg-green-100' }
            ].map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="relative">
                  <div className={`w-20 h-20 ${step.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <step.icon className={`h-10 w-10 text-${step.color}-600`} />
                  </div>
                  {index < 2 && (
                    <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-16 h-1 bg-gray-200 hidden md:block" />
                  )}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Clean, modular like Zoho */}
      <section id="pricing" className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your business needs. No hidden fees.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`relative border-0 overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${plan.popular ? 'ring-2 ring-blue-500/20 scale-[1.02]' : ''}`}>
                  {plan.popular && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      className="absolute -top-5 left-1/2 transform -translate-x-1/2"
                    >
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 font-semibold rounded-full shadow-lg">
                        Most Popular
                      </Badge>
                    </motion.div>
                  )}
                  
                  <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                      <plan.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-600 mb-4 text-lg">
                      {plan.description}
                    </CardDescription>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-2 text-lg">{plan.period}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 font-medium">{plan.credits} credits included</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full h-12 font-semibold rounded-xl" 
                      variant={plan.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/signup">
                        Get Started
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Bold, accessible like Zoho */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Ready to Transform Your PO Processing?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Join hundreds of businesses already saving time and reducing errors with TradeFlow AI.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-4 font-semibold bg-white text-blue-600 hover:bg-white/90 shadow-lg">
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 font-semibold border-white text-white hover:bg-white/10 backdrop-blur-sm">
              <Link href="/login">
                View Demo
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer - Minimal, functional */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-gray-900/95 backdrop-blur-sm text-white py-16"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-semibold">TradeFlow AI</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                AI-powered purchase order processing for modern businesses.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-6 text-gray-200">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-6 text-gray-200">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-6 text-gray-200">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800/50 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TradeFlow AI. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}