"use client"

import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ReCAPTCHA from 'react-google-recaptcha'
import { useTheme } from 'next-themes'
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast'

// Form validation schema
const contactSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const { theme, resolvedTheme } = useTheme()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    const loadingToast = showLoading('Sending your message...')

    try {
      // Get reCAPTCHA token
      const recaptchaToken = await recaptchaRef.current?.executeAsync()
      recaptchaRef.current?.reset()

      if (!recaptchaToken) {
        dismissToast(loadingToast)
        showError('Please complete the reCAPTCHA verification')
        return
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          recaptchaToken,
        }),
      })

      dismissToast(loadingToast)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        showError(errorData.message || 'Failed to send message. Please try again.')
        return
      }

      showSuccess('Message sent successfully! Thank you for reaching out. I\'ll get back to you soon.')
      reset()
    } catch (error) {
      dismissToast(loadingToast)
      console.error('Contact form error:', error)
      showError('An unexpected error occurred. Please try again or contact me directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get the current theme for reCAPTCHA
  const currentTheme = resolvedTheme || theme

  return (
    <div className="mx-auto p-6">
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              {...register('firstName')}
              type="text"
              id="firstName"
              className={`w-full px-4 py-3 border focus:ring-2 focus:ring-ring focus:border-transparent transition-colors bg-input text-foreground placeholder:text-muted-foreground ${
                errors.firstName 
                  ? 'border-destructive' 
                  : 'border-border'
              }`}
              placeholder="First Name *"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-destructive">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <input
              {...register('lastName')}
              type="text"
              id="lastName"
              className={`w-full px-4 py-3 border focus:ring-2 focus:ring-ring focus:border-transparent transition-colors bg-input text-foreground placeholder:text-muted-foreground ${
                errors.lastName 
                  ? 'border-destructive' 
                  : 'border-border'
              }`}
              placeholder="Last Name *"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div>
          <input
            {...register('email')}
            type="email"
            id="email"
            className={`w-full px-4 py-3 border focus:ring-2 focus:ring-ring focus:border-transparent transition-colors bg-input text-foreground placeholder:text-muted-foreground ${
              errors.email 
                ? 'border-destructive' 
                : 'border-border'
            }`}
            placeholder="Email *"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <textarea
            {...register('message')}
            id="message"
            rows={6}
            className={`w-full px-4 py-3 border focus:ring-2 focus:ring-ring focus:border-transparent transition-colors resize-vertical bg-input text-foreground placeholder:text-muted-foreground ${
              errors.message 
                ? 'border-destructive' 
                : 'border-border'
            }`}
            placeholder="Message *"
          />
          {errors.message && (
            <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>
          )}
        </div>

        {/* reCAPTCHA */}
        <div className="flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            size="invisible"
            theme={currentTheme === 'dark' ? 'dark' : 'light'}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-6 font-medium transition-colors cursor-pointer ${
            isSubmitting
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background'
          }`}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}

export default ContactForm
