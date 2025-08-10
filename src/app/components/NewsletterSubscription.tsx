
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { fadeInUp } from '@/utils/animations'

interface NewsletterSubscriptionProps {
  className?: string
  title?: string
  subtitle?: string
}

export default function NewsletterSubscription({ 
  className = '',
  title = 'Stay Updated',
  subtitle = 'Subscribe to our newsletter for the latest updates and insights.'
}: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setStatus('error')
      setMessage('Please enter your email address.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed')
      }

      setStatus('success')
      setMessage('Successfully subscribed! Thank you for joining our newsletter.')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Subscription failed. Please try again.')
    }
  }

  return (
    <motion.div
      className={`bg-gradient-to-r from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 rounded-lg p-6 border border-primary/20 ${className}`}
      {...fadeInUp}
    >
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-full">
            <EnvelopeIcon className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={status === 'loading'}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <motion.button
            type="submit"
            disabled={status === 'loading' || !email.trim()}
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
            whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </motion.button>
        </div>

        {/* Status Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center text-sm p-3 rounded-lg ${
              status === 'success'
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
            }`}
          >
            {message}
          </motion.div>
        )}
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </motion.div>
  )
}