'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { showSuccess, showError, showLoading, dismissToast, showInfo } from '@/lib/toast'
import Link from 'next/link'

const SignUpPage: React.FC = () => {
  const [step, setStep] = useState<'register' | 'verify'>('register')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation with toasts
    if (!name.trim()) {
      showError('Please enter your name')
      return
    }
    
    if (!email.trim()) {
      showError('Please enter your email address')
      return
    }
    
    if (!password.trim()) {
      showError('Please enter a password')
      return
    }
    
    if (password.length < 8) {
      showError('Password must be at least 8 characters long')
      return
    }

    setLoading(true)
    const loadingToast = showLoading('Creating your account...')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()
      dismissToast(loadingToast)

      if (response.ok && data.requiresVerification) {
        setUserId(data.userId)
        setStep('verify')
        showSuccess('Account created successfully! Please check your email for verification code.')
      } else {
        showError(data.error || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.log("error: ", error);
      dismissToast(loadingToast)
      showError('An error occurred during registration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!verificationCode.trim()) {
      showError('Please enter the verification code')
      return
    }
    
    if (verificationCode.length !== 6) {
      showError('Verification code must be 6 digits')
      return
    }

    setLoading(true)
    const loadingToast = showLoading('Verifying your email...')

    try {
      const response = await fetch('/api/auth/verifyMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, code: verificationCode }),
      })

      const data = await response.json()
      dismissToast(loadingToast)

      if (response.ok && data.verified) {
        showSuccess('Email verified successfully! Signing you in...')
        
        // Auto sign in after successful verification
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.ok) {
          showSuccess('Welcome! You have been signed in successfully.')
          router.push('/')
        } else {
          showInfo('Verification successful! Please sign in to continue.')
          router.push('/auth/signin')
        }
      } else {
        showError(data.error || 'Invalid verification code. Please try again.')
      }
    } catch (error) {
      console.log("error: ", error);
      dismissToast(loadingToast)
      showError('An error occurred during verification. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResendLoading(true)
    const loadingToast = showLoading('Sending verification code...')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()
      dismissToast(loadingToast)

      if (response.ok) {
        showSuccess('Verification code sent successfully! Please check your email.')
      } else {
        showError(data.error || 'Failed to resend verification code. Please try again.')
      }
    } catch (error) {
      console.log("error: ", error);
      dismissToast(loadingToast)
      showError('An error occurred while resending the code. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  const handleOAuthSignIn = (provider: string) => {
    showLoading(`Redirecting to ${provider}...`)
    signIn(provider, { callbackUrl: '/' })
  }

  // Verification Step UI
  if (step === 'verify') {
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
            <h2 className="text-xl font-bold text-foreground mb-1">Verify Your Email</h2>
            <p className="text-muted-foreground text-xs text-center">
              6-digit verification code has been sent to <strong>{email}</strong>
            </p>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleVerification} className="space-y-3">
            <div>
              <label htmlFor="verificationCode" className="block text-xs font-medium text-foreground mb-1">
                Verification Code
              </label>
              <input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className="w-full py-2 px-4 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          {/* Resend Code */}
          <div className="text-center">
            <button
              onClick={handleResendCode}
              disabled={resendLoading || loading}
              className="text-xs text-primary hover:underline disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {resendLoading ? 'Sending...' : "Didn't receive code? Resend"}
            </button>
          </div>

          {/* Back to Registration */}
          <div className="text-center">
            <button
              onClick={() => setStep('register')}
              disabled={loading}
              className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              ← Back to registration
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Registration Step UI
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
          <h2 className="text-xl font-bold text-foreground mb-1">Create your account</h2>
          <p className="text-muted-foreground text-xs">Sign up to start your journey with us.</p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-foreground mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-foreground mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Password must be at least 8 characters long
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-2">
          <div className="flex-grow border-t border-border" />
          <span className="mx-2 text-xs text-muted-foreground">or sign up with</span>
          <div className="flex-grow border-t border-border" />
        </div>

        {/* Social Sign Up Buttons */}
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

        {/* Already have an account? */}
        <div className="flex justify-center items-center text-xs">
          <Link href="/api/auth/signin" className="text-primary hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
