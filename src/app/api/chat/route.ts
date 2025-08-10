import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Simple fallback response function
function generateSimpleResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! I'm your AI assistant. How can I help you today?";
  } else if (lowerMessage.includes('project') || lowerMessage.includes('portfolio')) {
    return "I'd love to tell you about my projects! I specialize in modern web development with React, Next.js, and TypeScript. Would you like to know more about my experience or see specific examples?";
  } else if (lowerMessage.includes('contact') || lowerMessage.includes('hire')) {
    return `I'm available for new projects! You can reach me at:\n📧 ${process.env.DEVELOPER_EMAIL}\n📱 ${process.env.DEVELOPER_PHONE}\n\nWhat kind of project are you working on?`;
  } else {
    return "Thanks for your message! I'm here to help you learn more about my development services, projects, and availability. What would you like to know?";
  }
}

// Generate response using Groq
async function generateGroqResponse(message: string): Promise<string> {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant for a skilled full-stack developer. Be helpful, professional, and concise. Developer contact: ${process.env.DEVELOPER_EMAIL}, ${process.env.DEVELOPER_PHONE}`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || generateSimpleResponse(message);

  } catch (error) {
    console.error("Groq API error:", error);
    return generateSimpleResponse(message);
  }
}

export async function POST(req: Request) {
  try {
    const { sessionId, message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Save user message
    try {
      await prisma.conversation.create({
        data: { sessionId, role: "user", message },
      });
    } catch (dbError) {
      console.error("Database error saving user message:", dbError);
    }

    // Generate response using Groq (with fallback)
    const reply = await generateGroqResponse(message);

    // Save assistant reply
    try {
      await prisma.conversation.create({
        data: { sessionId, role: "assistant", message: reply },
      });
    } catch (dbError) {
      console.error("Database error saving assistant message:", dbError);
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
