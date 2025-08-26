import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // ADD USER INFO IN THE DATABASE

    /**
     * ========== CREATE A NEW USER =================
     */
    if (evt.type === "user.created") {
      const userInfo = evt.data;
      try {
        const newUser = await prisma.user.create({
          data: {
            clerkId: userInfo.id,
            username: userInfo.username
              ? userInfo.username
              : userInfo.first_name,
            email: userInfo.email_addresses[0].email_address,
            avatar: userInfo.image_url,
          },
        });
        console.log(newUser);
        return new Response("Webhook received", { status: 200 });
      } catch (error) {
        console.log(error);
        return new Response("Error Saving the user to the database", {
          status: 400,
        });
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
