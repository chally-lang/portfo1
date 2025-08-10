'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  HomeIcon, 
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  UserGroupIcon,
  PaperAirplaneIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Comments', href: '/admin/comments', icon: ChatBubbleLeftRightIcon },
  { name: 'Contact Messages', href: '/admin/contact-messages', icon: EnvelopeIcon },
  { name: 'Newsletter Subscribers', href: '/admin/newsletter', icon: UserGroupIcon },
  { name: 'Send Newsletter', href: '/admin/send-newsletter', icon: PaperAirplaneIcon },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <motion.div
        className="fixed inset-0 z-50 lg:hidden"
        initial={false}
        animate={{ opacity: sidebarOpen ? 1 : 0, pointerEvents: sidebarOpen ? 'auto' : 'none' }}
      >
        <div 
          className="fixed inset-0 bg-gray-900/80" 
          onClick={() => setSidebarOpen(false)}
        />
        <motion.div
          className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl"
          initial={{ x: '-100%' }}
          animate={{ x: sidebarOpen ? 0 : '-100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-50 border-r-2 border-blue-600 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </motion.div>
      </motion.div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          </div>
          <nav className="mt-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-50 border-r-2 border-blue-600 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:hidden">
          <button
            type="button"
            className="text-gray-700 dark:text-gray-300"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {navigation.find(item => item.href === pathname)?.name || 'Admin'}
              </h1>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6 px-4 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}