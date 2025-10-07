'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  X,
  Zap,
  Settings,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'

interface UploadedFile {
  file: File
  id: string
  status: 'uploading' | 'processing' | 'completed' | 'failed'
  progress: number
  result?: {
    po_number: string
    vendor_name: string
    total_amount: number
    line_items: number
  }
  error?: string
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [credits, setCredits] = useState(8)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'uploading' as const,
      progress: 0
    }))

    setFiles(prev => [...prev, ...newFiles])

    newFiles.forEach(uploadedFile => {
      simulateProcessing(uploadedFile.id)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'message/rfc822': ['.eml'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024,
  })

  const simulateProcessing = (fileId: string) => {
    let progress = 0
    const uploadInterval = setInterval(() => {
      progress += 10
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress } : f
      ))

      if (progress >= 100) {
        clearInterval(uploadInterval)
        
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'processing', progress: 0 } : f
        ))

        let processProgress = 0
        const processInterval = setInterval(() => {
          processProgress += 15
          setFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, progress: processProgress } : f
          ))

          if (processProgress >= 100) {
            clearInterval(processInterval)
            
            const mockResult = {
              po_number: `PO-2024-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
              vendor_name: ['Tech Solutions Ltd', 'Office Supplies Co', 'Manufacturing Inc'][Math.floor(Math.random() * 3)],
              total_amount: Math.floor(Math.random() * 100000) + 5000,
              line_items: Math.floor(Math.random() * 10) + 1
            }

            setFiles(prev => prev.map(f => 
              f.id === fileId ? { 
                ...f, 
                status: 'completed', 
                progress: 100,
                result: mockResult
              } : f
            ))

            setCredits(prev => Math.max(0, prev - 1))
          }
        }, 500)
      }
    }, 200)
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Clock className="h-4 w-4 text-accent" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-primary" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <FileText className="h-4 w-4 text-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return 'bg-accent/10 text-accent'
      case 'completed':
        return 'bg-primary/10 text-primary'
      case 'failed':
        return 'bg-destructive/10 text-destructive'
      default:
        return 'bg-muted text-muted-foreground'
    }
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
              <a href="/upload" className="text-primary font-medium">Upload PO</a>
              <a href="/integrations" className="text-muted-foreground">Integrations</a>
              <a href="/billing" className="text-muted-foreground">Billing</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm border-accent text-accent">
                {credits} credits left
              </Badge>
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
          <h1 className="text-3xl font-bold text-foreground">Upload Purchase Orders</h1>
          <p className="mt-2 text-muted-foreground">
            Upload your PO files and let AI extract the data automatically
          </p>
        </div>

        {/* Credits Warning */}
        {credits <= 2 && (
          <Alert className="mb-6 bg-destructive/10 border-destructive">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive-foreground">
              You're running low on credits ({credits} remaining). 
              <Link href="/billing" className="font-medium text-primary hover:text-primary/80 ml-1">
                Upgrade your plan
              </Link> to continue processing.
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Area */}
        <Card className="mb-8 bg-card border-border rounded-xl shadow-md">
          <CardHeader>
            <CardTitle className="text-foreground">Upload Files</CardTitle>
            <CardDescription className="text-muted-foreground">
              Drag and drop your PO files here, or click to browse. Supports PDF, EML, and TXT files up to 10MB.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer border-input bg-card`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              {isDragActive ? (
                <p className="text-lg text-accent">Drop the files here...</p>
              ) : (
                <>
                  <p className="text-lg text-foreground mb-2">
                    Drag & drop files here, or <span className="text-primary font-medium">browse</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PDF, EML, TXT files up to 10MB each
                  </p>
                </>
              )}
            </div>

            {/* Supported Formats */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">PDF Documents</Badge>
              <Badge variant="secondary" className="bg-primary/10 text-primary">Email Files (.eml)</Badge>
              <Badge variant="secondary" className="bg-primary/10 text-primary">Text Files (.txt)</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Processing Files */}
        {files.length > 0 && (
          <Card className="bg-card border-border rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground">Processing Files</CardTitle>
              <CardDescription className="text-muted-foreground">
                Track the progress of your uploaded files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {files.map((uploadedFile) => (
                  <div key={uploadedFile.id} className="border rounded-lg p-4 bg-card shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(uploadedFile.status)}
                        <div>
                          <p className="font-medium text-foreground">{uploadedFile.file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(uploadedFile.status)}>
                          {uploadedFile.status === 'uploading' && 'Uploading'}
                          {uploadedFile.status === 'processing' && 'Processing'}
                          {uploadedFile.status === 'completed' && 'Completed'}
                          {uploadedFile.status === 'failed' && 'Failed'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(uploadedFile.id)}
                          className="text-muted-foreground"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {(uploadedFile.status === 'uploading' || uploadedFile.status === 'processing') && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-muted-foreground mb-1">
                          <span>
                            {uploadedFile.status === 'uploading' ? 'Uploading...' : 'Processing with AI...'}
                          </span>
                          <span>{uploadedFile.progress}%</span>
                        </div>
                        <Progress value={uploadedFile.progress} className="h-2 bg-muted" />
                      </div>
                    )}

                    {/* Results */}
                    {uploadedFile.status === 'completed' && uploadedFile.result && (
                      <div className="bg-primary/10 border border-primary rounded-lg p-4">
                        <h4 className="font-medium text-primary mb-2">Extraction Results</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm text-foreground">
                          <div>
                            <span className="text-muted-foreground">PO Number:</span>
                            <span className="ml-2 font-medium">{uploadedFile.result.po_number}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Vendor:</span>
                            <span className="ml-2 font-medium">{uploadedFile.result.vendor_name}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total Amount:</span>
                            <span className="ml-2 font-medium">₹{uploadedFile.result.total_amount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Line Items:</span>
                            <span className="ml-2 font-medium">{uploadedFile.result.line_items}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Error */}
                    {uploadedFile.status === 'failed' && (
                      <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
                        <p className="text-destructive-foreground text-sm">
                          {uploadedFile.error || 'Failed to process file. Please try again.'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-8 bg-card border-border rounded-xl shadow-md">
          <CardHeader>
            <CardTitle className="text-foreground">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-2">Supported File Types</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• PDF documents with purchase order data</li>
                  <li>• Email files (.eml) containing PO information</li>
                  <li>• Text files (.txt) with structured PO data</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Processing Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Ensure files are clear and readable</li>
                  <li>• Each file costs 1 processing credit</li>
                  <li>• Processing typically takes 30-60 seconds</li>
                  <li>• Results are automatically saved to your dashboard</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}