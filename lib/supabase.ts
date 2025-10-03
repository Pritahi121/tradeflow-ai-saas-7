import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types matching your existing schema
export interface Client {
  id: string
  client_id: string
  user_id: string
  name?: string
  company?: string
  email?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface UserQuota {
  id: string
  user_id: string
  monthly_quota: number
  remaining_credits: number
  monthly_credits: number
  created_at: string
  updated_at: string
}

export interface PurchaseOrder {
  id: string
  user_id: string
  po_number: string
  vendor_name?: string
  total_amount: number
  items?: any // jsonb
  status?: string
  created_at: string
  updated_at: string
}

export interface PaymentHistory {
  id: string
  user_id: string
  payment_amount: number
  stripe_payment_id?: string
  status: string
  created_at: string
}

export interface UsageLog {
  id: string
  user_id: string
  action_type: string
  credits_used: number
  timestamp: string
}

export interface PricingConfig {
  id: number
  plan_name: string
  price_amount: number
  credits_included: number
  is_active: boolean
}
