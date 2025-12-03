import prisma from "@/src/lib/prisma";
import type { Profile } from "./supabaseClient";

// Fetch a single profile by user id
export async function getProfile(userId: string): Promise<Profile | null> {
  const profile = await prisma.profiles.findUnique({
    where: { id: userId },
  });

  // Cast the Prisma result to the existing Profile type so the rest
  // of the app doesn't have to change yet.
  return profile as unknown as Profile | null;
}

// Update a profile by user id
export async function updateProfile(
  userId: string,
  data: Partial<Profile>,
): Promise<Profile> {
  const updated = await prisma.profiles.update({
    where: { id: userId },
    // Prisma's `data` type may not exactly match `Profile`, so we cast.
    data: data as any,
  });

  return updated as unknown as Profile;
}
