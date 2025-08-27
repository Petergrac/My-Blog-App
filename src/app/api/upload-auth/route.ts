// File: app/api/upload-auth/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { getUploadAuthParams } from "@imagekit/next/server";


export async function GET() {
  // Your application logic to authenticate the user
  const user = await currentUser();

  if (
    user?.publicMetadata.membershipType !== "Author" &&
    user?.publicMetadata.membershipType !== "Admin"
  )
    return Response.json({ message: "You must be an author or admin" });

  console.log("This function is reached");

  const { token, expire, signature } = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  });

  return Response.json({
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  });
}
