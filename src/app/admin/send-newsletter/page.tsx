
'use client'
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  PaperAirplaneIcon,
  EyeIcon,
  UserGroupIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface NewsletterSubscriber {
  id: string
  email: string
  createdAt: string
}

export default function SendNewsletterPage() {
  const searchParams = useSearchParams()

  const selectedIds = useMemo(() => {
    return searchParams?.get('selected')?.split(',').filter(Boolean) || []
  }, [searchParams])

  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [selectedSubscribers, setSelectedSubscribers] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Email form state
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  useEffect(() => {
    if (subscribers.length > 0 && selectedIds.length > 0) {
      const selected = subscribers.filter(sub => selectedIds.includes(sub.id))
      setSelectedSubscribers(selected)
    }
  }, [subscribers, selectedIds])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/contact-messages')
      if (!response.ok) {
        throw new Error('Failed to fetch subscribers')
      }
      const data = await response.json()
      setSubscribers(data.subscribers || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscribers')
    } finally {
      setLoading(false)
    }
  }

  const handleSendNewsletter = async () => {
    if (!subject.trim() || !content.trim()) {
      setError('Please fill in both subject and content')
      return
    }

    if (selectedSubscribers.length === 0) {
      setError('Please select at least one subscriber')
      return
    }

    if (!confirm(`Are you sure you want to send this newsletter to ${selectedSubscribers.length} subscriber(s)?`)) {
      return
    }

    setSending(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/send-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          content,
          htmlContent: content.replace(/\n/g, '<br>'),
          selectedSubscribers: selectedSubscribers.map(sub => sub.id)
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send newsletter')
      }

      setSuccess(data.message || 'Newsletter sent successfully!')
      setSubject('')
      setContent('')
      setSelectedSubscribers([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send newsletter')
    } finally {
      setSending(false)
    }
  }

  const toggleSubscriberSelection = (subscriber: NewsletterSubscriber) => {
    setSelectedSubscribers(prev => {
      const exists = prev.find(s => s.id === subscriber.id)
      if (exists) {
        return prev.filter(s => s.id !== subscriber.id)
      } else {
        return [...prev, subscriber]
      }
    })
  }

  const selectAllSubscribers = () => {
    if (selectedSubscribers.length === subscribers.length) {
      setSelectedSubscribers([])
    } else {
      setSelectedSubscribers([...subscribers])
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Send Newsletter</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Compose and send bulk emails to your newsletter subscribers.
        </p>
      </motion.div>

      {/* Status Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
        >
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            {error}
          </div>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
        >
          <div className="flex items-center">
            <PaperAirplaneIcon className="h-5 w-5 mr-2" />
            {success}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Email Composition */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Compose Newsletter</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter newsletter subject..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  placeholder="Write your newsletter content here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Use line breaks to separate paragraphs. HTML formatting is not supported in this basic version.
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setPreview(!preview)}
                  className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <EyeIcon className="h-5 w-5 mr-2" />
                  {preview ? 'Edit' : 'Preview'}
                </motion.button>

                <motion.button
                  onClick={handleSendNewsletter}
                  disabled={sending || !subject.trim() || !content.trim() || selectedSubscribers.length === 0}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: sending ? 1 : 1.02 }}
                  whileTap={{ scale: sending ? 1 : 0.98 }}
                >
                  <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                  {sending ? 'Sending...' : `Send to ${selectedSubscribers.length} subscriber(s)`}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Preview */}
          {preview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email Preview</h3>
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                {subject && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Subject:</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{subject}</p>
                  </div>
                )}
                <div className="prose dark:prose-invert max-w-none">
                  {content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0 text-gray-700 dark:text-gray-300">
                      {paragraph || '\u00A0'}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Subscriber Selection */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recipients</h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <UserGroupIcon className="h-4 w-4 mr-1" />
                {selectedSubscribers.length} / {subscribers.length}
              </div>
            </div>

            <div className="mb-4">
              <motion.button
                onClick={selectAllSubscribers}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedSubscribers.length === subscribers.length ? 'Deselect All' : 'Select All'}
              </motion.button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {subscribers.map((subscriber) => (
                  <motion.div
                    key={subscriber.id}
                    className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    whileHover={{ scale: 1.01 }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.some(s => s.id === subscriber.id)}
                      onChange={() => toggleSubscriberSelection(subscriber)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {subscriber.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Joined {new Date(subscriber.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {subscribers.length === 0 && (
                  <div className="text-center py-8">
                    <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No subscribers yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Newsletter Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700"
          >
            <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Newsletter Tips</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <li>• Keep your subject line under 50 characters</li>
              <li>• Write engaging, personal content</li>
              <li>• Include a clear call-to-action</li>
              <li>• Test your content before sending</li>
              <li>• Consider your audience&apos;s timezone</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
