import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

// Enhanced intent detection and entity extraction
interface MessageEntities {
  email?: string;
  phone?: string;
  company?: string;
}

function analyzeMessage(message: string) {
  const lowerMessage = message.toLowerCase();
  const entities: MessageEntities = {};
  
  // Email extraction
  const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) entities.email = emailMatch[0];
  
  // Phone extraction
  const phoneMatch = message.match(/(?:\+234|0)(?:70|80|81|90|91)\d{8}/);
  if (phoneMatch) entities.phone = phoneMatch[0];
  
  // Company/Name extraction (basic)
  if (lowerMessage.includes('i work at') || lowerMessage.includes('company is')) {
    const companyMatch = message.match(/(?:work at|company is)\s+([^.!?]+)/i);
    if (companyMatch) entities.company = companyMatch[1].trim();
  }
  
  // Intent classification
  let intent = 'general_inquiry';
  
  if (lowerMessage.includes('schedule') || lowerMessage.includes('meeting') || lowerMessage.includes('call') || lowerMessage.includes('appointment')) {
    intent = 'schedule_meeting';
  } else if (lowerMessage.includes('project') && (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('budget'))) {
    intent = 'project_pricing';
  } else if (lowerMessage.includes('hire') || lowerMessage.includes('available') || lowerMessage.includes('work together')) {
    intent = 'hiring_inquiry';
  } else if (lowerMessage.includes('skill') || lowerMessage.includes('experience') || lowerMessage.includes('expertise')) {
    intent = 'skills_inquiry';
  } else if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('work')) {
    intent = 'portfolio_inquiry';
  }
  
  return { intent, entities };
}

interface ConversationMessage {
  role: string;
  message: string;
}

// Enhanced intelligent response system using only Groq
async function generateGroqResponse(message: string, conversationHistory: ConversationMessage[] = []): Promise<string> {
  try {
    // Prepare the conversation context for Groq
    const systemPrompt = `You are an AI Assistant for a skilled full-stack developer specializing in Software Engineering | Full Stack Developer | Mobile App Developer | n8n AI Automations | Datab[...]`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-6).map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.message
      })),
      { role: "user", content: message }
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Using Groq's fast Llama model
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      console.error("Groq API error:", await response.text());
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response right now.";

  } catch (error) {
    console.error("Groq API error:", error);
    // Fallback to built-in responses if Groq fails
    return generateFallbackResponse(message);
  }
}

