'use client'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const adminEmail = 'young4orch@gmail.com';
  const { isSignedIn, user } = useUser();
  const isAdmin = isSignedIn && user?.primaryEmailAddress?.emailAddress === adminEmail;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed w-full bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 backdrop-blur-md z-50 border-b border-gray-700">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gradient">
            CharlesTech&trade;
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
            
            {/* Authentication */}
            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-gray-300 font-medium">
                      {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0]}
                    </span>
                  </div>
                  
                  {isAdmin && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href="/admin"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm"
                      >
                        Admin Dashboard
                      </Link>
                    </motion.div>
                  )}
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <SignOutButton>
                      <button className="px-4 py-2 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-colors duration-200 text-sm">
                        Sign Out
                      </button>
                    </SignOutButton>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SignInButton>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                      Sign In
                    </button>
                  </SignInButton>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-300" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-300" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900 border-t border-gray-700"
          >
            <div className="px-4 py-2 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Authentication */}
              <div className="pt-4 border-t border-gray-700">
                {isSignedIn ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <UserIcon className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-300">
                        {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0]}
                      </span>
                    </div>
                    
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-3 py-2 text-blue-400 hover:text-blue-300 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <SignOutButton>
                      <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200">
                        Sign Out
                      </button>
                    </SignOutButton>
                  </div>
                ) : (
                  <SignInButton>
                    <button className="w-full text-left px-3 py-2 text-blue-400 hover:text-blue-300 hover:bg-gray-800 rounded-lg transition-colors duration-200">
                      Sign In
                    </button>
                  </SignInButton>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
} 