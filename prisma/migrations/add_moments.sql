-- Migration: Add Moments tables
-- Created: $(date)

-- Create Moment table
CREATE TABLE IF NOT EXISTS "Moment" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Moment_pkey" PRIMARY KEY ("id")
);

-- Create MomentReply table
CREATE TABLE IF NOT EXISTS "MomentReply" (
    "id" TEXT NOT NULL,
    "momentId" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MomentReply_pkey" PRIMARY KEY ("id")
);

-- Create MomentReaction table
CREATE TABLE IF NOT EXISTS "MomentReaction" (
    "id" TEXT NOT NULL,
    "momentId" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MomentReaction_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "Moment" ADD CONSTRAINT "Moment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MomentReply" ADD CONSTRAINT "MomentReply_momentId_fkey" FOREIGN KEY ("momentId") REFERENCES "Moment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MomentReaction" ADD CONSTRAINT "MomentReaction_momentId_fkey" FOREIGN KEY ("momentId") REFERENCES "Moment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create indexes
CREATE INDEX IF NOT EXISTS "Moment_userId_idx" ON "Moment"("userId");
CREATE INDEX IF NOT EXISTS "Moment_expiresAt_idx" ON "Moment"("expiresAt");

-- Create unique constraint for MomentReaction
CREATE UNIQUE INDEX IF NOT EXISTS "MomentReaction_momentId_userId_key" ON "MomentReaction"("momentId", "userId");
