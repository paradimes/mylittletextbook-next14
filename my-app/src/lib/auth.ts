// src/lib/auth.ts
import { prisma } from "@/lib/prisma";

export async function getOrCreateUser(auth0User: {
  id: string;
  email: string;
}) {
  // Try to find existing user
  const user = await prisma.user.findUnique({
    where: { auth0Id: auth0User.id },
  });

  if (user) {
    return user;
  }

  // Create new user if doesn't exist
  return prisma.user.create({
    data: {
      auth0Id: auth0User.id,
      email: auth0User.email,
    },
  });
}
