-- Migration: Add Moment moderation (MomentReport table)
-- Created: $(date)

-- Create MomentReport table
CREATE TABLE IF NOT EXISTS "MomentReport" (
    "id" TEXT NOT NULL,
    "momentId" TEXT NOT NULL,
    "reporterId" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MomentReport_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "MomentReport" ADD CONSTRAINT "MomentReport_momentId_fkey" FOREIGN KEY ("momentId") REFERENCES "Moment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MomentReport" ADD CONSTRAINT "MomentReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create index
CREATE INDEX IF NOT EXISTS "MomentReport_momentId_idx" ON "MomentReport"("momentId");
