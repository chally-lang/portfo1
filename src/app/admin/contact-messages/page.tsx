'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrashIcon, 
  EnvelopeIcon,
  XMarkIcon,
  PaperAirplaneIcon 
} from '@heroicons/react/24/outline'

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replySubject, setReplySubject] = useState('')
  const [sendingReply, setSendingReply] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/contact-messages')
      if (!response.ok) {
        throw new Error('Failed to fetch contact messages')
      }
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/contact-messages', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: messageId, type: 'message' })
      })

      if (!response.ok) {
        throw new Error('Failed to delete message')
      }

      // Refresh messages
      await fetchMessages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete message')
    }
  }

  const handleReply = (message: ContactMessage) => {
    setSelectedMessage(message)
    setReplySubject(`Re: Message from ${message.name}`)
    setReplyText(`Hi ${message.name.split(' ')[0]},\n\nThank you for reaching out!\n\n`)
  }

  const sendReply = async () => {
    if (!selectedMessage || !replyText.trim() || !replySubject.trim()) {
      return
    }

    setSendingReply(true)
    try {
      const response = await fetch('/api/admin/reply-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedMessage.email,
          subject: replySubject,
          message: replyText,
          originalMessage: selectedMessage.message,
          senderName: selectedMessage.name
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send reply')
      }

      // Close reply modal and reset form
      setSelectedMessage(null)
      setReplyText('')
      setReplySubject('')
      
      alert('Reply sent successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reply')
    } finally {
      setSendingReply(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Messages</h2>
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
        <motion.button 
          onClick={fetchMessages}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contact Messages</h1>
          <p className="text-gray-600 dark:text-gray-300">
            View and respond to messages from your portfolio contact form.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8"
        >
          <div className="flex items-center">
            <EnvelopeIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Messages</h3>
              <p className="text-3xl font-bold text-green-600">{messages.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        {messages.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{message.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{message.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleReply(message)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Reply to message"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete message"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{message.message}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <EnvelopeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 text-lg">No contact messages yet.</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Messages from your contact form will appear here.
            </p>
          </motion.div>
        )}
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Reply to {selectedMessage.name}
                </h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Original Message */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original Message:</h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    From: {selectedMessage.email}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Date: {formatDate(selectedMessage.createdAt)}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Reply Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Reply subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Type your reply here..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={sendReply}
                    disabled={sendingReply || !replyText.trim() || !replySubject.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: sendingReply ? 1 : 1.02 }}
                    whileTap={{ scale: sendingReply ? 1 : 0.98 }}
                  >
                    {sendingReply ? 'Sending...' : 'Send Reply'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}