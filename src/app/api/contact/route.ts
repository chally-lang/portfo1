// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface ContactFormInput {
  name: string
  email: string
  message: string
}

// Fallback storage for when Prisma is not available
const contactMessages: ContactFormInput[] = []

// Email validation function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ContactFormInput
    const { name, email, message } = body

    // Validate all fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    // Validate message length
    if (message.length < 10) {
      return NextResponse.json({ error: 'Message must be at least 10 characters long' }, { status: 400 })
    }

    // Validate name length
    if (name.length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters long' }, { status: 400 })
    }

    // Try to save to database
    try {
      const contact = await prisma.contactMessage.create({
        data: { name, email, message },
      })
      return NextResponse.json({ 
        success: true, 
        message: 'Message sent successfully!',
        contact 
      })
    } catch (dbError: unknown) {
      console.error('Database error:', dbError)
      // For database errors, fall back to in-memory storage
      console.log('Falling back to in-memory storage')
    }

    // Fallback: Store in memory
    const contactMessage = {
      id: Date.now().toString(),
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    }
    
    contactMessages.push(contactMessage)
    console.log('Contact message added to fallback storage:', { name, email })

    // Here you could also send an email notification
    // For now, we'll just log it
    console.log('New contact message:', {
      from: name,
      email: email,
      message: message.substring(0, 100) + '...'
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully! We\'ll get back to you soon.',
      contact: contactMessage
    })

  } catch (error) {
    console.error('Error saving contact message:', error)
    return NextResponse.json({ 
      error: 'Failed to send message. Please try again later.' 
    }, { status: 500 })
  }
}

// GET endpoint to retrieve contact messages (for admin use)
export async function GET() {
  try {
    let messages = []

    // Try to get from database first
    try {
      messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
      })
    } catch (error) {
      console.error('Database fetch error:', error)
      // If database fails, use fallback storage
      messages = contactMessages.slice(-50).reverse()
    }

    return NextResponse.json({ 
      messages,
      total: messages.length
    })

  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
} 