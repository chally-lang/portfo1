import { NextResponse } from 'next/server'
// import { auth } from '@clerk/nextjs/server'

interface Comment {
  id: string
  postId: string
  author: string
  email: string
  content: string
  createdAt: string
  approved: boolean
}

// In-memory storage for comments (replace with Neon Postgres later)
const comments: Comment[] = [
  {
    id: '1',
    postId: 'devto-123',
    author: 'John Doe',
    email: 'john@example.com',
    content: 'Great article! Very helpful for understanding React hooks.',
    createdAt: new Date().toISOString(),
    approved: false
  },
  {
    id: '2',
    postId: 'hashnode-456',
    author: 'Jane Smith',
    email: 'jane@example.com',
    content: 'Excellent explanation of TypeScript best practices.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    approved: true
  },
  {
    id: '3',
    postId: 'medium-789',
    author: 'Mike Johnson',
    email: 'mike@example.com',
    content: 'This really helped me with my Next.js project. Thanks!',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    approved: false
  }
]

export async function GET() {
  try {
    // Temporarily disabled authentication check
    // const { userId } = await auth()
    
    // if (!userId) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }
    
    // Return all comments (including unapproved) for admin
    const allComments = [...comments].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    return NextResponse.json({ 
      comments: allComments,
      total: allComments.length,
      pending: allComments.filter(c => !c.approved).length
    })
  } catch (error) {
    console.error('Error fetching admin comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    // Temporarily disabled authentication check
    // const { userId } = await auth()
    
    // if (!userId) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }
    
    const body = await request.json()
    const { commentId, action } = body
    
    if (!commentId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const commentIndex = comments.findIndex(c => c.id === commentId)
    
    if (commentIndex === -1) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }
    
    if (action === 'approve') {
      comments[commentIndex].approved = true
    } else if (action === 'reject') {
      comments.splice(commentIndex, 1)
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ 
      message: `Comment ${action}d successfully`,
      comment: comments[commentIndex] || null
    })
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    )
  }
} 