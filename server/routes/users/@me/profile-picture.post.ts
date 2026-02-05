import { defineEventHandler, readBody } from "h3";
import { prisma } from "#imports";
import { useAuth } from "~/utils/auth";

export default defineEventHandler(async (event) => {
  const session = await useAuth().getCurrentSession();
  
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const body = await readBody(event);
  const { image } = body;

  if (!image || typeof image !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Invalid image data" });
  }

  // Update user profile picture (store as base64)
  await prisma.users.update({
    where: { id: session.user },
    data: { profile_picture: image },
  });

  return { success: true };
});
