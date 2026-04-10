-- AlterTable
ALTER TABLE "public"."Assessment" ADD COLUMN     "startedAt" TIMESTAMP(3);

-- Backfill existing tasks with 0 estimated time to the new default
UPDATE "public"."TaskTemplate" SET "estimatedTime" = 30 WHERE "estimatedTime" = 0;

-- AlterTable
ALTER TABLE "public"."TaskTemplate" ALTER COLUMN "estimatedTime" SET DEFAULT 30;
