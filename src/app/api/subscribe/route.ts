import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface NewsletterInput {
  email: string
}

// Fallback storage for when Prisma is not available
const subscribers: string[] = []

// Email validation function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const { email } = (await request.json()) as NewsletterInput

    // Validate email
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    // Check if email already exists
    if (subscribers.includes(email)) {
      return NextResponse.json({ error: 'Email is already subscribed' }, { status: 409 })
    }

    // Try to save to database
    try {
      const subscriber = await prisma.newsletterSubscriber.create({
        data: { email },
      })
      return NextResponse.json({ success: true, subscriber })
    } catch (dbError: unknown) {
      console.error('Database error:', dbError)
      
      // If it's a duplicate error, handle gracefully
      if ((dbError as Record<string, unknown>).code === 'P2002') {
        return NextResponse.json({ error: 'Email is already subscribed' }, { status: 409 })
      }
      
      // For other database errors, fall back to in-memory storage
      console.log('Falling back to in-memory storage')
    }

    // Fallback: Store in memory
    subscribers.push(email)
    console.log('Subscriber added to fallback storage:', email)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter',
      subscriber: { email, id: Date.now().toString() }
    })

  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json({ 
      error: 'Subscription failed. Please try again later.' 
    }, { status: 500 })
  }
}

// GET endpoint to check subscription status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email parameter required' }, { status: 400 })
  }

  try {
    let isSubscribed = false

    // Check database first
    try {
      const subscriber = await prisma.newsletterSubscriber.findUnique({
        where: { email }
      })
      isSubscribed = !!subscriber
    } catch (error) {
      console.error('Database check error:', error)
      // Check fallback storage if database fails
      isSubscribed = subscribers.includes(email)
    }

    return NextResponse.json({ 
      subscribed: isSubscribed,
      email 
    })

  } catch (error) {
    console.error('Subscription check error:', error)
    return NextResponse.json({ error: 'Failed to check subscription' }, { status: 500 })
  }
}
