-- AlterTable
ALTER TABLE "TaskTemplate" ADD COLUMN "taskType" TEXT;

-- AlterTable
ALTER TABLE "TaskTemplate" ADD COLUMN "supportedLanguages" TEXT[] DEFAULT '{}';

-- AlterTable: createdById is required (no backfill; wipe and reseed instead)
ALTER TABLE "TaskTemplate" ADD COLUMN "createdById" TEXT NOT NULL;

-- Add FK to User
ALTER TABLE "TaskTemplate" ADD CONSTRAINT "TaskTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
