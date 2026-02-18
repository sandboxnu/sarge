/*
  Warnings:

  - Added the required column `authorId` to the `AssessmentTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."AssessmentTemplate" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."AssessmentTemplate" ADD CONSTRAINT "AssessmentTemplate_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
