'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ChatBubbleLeftRightIcon, 
  EnvelopeIcon, 
  UserGroupIcon,
  PaperAirplaneIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  comments: number
  pendingComments: number
  contactMessages: number
  newsletterSubscribers: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    comments: 0,
    pendingComments: 0,
    contactMessages: 0,
    newsletterSubscribers: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      // Fetch all stats in parallel
      const [commentsRes, contactRes] = await Promise.all([
        fetch('/api/admin/comments'),
        fetch('/api/admin/contact-messages')
      ])

      const commentsData = commentsRes.ok ? await commentsRes.json() : { comments: [] }
      const contactData = contactRes.ok ? await contactRes.json() : { messages: [], subscribers: [] }

      setStats({
        comments: commentsData.comments?.length || 0,
        pendingComments: commentsData.comments?.filter((c: { approved?: boolean }) => !c.approved)?.length || 0,
        contactMessages: contactData.messages?.length || 0,
        newsletterSubscribers: contactData.subscribers?.length || 0
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  const dashboardItems = [
    {
      title: 'Comments Management',
      description: 'Moderate and manage blog comments',
      count: stats.comments,
      pendingCount: stats.pendingComments,
      href: '/admin/comments',
      icon: ChatBubbleLeftRightIcon,
      color: 'blue'
    },
    {
      title: 'Contact Messages',
      description: 'View and respond to contact form submissions',
      count: stats.contactMessages,
      href: '/admin/contact-messages',
      icon: EnvelopeIcon,
      color: 'green'
    },
    {
      title: 'Newsletter Subscribers',
      description: 'Manage email newsletter subscribers',
      count: stats.newsletterSubscribers,
      href: '/admin/newsletter',
      icon: UserGroupIcon,
      color: 'purple'
    },
    {
      title: 'Send Newsletter',
      description: 'Send bulk emails to subscribers',
      href: '/admin/send-newsletter',
      icon: PaperAirplaneIcon,
      color: 'orange'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-500 text-blue-600',
      green: 'border-green-500 text-green-600',
      purple: 'border-purple-500 text-purple-600',
      orange: 'border-orange-500 text-orange-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
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
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
        <motion.button 
          onClick={fetchStats}
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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome back! Here&apos;s an overview of your portfolio management.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Comments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.comments}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center">
            <EnvelopeIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contact Messages</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.contactMessages}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Newsletter Subscribers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.newsletterSubscribers}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Comments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingComments}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Management Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {dashboardItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Link href={item.href}>
              <motion.div
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 ${getColorClasses(item.color)} hover:shadow-md transition-shadow cursor-pointer`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <item.icon className={`h-8 w-8 ${getColorClasses(item.color)}`} />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-400" />
                    {item.count !== undefined && (
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{item.count}</span>
                        {item.pendingCount !== undefined && item.pendingCount > 0 && (
                          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            {item.pendingCount} pending
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/comments">
              <motion.button
                className="w-full p-4 text-left bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Moderate Comments</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Review pending comments</p>
              </motion.button>
            </Link>
            
            <Link href="/admin/contact-messages">
              <motion.button
                className="w-full p-4 text-left bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h4 className="font-medium text-green-900 dark:text-green-100">Check Messages</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">View contact form submissions</p>
              </motion.button>
            </Link>
            
            <Link href="/admin/send-newsletter">
              <motion.button
                className="w-full p-4 text-left bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h4 className="font-medium text-orange-900 dark:text-orange-100">Send Newsletter</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">Compose and send bulk email</p>
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 