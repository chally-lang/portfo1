import { NextResponse } from "next/server";

// --- Environment Variables ---
const DEV_EMAIL = process.env.DEVELOPER_EMAIL || "youremail@example.com";
const DEV_PHONE = process.env.DEVELOPER_PHONE || "+1234567890";
const GROQ_KEY = process.env.GROQ_API_KEY || "";

// --- In-memory session store ---
const sessions: Record<string, { role: string; text: string }[]> = {};

// --- Append contact info ---
function appendContact(message: string) {
  return `${message}\n\n📧 Contact: ${DEV_EMAIL}\n📱 Phone: ${DEV_PHONE}\n💻 Or visit: /contact`;
}

// --- Track session messages ---
function trackSession(sessionId: string, role: string, text: string) {
  if (!sessions[sessionId]) sessions[sessionId] = [];
  sessions[sessionId].push({ role, text });
}

// --- Generate static intelligent reply ---
function generateStaticReply(message: string, sessionId: string): string {
  const text = message.toLowerCase();
  let reply = "";

  if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
    reply = "Hello! 👋 I'm Charles' AI assistant. How can I help you with web, mobile, or software development today?";
  } else if (text.includes("project") || text.includes("portfolio")) {
    reply = "I'd love to tell you about Charles' projects! He builds modern web and mobile apps using React, Next.js, TypeScript, Node.js, and more. Want to see examples or learn about his workflow?";
  } else if (text.includes("contact") || text.includes("hire") || text.includes("work")) {
    reply = "Charles is available for new projects! Reach him via email, phone, or the contact page to discuss your next project.";
  } else if (text.includes("ai") || text.includes("automation") || text.includes("workflow")) {
    reply = "Charles can build AI agents, automation workflows, and smart integrations for your business. Feel free to discuss your ideas!";
  } else if (text.includes("database") || text.includes("api") || text.includes("backend")) {
    reply = "Charles has strong backend expertise including databases, API design & optimization, and full-stack solutions.";
  } else if (text.includes("skills") || text.includes("developer") || text.includes("experience")) {
    reply = "Charles is a Full Stack Developer, Mobile App Developer, and Automation Engineer. He also contributes to open source projects and builds AI-powered tools.";
  } else {
    reply = "Thanks for your message! Charles can help with web & mobile development, AI/automation workflows, databases, API integrations, and much more.";
  }

  // Add follow-up suggestion based on previous messages
  const session = sessions[sessionId] || [];
  if (session.length > 2 && !text.includes("contact")) {
    reply += " What else would you like to know about Charles' skills or projects?";
  }

  return appendContact(reply);
}

// --- Groq API integration ---
async function generateGroqReply(message: string, sessionId: string): Promise<string> {
  if (!GROQ_KEY) return generateStaticReply(message, sessionId);

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: `You are a professional AI assistant for Charles, a Full Stack Developer. Be helpful, concise, and always encourage contacting him via email, phone, or /contact page.`
          },
          ...((sessions[sessionId] || []).map(m => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.text
          }))),
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 400
      }),
    });

    if (!res.ok) throw new Error(`Groq API status ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || generateStaticReply(message, sessionId);
  } catch (err) {
    console.error("Groq API error:", err);
    return generateStaticReply(message, sessionId);
  }
}

// --- GET handler ---
export async function GET() {
  return NextResponse.json({ message: "Assistant API working ✅" });
}

// --- POST handler ---
export async function POST(req: Request) {
  try {
    const { sessionId, message } = await req.json();
    if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });
    if (!sessionId) return NextResponse.json({ error: "SessionId is required" }, { status: 400 });

    trackSession(sessionId, "user", message);

    const reply = await generateGroqReply(message, sessionId);

    trackSession(sessionId, "assistant", reply);

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
