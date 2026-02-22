-- Backfill nulls before altering column
UPDATE "AssessmentTemplate" SET "internalNotes" = '[]' WHERE "internalNotes" IS NULL;

-- AlterTable
ALTER TABLE "AssessmentTemplate" ALTER COLUMN "internalNotes" SET NOT NULL;
ALTER TABLE "AssessmentTemplate" ALTER COLUMN "internalNotes" SET DEFAULT '[]';
