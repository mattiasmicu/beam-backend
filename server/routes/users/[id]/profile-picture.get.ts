import { defineEventHandler } from "h3";
import { prisma } from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, "id");

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: "User ID required" });
  }

  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { profile_picture: true },
  });

  if (!user || !user.profile_picture) {
    throw createError({ statusCode: 404, statusMessage: "Profile picture not found" });
  }

  return { image: user.profile_picture };
});
