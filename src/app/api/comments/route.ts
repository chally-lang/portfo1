import { NextResponse } from 'next/server'

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
const comments: Comment[] = []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get('postId')
  
  try {
    let filteredComments = comments.filter(comment => comment.approved)
    
    if (postId) {
      filteredComments = filteredComments.filter(comment => comment.postId === postId)
    }
    
    // Sort by creation date (newest first)
    filteredComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return NextResponse.json({ 
      comments: filteredComments,
      total: filteredComments.length
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { postId, author, email, content } = body
    
    // Validation
    if (!postId || !author || !email || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    if (content.length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters long' },
        { status: 400 }
      )
    }
    
    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be less than 1000 characters' },
        { status: 400 }
      )
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      postId,
      author: author.trim(),
      email: email.trim().toLowerCase(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      approved: false // Comments need approval by default
    }
    
    comments.push(newComment)
    
    return NextResponse.json({ 
      message: 'Comment submitted successfully and awaiting approval',
      comment: {
        ...newComment,
        content: undefined // Don't return content for security
      }
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
} 