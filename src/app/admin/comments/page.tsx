'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline'

interface Comment {
  id: string
  postId: string
  author: string
  email: string
  content: string
  createdAt: string
  approved: boolean
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/comments')
      if (!response.ok) {
        throw new Error('Failed to fetch comments')
      }
      const data = await response.json()
      setComments(data.comments)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCommentAction = async (commentId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId, action })
      })

      if (!response.ok) {
        throw new Error('Failed to update comment')
      }

      // Refresh comments
      await fetchComments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
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

  const pendingComments = comments.filter(c => !c.approved)
  const approvedComments = comments.filter(c => c.approved)

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
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Comments</h2>
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
        <motion.button 
          onClick={fetchComments}
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Comments Management</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Moderate and manage blog comments from your portfolio visitors.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Comments</h3>
          <p className="text-3xl font-bold text-blue-600">{comments.length}</p>
        </motion.div>
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pending Approval</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingComments.length}</p>
        </motion.div>
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Approved</h3>
          <p className="text-3xl font-bold text-green-600">{approvedComments.length}</p>
        </motion.div>
      </motion.div>

      {/* Pending Comments */}
      {pendingComments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Pending Comments ({pendingComments.length})
          </h2>
          <div className="space-y-4">
            {pendingComments.map((comment) => (
              <motion.div
                key={comment.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 border-yellow-500"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{comment.author}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{comment.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleCommentAction(comment.id, 'approve')}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <CheckIcon className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleCommentAction(comment.id, 'reject')}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Approved Comments */}
      {approvedComments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Approved Comments ({approvedComments.length})
          </h2>
          <div className="space-y-4">
            {approvedComments.map((comment) => (
              <motion.div
                key={comment.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 border-green-500"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{comment.author}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{comment.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleCommentAction(comment.id, 'reject')}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {comments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-600 dark:text-gray-300 text-lg">No comments found.</p>
        </motion.div>
      )}
    </div>
  )
}