/*
  Warnings:

  - Added the required column `authorId` to the `TaskTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."TaskTemplate" ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "supportedLanguages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "taskType" TEXT;

-- AddForeignKey
ALTER TABLE "public"."TaskTemplate" ADD CONSTRAINT "TaskTemplate_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
