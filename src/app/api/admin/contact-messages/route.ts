import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const [messages, subscribers] = await Promise.all([
      prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.newsletterSubscriber.findMany({
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return new Response(JSON.stringify({ messages, subscribers }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Failed to fetch contact messages and newsletter subscribers:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { id, type } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!type || (type !== 'message' && type !== 'subscriber')) {
      return new Response(JSON.stringify({ error: "Type must be 'message' or 'subscriber'" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (type === 'message') {
      await prisma.contactMessage.delete({
        where: { id: id }
      });
    } else if (type === 'subscriber') {
      await prisma.newsletterSubscriber.delete({
        where: { id: id }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Failed to delete record:", error);
    return new Response(JSON.stringify({ error: "Failed to delete record" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { id, type, action } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (type !== 'subscriber') {
      return new Response(JSON.stringify({ error: "PATCH operation only supported for newsletter subscribers" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!action || (action !== 'activate' && action !== 'deactivate')) {
      return new Response(JSON.stringify({ error: "Action must be 'activate' or 'deactivate'" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const updatedSubscriber = await prisma.newsletterSubscriber.update({
      where: { id: id },
      data: { 
        isActive: action === 'activate' 
      }
    });

    return new Response(JSON.stringify({ success: true, subscriber: updatedSubscriber }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Failed to update newsletter subscriber:", error);
    return new Response(JSON.stringify({ error: "Failed to update subscriber" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}