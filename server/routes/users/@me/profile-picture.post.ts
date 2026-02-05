import { defineEventHandler, readBody } from "h3";
import { prisma } from "#imports";
import { verifyAuth } from "#imports";

export default defineEventHandler(async (event) => {
  const user = await verifyAuth(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const body = await readBody(event);
  const { image } = body;

  if (!image || typeof image !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Invalid image data" });
  }

  // Update user profile picture (store as base64)
  await prisma.users.update({
    where: { id: user.id },
    data: { profile_picture: image },
  });

  return { success: true };
});
