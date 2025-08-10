'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { CalendarIcon, ClockIcon, UserIcon, TagIcon, HeartIcon, BookmarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import Comments from '../../components/Comments'
import { useUser } from '@clerk/nextjs';

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
  body_html?: string; // Added for full article content
}

export default function BlogPostDetail() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isSignedIn } = useUser() || { isSignedIn: false };
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/blogs')
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts')
        }
        const data = await response.json()
        const decodedId = decodeURIComponent(params.id as string)
        const foundPost = data.posts.find((p: BlogPost) => p.id === decodedId)
        
        if (foundPost) {
          setPost(foundPost)
        } else {
          setError('Blog post not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    fetchBlogPost()
  }, [params.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Like/bookmark handlers
  const handleLike = () => setLiked((prev) => !prev);
  const handleBookmark = () => setBookmarked((prev) => !prev);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Blog Post Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error || 'The blog post you are looking for does not exist.'}
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Blog
        </Link>
      </motion.div>

      {/* Blog Post Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {formatDate(post.publishedAt)}
            </div>
            {post.readTime && (
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4" />
                {post.readTime} min read
              </div>
            )}
            {isSignedIn && (
              <div className="flex gap-2 mt-2">
                <motion.button 
                  onClick={handleLike} 
                  className={`p-2 rounded-full ${liked ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-gray-700 text-primary'} transition-all duration-300`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <HeartIcon className="h-5 w-5" />
                </motion.button>
                <motion.button 
                  onClick={handleBookmark} 
                  className={`p-2 rounded-full ${bookmarked ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-gray-700 text-primary'} transition-all duration-300`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <BookmarkIcon className="h-5 w-5" />
                </motion.button>
              </div>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  <TagIcon className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Image
              src={post.coverImage}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </motion.div>
        )}

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg dark:prose-invert max-w-none mb-8"
        >
          <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300">
            {post.description}
          </p>
        </motion.div>

        {/* Article Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="prose prose-lg dark:prose-invert max-w-none mb-8 bg-white dark:bg-dark-blue p-8 rounded-xl shadow-lg"
          dangerouslySetInnerHTML={{ __html: post.body_html || '' }}
        />

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Comments postId={post.id} />
        </motion.div>
      </motion.article>
    </div>
  )
} 