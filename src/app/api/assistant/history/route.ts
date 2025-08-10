import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    const sessionId = userId || `guest_${req.headers.get("x-forwarded-for") || "anonymous"}`;

    const conversations = await prisma.conversation.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    const messages = conversations.map(conv => ({
      role: conv.role,
      text: conv.message,
      timestamp: conv.createdAt,
    }));

    return new Response(JSON.stringify({ messages }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error fetching conversation history:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch conversation history" }),
      { status: 500 }
    );
  }
}