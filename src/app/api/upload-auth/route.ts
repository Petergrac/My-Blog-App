// File: app/api/upload-auth/route.ts
import { auth } from "@/auth";
import { getUploadAuthParams } from "@imagekit/next/server";


export async function GET() {
  // Your application logic to authenticate the user
  const session = await auth();
  const role = session?.user?.role;

  if (
    role !== "Author" &&
    role !== "Admin"
  )
    return Response.json({ message: "You must be an author or admin" });

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
