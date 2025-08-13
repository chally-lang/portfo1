
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { UserIcon, CalendarIcon, PaperAirplaneIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { useUser, SignInButton } from '@clerk/nextjs'

interface Comment {
  id: string
  postId: string
  author: string
  email: string
  content: string
  createdAt: string
  approved: boolean
}

interface CommentsProps {
  postId: string
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ content: '' })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const { isSignedIn, user } = useUser()

  // Moved outside useEffect so it can be called anywhere
  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/comments?postId=${postId}`)
      if (!response.ok) throw new Error('Failed to fetch comments')
      const data = await response.json()
      setComments(data.comments)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isSignedIn) {
      setMessage({ type: 'error', text: 'Please sign in to comment' })
      return
    }

    if (!formData.content.trim()) {
      setMessage({ type: 'error', text: 'Please enter a comment' })
      return
    }

    if (formData.content.length < 10) {
      setMessage({ type: 'error', text: 'Comment must be at least 10 characters long' })
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          author: user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'Anonymous',
          email: user?.emailAddresses[0]?.emailAddress || '',
          content: formData.content.trim()
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit comment')
      }

      setMessage({ type: 'success', text: 'Comment submitted successfully! It will be visible after approval.' })
      setFormData({ content: '' })
      setShowForm(false)

      setTimeout(() => fetchComments(), 1000)
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to submit comment' })
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>

      {!showForm ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          {isSignedIn ? (
            <button onClick={() => setShowForm(true)} className="w-full text-center text-gray-500 dark:text-gray-400 hover:text-primary hover:border-primary transition-colors">
              <div className="flex items-center justify-center gap-2">
                <UserIcon className="h-5 w-5" />
                <span>Add a comment...</span>
              </div>
            </button>
          ) : (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <LockClosedIcon className="h-6 w-6 text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">Sign in to comment</span>
              </div>
              <SignInButton>
                <button className="btn btn-primary btn-animated">Sign In to Comment</button>
              </SignInButton>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="card p-6 mb-6">
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0]}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Commenting as {user?.emailAddresses[0]?.emailAddress}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Comment *</label>
            <textarea
              id="content"
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Share your thoughts on this article..."
              required
            />
          </div>

          {message && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
              {message.text}
            </motion.div>
          )}

          <div className="flex items-center gap-3">
            <motion.button type="submit" disabled={submitting} className="btn btn-primary btn-animated" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {submitting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <PaperAirplaneIcon className="h-4 w-4" />}
              {submitting ? 'Submitting...' : 'Submit Comment'}
            </motion.button>
            <motion.button type="button" onClick={() => { setShowForm(false); setMessage(null); setFormData({ content: '' }) }} className="btn btn-outline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Cancel
            </motion.button>
          </div>
        </motion.form>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment, index) => (
            <motion.div key={comment.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{comment.author}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="h-4 w-4" />
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No comments yet. Be the first to share your thoughts!</p>
        </motion.div>
      )}
    </div>
  )
}
