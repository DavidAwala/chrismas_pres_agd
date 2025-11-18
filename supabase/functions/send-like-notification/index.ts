import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  recipientName: string;
  senderName: string;
  senderEmail: string;
  giftUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientName, senderName, senderEmail, giftUrl }: NotificationRequest = await req.json();

    console.log("Sending like notification to:", senderEmail);

    const emailResponse = await resend.emails.send({
      from: "Christmas Greetings <onboarding@resend.dev>",
      to: [senderEmail],
      subject: `${recipientName} loved your Christmas message! ❤️`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Arial', sans-serif; background-color: #FFF8E1; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #2E7D32, #C62828); padding: 40px 20px; text-center; }
              .header h1 { color: white; margin: 0; font-size: 28px; }
              .content { padding: 40px 30px; }
              .message { font-size: 18px; line-height: 1.6; color: #333; margin-bottom: 30px; }
              .button { display: inline-block; background: linear-gradient(135deg, #2E7D32, #C62828); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
              .footer { background: #f5f5f5; padding: 20px; text-center; color: #666; font-size: 14px; }
              .heart { color: #C62828; font-size: 24px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎄 Great News! 🎄</h1>
              </div>
              <div class="content">
                <p class="message">
                  Hi ${senderName},
                </p>
                <p class="message">
                  <strong>${recipientName}</strong> just liked your personalized Christmas message! <span class="heart">❤️</span>
                </p>
                <p class="message">
                  Your heartfelt words brought joy to their holiday season. Thank you for spreading Christmas cheer!
                </p>
                <center>
                  <a href="${giftUrl}" class="button">View Your Gift Page</a>
                </center>
              </div>
              <div class="footer">
                <p>Made with ❤️ for Christmas 2025</p>
                <p>Spreading love, joy, and festive cheer</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-like-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
