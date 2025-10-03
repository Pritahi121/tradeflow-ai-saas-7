'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, metadata?: any) => Promise<any>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Handle new user signup
        if (event === 'SIGNED_UP' && session?.user) {
          await handleNewUser(session.user)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleNewUser = async (user: User) => {
    try {
      // Create client record
      const { error: clientError } = await supabase
        .from('clients')
        .insert({
          client_id: `client_${user.id.slice(0, 8)}`,
          user_id: user.id,
          name: user.user_metadata?.name || 'User',
          company: user.user_metadata?.company || 'Company',
          email: user.email
        })

      if (clientError) {
        console.error('Error creating client:', clientError)
      }

      // Create user quota record
      const { error: quotaError } = await supabase
        .from('user_quotas')
        .insert({
          user_id: user.id,
          monthly_quota: 10,
          remaining_credits: 10,
          monthly_credits: 10
        })

      if (quotaError) {
        console.error('Error creating user quota:', quotaError)
      }

    } catch (error) {
      console.error('Error in handleNewUser:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
