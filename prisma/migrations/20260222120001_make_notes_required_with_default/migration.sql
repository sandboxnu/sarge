UPDATE "AssessmentTemplate" SET "notes" = '[]' WHERE "notes" IS NULL;

-- AlterTable
ALTER TABLE "AssessmentTemplate" ALTER COLUMN "notes" SET NOT NULL;
ALTER TABLE "AssessmentTemplate" ALTER COLUMN "notes" SET DEFAULT '[]';
