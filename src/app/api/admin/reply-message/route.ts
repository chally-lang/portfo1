import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

// Note: This is a basic implementation. For production, you should integrate with:
// - SendGrid, Resend, Mailgun, AWS SES, or Nodemailer
// - Add proper email templates
// - Implement rate limiting
// - Add email tracking and analytics

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const { userId } = session;
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { to, subject, message, originalMessage, senderName } = await req.json();

    if (!to || !subject || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // For production, integrate with your preferred email service:
    
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: to,
      from: process.env.DEVELOPER_EMAIL || 'young4orch@gmail.com',
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reply from CharlesTech Portfolio</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <h3>Original Message:</h3>
          <p><strong>From:</strong> ${senderName}</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 14px;">
            ${originalMessage.replace(/\n/g, '<br>')}
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>Best regards,<br>Charles - CharlesTech Portfolio</p>
            <p>Email: young4orch@gmail.com<br>Phone: +234 07033085090</p>
          </div>
        </div>
      `,
    };
    
    await sgMail.send(msg);
    */

    // Example with Resend:
    /*
    import { Resend } from 'resend';
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reply from CharlesTech Portfolio</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <h3>Original Message:</h3>
          <p><strong>From:</strong> ${senderName}</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 14px;">
            ${originalMessage.replace(/\n/g, '<br>')}
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>Best regards,<br>Charles - CharlesTech Portfolio</p>
            <p>Email: young4orch@gmail.com<br>Phone: +234 07033085090</p>
          </div>
        </div>
      `,
    });
    */

    // For demonstration purposes, we'll just log the email details
    console.log('=== EMAIL REPLY SENT ===');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log(`Original Message from ${senderName}:`);
    console.log(originalMessage);
    console.log('======================');

    // In production, you would actually send the email above instead of just logging

    return new Response(JSON.stringify({ 
      success: true,
      message: "Reply sent successfully",
      details: {
        to,
        subject,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Failed to send reply:", error);
    return new Response(JSON.stringify({ error: "Failed to send reply" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}