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
       await prisma.user.create({
          data: {
            clerkId: userInfo.id,
            username: userInfo.username
              ? userInfo.username
              : userInfo.first_name,
            email:
              userInfo.email_addresses.length > 0
                ? userInfo.email_addresses[0].email_address
                : "",
            avatar: userInfo.image_url,
          },
        });
         
        return new Response("Webhook received", { status: 200 });
      } catch (error) {
        console.log(error);
        return new Response("Error Saving the user to the database", {
          status: 400,
        });
      }
    }
    /**
     * ========== UPDATE USER PROFILE =================
     */
    if (evt.type === "user.updated") {
      const userInfo = evt.data;
      try {
        await prisma.user.update({
          where: {
            clerkId: userInfo.id,
          },
          data: {
            clerkId: userInfo.id,
            username: userInfo.username
              ? userInfo.username
              : userInfo.first_name,
            email:
              userInfo.email_addresses.length > 0
                ? userInfo.email_addresses[0].email_address
                : "",
            avatar: userInfo.image_url,
          },
        });

        return new Response("Webhook received", { status: 200 });
      } catch (error) {
        console.log(error);
        return new Response("Error Updating the user to the database", {
          status: 400,
        });
      }
    }
    /**
     * ========== REMOVE USER PROFILE =================
     */
    if (evt.type === "user.deleted") {
      console.log('This part is reached');
      const userInfo = evt.data;
      try {
        console.log('This block has been executed')
        const user = await prisma.user.delete({
          where: {
            clerkId: userInfo.id,
          },
        });
         console.log('user deleted', user);
        return new Response("Webhook received", { status: 200 });
      } catch (error) {
        console.log(error);
        return new Response("Error deleting user from the database", {
          status: 500,
        });
      }
    }
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
