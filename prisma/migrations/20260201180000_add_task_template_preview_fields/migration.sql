-- AlterTable
ALTER TABLE "public"."TaskTemplate" ADD COLUMN "taskType" TEXT,
ADD COLUMN     "supportedLanguages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "createdById" TEXT;

-- AddForeignKey
ALTER TABLE "public"."TaskTemplate" ADD CONSTRAINT "TaskTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
