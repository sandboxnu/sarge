/*
  Warnings:

  - You are about to drop the column `decidedAt` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `graderId` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `reviewerId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `taskId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `assessmentId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedAt` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `candidateCode` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Task` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `AssessmentTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `line` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submission` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TaskTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."SnapshotType" AS ENUM ('META', 'CONTENT', 'DISCONNECT', 'COPYPASTE', 'HIGHLIGHT');

-- DropForeignKey
ALTER TABLE "public"."Application" DROP CONSTRAINT "Application_graderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_reviewerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_assessmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_reviewerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_assessmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TaskTemplateLanguage" DROP CONSTRAINT "TaskTemplateLanguage_taskTemplateId_fkey";

-- AlterTable
ALTER TABLE "public"."Application" DROP COLUMN "decidedAt",
DROP COLUMN "graderId";

-- AlterTable
ALTER TABLE "public"."AssessmentTemplate" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."AssessmentTemplate" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Comment" DROP COLUMN "reviewerId",
DROP COLUMN "taskId",
ADD COLUMN     "line" INTEGER NOT NULL,
ADD COLUMN     "reviewId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Review" DROP COLUMN "assessmentId",
DROP COLUMN "content",
DROP COLUMN "rating",
DROP COLUMN "reviewedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "score" INTEGER NOT NULL,
ADD COLUMN     "taskId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "candidateCode",
DROP COLUMN "updatedAt",
ADD COLUMN     "failedTestCases" JSONB[],
ADD COLUMN     "passedTestCases" JSONB[],
ADD COLUMN     "submission" TEXT NOT NULL,
ADD COLUMN     "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."TaskTemplate" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."TaskTemplate" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "public"."Snapshot" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "type" "public"."SnapshotType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_AssessmentToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AssessmentToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Snapshot_id_key" ON "public"."Snapshot"("id");

-- CreateIndex
CREATE INDEX "_AssessmentToUser_B_index" ON "public"."_AssessmentToUser"("B");

-- AddForeignKey
ALTER TABLE "public"."TaskTemplateLanguage" ADD CONSTRAINT "TaskTemplateLanguage_taskTemplateId_fkey" FOREIGN KEY ("taskTemplateId") REFERENCES "public"."TaskTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "public"."Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Snapshot" ADD CONSTRAINT "Snapshot_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AssessmentToUser" ADD CONSTRAINT "_AssessmentToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AssessmentToUser" ADD CONSTRAINT "_AssessmentToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
