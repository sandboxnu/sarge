-- AlterTable
ALTER TABLE "public"."Position" ADD COLUMN     "assessmentId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Position" ADD CONSTRAINT "Position_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "public"."AssessmentTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
