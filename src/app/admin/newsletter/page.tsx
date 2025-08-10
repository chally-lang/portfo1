'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrashIcon, 
  UserGroupIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface NewsletterSubscriber {
  id: string
  email: string
  createdAt: string
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchSubscribers()
  }, [])

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
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (!confirm('Are you sure you want to remove this subscriber?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/contact-messages', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: subscriberId, type: 'subscriber' })
      })

      if (!response.ok) {
        throw new Error('Failed to delete subscriber')
      }

      // Remove from selected list if it was selected
      setSelectedSubscribers(prev => prev.filter(id => id !== subscriberId))
      
      // Refresh subscribers
      await fetchSubscribers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete subscriber')
    }
  }

  const toggleSubscriberSelection = (subscriberId: string) => {
    setSelectedSubscribers(prev => 
      prev.includes(subscriberId) 
        ? prev.filter(id => id !== subscriberId)
        : [...prev, subscriberId]
    )
  }

  const selectAllSubscribers = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([])
    } else {
      setSelectedSubscribers(filteredSubscribers.map(sub => sub.id))
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

  // Filter subscribers based on search term
  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Subscribers</h2>
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
        <motion.button 
          onClick={fetchSubscribers}
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
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Newsletter Subscribers</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your newsletter subscribers and select recipients for bulk emails.
        </p>
      </motion.div>

      {/* Stats and Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Subscribers</h3>
              <p className="text-3xl font-bold text-purple-600">{subscribers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Selected</h3>
              <p className="text-3xl font-bold text-blue-600">{selectedSubscribers.length}</p>
            </div>
            {selectedSubscribers.length > 0 && (
              <a
                href={`/admin/send-newsletter?selected=${selectedSubscribers.join(',')}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Newsletter
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Search and Bulk Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search subscribers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <div className="flex gap-2">
          <motion.button
            onClick={selectAllSubscribers}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {selectedSubscribers.length === filteredSubscribers.length ? 'Deselect All' : 'Select All'}
          </motion.button>
        </div>
      </motion.div>

      {/* Subscribers List */}
      {filteredSubscribers.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Table Header */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                  onChange={selectAllSubscribers}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Email Address
              </div>
              <div className="ml-auto text-sm font-medium text-gray-900 dark:text-white">
                Subscribed Date
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredSubscribers.map((subscriber) => (
              <motion.div
                key={subscriber.id}
                className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onChange={() => toggleSubscriberSelection(subscriber.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {subscriber.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(subscriber.createdAt)}
                    </span>
                    <motion.button
                      onClick={() => handleDeleteSubscriber(subscriber.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Remove subscriber"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {searchTerm ? 'No subscribers found matching your search.' : 'No newsletter subscribers yet.'}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {searchTerm ? 'Try adjusting your search term.' : 'Subscribers will appear here when people sign up for your newsletter.'}
          </p>
        </motion.div>
      )}

      {/* Selected Summary */}
      {selectedSubscribers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-lg shadow-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <CheckIcon className="h-5 w-5" />
            <span className="font-medium">{selectedSubscribers.length} selected</span>
            <a
              href={`/admin/send-newsletter?selected=${selectedSubscribers.join(',')}`}
              className="px-3 py-1 bg-white text-blue-600 rounded font-medium hover:bg-gray-100 transition-colors"
            >
              Send Newsletter
            </a>
          </div>
        </motion.div>
      )}
    </div>
  )
}