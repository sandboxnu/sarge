-- AlterTable
ALTER TABLE "public"."AssessmentTemplate" ADD COLUMN     "internalNotes" JSONB;

-- AlterTable
ALTER TABLE "public"."TaskTemplate" ADD COLUMN     "timeLimitMinutes" INTEGER NOT NULL DEFAULT 0;
