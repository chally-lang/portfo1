
'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  HeartIcon,
  BookmarkIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'

interface BlogPost {
  id: string
  title: string
  description: string
  url: string
  publishedAt: string
  author: string
  tags: string[]
  coverImage?: string
  readTime?: number
  source?: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(9)
  // Authentication available for future features
  const [liked, setLiked] = useState<{ [id: string]: boolean }>({})
  const [bookmarked, setBookmarked] = useState<{ [id: string]: boolean }>({})

  const techTags = ['javascript', 'react', 'nextjs', 'typescript', 'ai', 'machine-learning', 'web-development', 'programming']

  // ✅ Moved here before useEffect so it's defined when used in dependencies
  const filterAndPaginatePosts = useCallback(() => {
    let filtered = allPosts

    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter(post =>
        post.tags?.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase())) || false
      )
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) || false
      )
    }

    // Paginate
    const startIndex = (currentPage - 1) * postsPerPage
    const endIndex = startIndex + postsPerPage
    setPosts(filtered.slice(startIndex, endIndex))
  }, [allPosts, selectedTag, searchQuery, currentPage, postsPerPage])

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  useEffect(() => {
    filterAndPaginatePosts()
  }, [filterAndPaginatePosts])

  const fetchBlogPosts = async () => {
    try {
      setLoading(true)
      // Fetch all blogs without pagination limit
      const response = await fetch('/api/blogs')
      if (!response.ok) throw new Error('Failed to fetch blog posts')
      const data = await response.json()
      setAllPosts(data.posts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(
    allPosts.filter(post => {
      if (selectedTag !== 'all') {
        if (!Array.isArray(post.tags) || !post.tags.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase()))) {
          return false
        }
      }
      if (searchQuery.trim()) {
        return (
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (Array.isArray(post.tags) && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
        )
      }
      return true
    }).length / postsPerPage
  )

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

  const handleLike = (id: string) => setLiked(prev => ({ ...prev, [id]: !prev[id] }))
  const handleBookmark = (id: string) => setBookmarked(prev => ({ ...prev, [id]: !prev[id] }))

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Blogs</h2>
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
        <button
          onClick={fetchBlogPosts}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Tech Blog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Stay updated with the latest in technology, programming, AI, and modern frameworks
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="relative max-w-md mx-auto">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* Filter Tags */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {['all', ...techTags].map(tag => (
          <motion.button
            key={tag}
            onClick={() => handleTagChange(tag)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedTag === tag
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Blog Posts Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card card-hover overflow-hidden bg-white dark:bg-gray-900 rounded-lg shadow"
          >
            {post.coverImage && (
              <div className="aspect-video overflow-hidden">
                <Image src={post.coverImage} alt={post.title} width={400} height={225} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-1"><CalendarIcon className="h-4 w-4" />{formatDate(post.publishedAt)}</div>
                {post.readTime && <div className="flex items-center gap-1"><ClockIcon className="h-4 w-4" />{post.readTime} min read</div>}
              </div>

              <h3 className="text-xl font-bold mb-2 line-clamp-2">
                <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">{post.title}</Link>
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">{post.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1"><UserIcon className="h-4 w-4" />{post.author}</div>
                <div className="flex items-center gap-1"><TagIcon className="h-4 w-4" />{post.tags?.slice(0, 2).join(', ') || 'Tech'}</div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => handleLike(post.id)}><HeartIcon className={`h-5 w-5 ${liked[post.id] ? 'text-red-500' : 'text-gray-400'}`} /></button>
                  <button onClick={() => handleBookmark(post.id)}><BookmarkIcon className={`h-5 w-5 ${bookmarked[post.id] ? 'text-blue-500' : 'text-gray-400'}`} /></button>
                </div>
                <div className="flex items-center gap-2">
                  {post.source && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.source === 'dev.to' ? 'bg-purple-100 text-purple-700' :
                      post.source === 'hashnode' ? 'bg-blue-100 text-blue-700' :
                      post.source === 'medium' ? 'bg-green-100 text-green-700' :
                      post.source === 'rss' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {post.source}
                    </span>
                  )}
                  <Link href={`/blog/${post.id}`} className="text-sm font-medium text-primary hover:underline">Read More</Link>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="flex justify-center items-center gap-2 mt-12"
        >
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded-lg ${
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </motion.div>
      )}

      {posts.length === 0 && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300 text-lg">No posts found for the selected criteria.</p>
        </motion.div>
      )}
    </div>
  )
}
