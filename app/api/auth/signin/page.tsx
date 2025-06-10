"use client"

import React from 'react'
import Image from 'next/image'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast'

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation with toasts
    if (!email.trim()) {
      showError('Please enter your email address')
      return
    }
    
    if (!password.trim()) {
      showError('Please enter your password')
      return
    }

    setLoading(true)
    const loadingToast = showLoading('Signing you in...')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      dismissToast(loadingToast)

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          showError('Invalid email or password. Please check your credentials and try again.')
        } else {
          showError('Sign in failed. Please try again.')
        }
      } else {
        showSuccess('Welcome back! You have been signed in successfully.')
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      dismissToast(loadingToast)
      console.error('Sign in error:', error)
      showError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = (provider: string) => {
    showLoading(`Redirecting to ${provider}...`)
    signIn(provider, { callbackUrl: '/dashboard' })
  }

  return (
    <div className="flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo or Title */}
        <div className="flex flex-col items-center mb-2">
          <Image 
            src="/featured.jpg" 
            alt="Logo" 
            width={40} 
            height={40} 
            className="mb-1 rounded-full w-12 h-12"
            onError={() => showError('Failed to load logo image')}
          />
          <h2 className="text-xl font-bold text-foreground mb-1">Sign in to your account</h2>
          <p className="text-muted-foreground text-xs">Welcome back! Please sign in below.</p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-foreground mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-foreground mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-2">
          <div className="flex-grow border-t border-border" />
          <span className="mx-2 text-xs text-muted-foreground">or sign in with</span>
          <div className="flex-grow border-t border-border" />
        </div>

        {/* Social Sign In Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleOAuthSignIn('google')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-gray-100 dark:bg-background text-foreground hover:bg-gray-100 dark:hover:bg-muted transition-colors text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Image 
              src="/social/google.jpeg" 
              alt="Google" 
              width={18} 
              height={18}
              onError={() => showError('Failed to load Google icon')}
              className='rounded-full'
            />
            Continue with Google
          </button>
        </div>

        {/* Forgot Password / Sign Up */}
        <div className="flex justify-center items-center text-xs">
          <a href="/api/auth/signup" className="text-primary hover:underline">
            Don&apos;t have an account? Sign up
          </a>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