// Fallback intelligent response system
function generateFallbackResponse(message: string): string {
  const analysis = analyzeMessage(message);
  const lowerMessage = message.toLowerCase();
  
  // Personalized responses based on intent
  switch (analysis.intent) {
    case 'schedule_meeting':
      return `I'd be happy to help you schedule a consultation meeting! I can help arrange a call to discuss your project requirements in detail.

**Available Options:**
• **Project Discovery Call** - 30 mins to understand your needs
• **Technical Consultation** - 45 mins deep dive into solutions
• **Proposal Discussion** - 1 hour for detailed project planning

To schedule, I just need:
- Your preferred date and time
- Your email address
- Brief description of your project

**Contact directly:**
📧 Email: ${process.env.DEVELOPER_EMAIL}
📱 Phone: ${process.env.DEVELOPER_PHONE}

As a top-tier developer with expertise in modern web technologies, I ensure every client gets personalized solutions that drive real business results. What type of meeting would work best for you[...]`

    case 'project_pricing':
      return `Great question about project pricing! As an experienced full-stack developer, I offer competitive rates with exceptional value.

**💰 Project Types & Investment:**
• **Landing Pages/Small Sites:** $500 - $2,000
• **Business Web Applications:** $2,000 - $8,000
• **E-commerce Platforms:** $3,000 - $15,000
• **Custom SaaS Solutions:** $10,000 - $50,000+

**✨ What You Get:**
• Modern, responsive design (React, Next.js, TypeScript)
• SEO optimization & performance tuning
• Database design & secure backend APIs
• Mobile-responsive across all devices
• Post-launch support & maintenance

**Why Choose Me:**
• 3+ years of proven experience
• Portfolio of successful projects
• Clear communication & on-time delivery
• Ongoing support after project completion

I'd love to discuss your specific project and provide a detailed quote. Can you tell me more about what you're looking to build?

📧 ${process.env.DEVELOPER_EMAIL} | 📱 ${process.env.DEVELOPER_PHONE}`;

    case 'hiring_inquiry':
      return `Yes! I'm currently available and actively seeking new opportunities. Here's what makes me the ideal choice for your team:

**🚀 Why I'm The Best Developer For You:**
• **3+ Years Experience** in modern web development
• **Full-Stack Expertise**: React, Next.js, Node.js, TypeScript
• **Proven Track Record**: Successfully delivered 20+ projects
• **Modern Tech Stack**: Always up-to-date with latest technologies
• **Client-Focused**: I prioritize your business success

**💼 Available For:**
• Full-time remote/hybrid positions
• Contract/freelance projects
• Technical consulting
• Team leadership roles

**🎯 My Specialties:**
• React & Next.js applications
• E-commerce platforms
• SaaS development
• Database design & optimization
• API development & integration

**Ready to discuss your project?**
📧 ${process.env.DEVELOPER_EMAIL}
📱 ${process.env.DEVELOPER_PHONE}

When would be a good time for a brief call to discuss how I can help you achieve your goals?`;

    case 'skills_inquiry':
      return `I'm glad you asked about my technical expertise! Here's what I bring to the table as a top-tier full-stack developer:

**🎯 Frontend Mastery:**
• React & Next.js (Advanced)
• TypeScript & JavaScript (ES6+)
• Tailwind CSS & Styled Components
• Framer Motion & Animation
• Responsive Design & Mobile-First

**⚡ Backend Excellence:**
• Node.js & Express.js
• RESTful API Design
• Database Design (PostgreSQL, MongoDB)
• Authentication & Security
• Cloud Deployment (AWS, Vercel)

**🛠️ Development Tools:**
• Git & Version Control
• Docker & DevOps
• Testing (Jest, React Testing Library)
• CI/CD Pipelines
• Agile Development

**📱 Additional Skills:**
• React Native (Mobile Development)
• GraphQL & Apollo
• WebSocket & Real-time Features
• Payment Integration (Stripe, PayPal)
• SEO Optimization

I don't just code - I solve business problems with elegant technical solutions. Ready to see how my skills can benefit your project?

📧 ${process.env.DEVELOPER_EMAIL} | 📱 ${process.env.DEVELOPER_PHONE}`;

    case 'portfolio_inquiry':
      return `I'm excited to share my portfolio with you! Here are some of my standout projects that showcase my expertise:

**🚀 Featured Projects:**

**1. E-Commerce Platform**
• Full-stack online store with payment processing
• React, Next.js, Stripe integration
• Admin dashboard & inventory management
• Mobile-responsive design

**2. Niko - Finance Management App**
• Personal finance tracking & budgeting
• Real-time data visualization
• Secure user authentication
• Mobile & web platforms

**3. Jamz Arena - Music Streaming Platform**
• Spotify-like music streaming interface
• Audio player with playlists
• User profiles & social features
• Modern, intuitive UI/UX

**💡 Technical Highlights:**
• Modern React & TypeScript architecture
• Responsive design across all devices
• Secure backend APIs with proper authentication
• Database optimization & performance tuning
• SEO-friendly implementation

**Want to see more details or discuss a similar project for your business?**
📧 ${process.env.DEVELOPER_EMAIL}
📱 ${process.env.DEVELOPER_PHONE}

What type of project are you considering? I'd love to show you how I can bring your vision to life!`;

    default:
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return `Hello! 👋 I'm your dedicated AI assistant, here to help you connect with one of Nigeria's top web developers.

**What I Can Help You With:**
• Learn about technical expertise & projects
• Schedule consultation meetings
• Discuss project requirements & pricing
• Explore collaboration opportunities

**Why Work With This Developer:**
• **3+ Years Experience** in modern web development
• **20+ Successful Projects** delivered on time
• **Full-Stack Expertise** in React, Next.js, TypeScript
• **Excellent Communication** & client satisfaction

**Ready to start?** I can help you:
1. 📋 Understand capabilities & past work
2. 💰 Get project pricing estimates  
3. 📅 Schedule a consultation call
4. 🤝 Discuss your specific needs

Contact Information:
📧 ${process.env.DEVELOPER_EMAIL}
📱 ${process.env.DEVELOPER_PHONE}

What would you like to know more about?`;
      }
      
      return `I'm here to help you connect with an exceptional full-stack developer! Whether you're looking to build a new application, upgrade existing systems, or need technical consultation, y[...]  

**How I Can Assist You:**
• Answer questions about technical capabilities
• Provide project examples & case studies  
• Help schedule consultation calls
• Discuss pricing & timeline estimates

**Developer Highlights:**
• **Proven Track Record**: 20+ successful projects
• **Modern Tech Stack**: React, Next.js, TypeScript, Node.js
• **Business Focus**: Solutions that drive real results
• **Available Now**: Ready for new projects & opportunities

**Direct Contact:**
📧 ${process.env.DEVELOPER_EMAIL}
📱 ${process.env.DEVELOPER_PHONE}

This developer consistently delivers high-quality solutions that exceed client expectations. Ready to discuss how they can help transform your business?

What specific information can I provide about their work or availability?`;
  }
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Message is required" }), { status: 400 });
    }

    const session = await auth();
    const { userId } = session;
    const sessionId = userId || `guest_${req.headers.get("x-forwarded-for") || crypto.randomUUID()}`;

    console.log("📌 Session ID:", sessionId);

    // Retrieve conversation history from database
    const conversationHistory = await prisma.conversation.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: 10 // Limit to last 10 messages for context
    });

    // Save user message to database
    await prisma.conversation.create({
      data: {
        sessionId,
        role: "user",
        message
      }
    });

    // Generate response using Groq with actual conversation history
    const response = await generateGroqResponse(message, conversationHistory);

    // Save assistant response to database
    await prisma.conversation.create({
      data: {
        sessionId,
        role: "assistant", 
        message: response
      }
    });

    return new Response(JSON.stringify({ reply: response }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Assistant API error:", error);
    return new Response(
      JSON.stringify({ error: "Sorry, I'm having trouble responding right now. Please try again." }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}