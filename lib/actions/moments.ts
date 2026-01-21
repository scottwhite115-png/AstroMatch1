'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { addDays } from 'date-fns';

export async function createOrReplaceMoment(content: string, imageUrl?: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) throw new Error('Not authenticated');

  // Archive existing active moment
  await prisma.moment.updateMany({
    where: {
      userId: user.id,
      archivedAt: null,
      isDeleted: false,
    },
    data: {
      archivedAt: new Date(),
    },
  });

  // Create new moment
  return prisma.moment.create({
    data: {
      userId: user.id,
      content,
      imageUrl,
      expiresAt: addDays(new Date(), 14),
    },
  });
}

export async function toggleReaction(momentId: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return;

  const existing = await prisma.momentReaction.findUnique({
    where: {
      momentId_userId: {
        momentId,
        userId: user.id,
      },
    },
  });

  if (existing) {
    await prisma.momentReaction.delete({ where: { id: existing.id } });
  } else {
    await prisma.momentReaction.create({
      data: { momentId, userId: user.id },
    });
  }
}

export async function addReply(momentId: string, content: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) throw new Error('Not authenticated');

  return prisma.momentReply.create({
    data: {
      momentId,
      userId: user.id,
      content,
    },
  });
}

export async function getActiveMoments(userId?: string) {
  const blockedIds = userId
    ? await prisma.userBlock.findMany({
        where: { blockerId: userId },
        select: { blockedId: true },
      })
    : [];

  return prisma.moment.findMany({
    where: {
      archivedAt: null,
      isDeleted: false,
      expiresAt: { gt: new Date() },
      userId: { notIn: blockedIds.map(b => b.blockedId) },
    },
    include: {
      user: {
        select: {
          id: true,
          display_name: true,
          western_sign: true,
          chinese_sign: true,
          photo_url: true,
        },
      },
      replies: {
        orderBy: { createdAt: 'asc' },
      },
      reactions: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteMoment(momentId: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;

  await prisma.moment.updateMany({
    where: {
      id: momentId,
      userId: data.user.id,
    },
    data: {
      isDeleted: true,
    },
  });
}

export async function archiveMoment(momentId: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;

  await prisma.moment.updateMany({
    where: {
      id: momentId,
      userId: data.user.id,
    },
    data: {
      archivedAt: new Date(),
    },
  });
}

export async function reportMoment(momentId: string, reason: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;

  await prisma.momentReport.create({
    data: {
      momentId,
      reporterId: data.user.id,
      reason,
    },
  });
}

export async function blockUser(blockedId: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;

  await prisma.userBlock.create({
    data: {
      blockerId: data.user.id,
      blockedId,
    },
  });
}

export async function uploadMomentImage(file: File) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;

  const path = `${data.user.id}/${crypto.randomUUID()}`;

  await supabase.storage
    .from('moment-images')
    .upload(path, file, { upsert: false });

  return supabase.storage.from('moment-images').getPublicUrl(path).data.publicUrl;
}

