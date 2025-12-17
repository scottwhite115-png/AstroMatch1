import { getCurrentUser } from "@/lib/auth";

export async function getCurrentUserProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Safe Prisma import
  let prisma;
  try {
    prisma = (await import("@/lib/prisma")).default;
  } catch (error) {
    console.warn('[getCurrentUserProfile] Prisma not available');
    return null;
  }

  // Note: Using 'profiles' model with 'id' field since that matches current schema
  // If you have a separate Profile model with userId field, use:
  // return prisma.profile.findUnique({ where: { userId: user.id }, ... })
  try {
    const profile = await prisma.profiles.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        display_name: true,
        western_sign: true,
        chinese_sign: true,
        east_west_code: true,
      },
    });

    if (!profile) return null;

    // Map snake_case to camelCase
    return {
      id: profile.id,
      displayName: profile.display_name,
      westSign: profile.western_sign,
      chineseSign: profile.chinese_sign,
      eastWestCode: profile.east_west_code,
    };
  } catch (error) {
    console.warn('[getCurrentUserProfile] Database query failed:', error);
    return null;
  }
}

