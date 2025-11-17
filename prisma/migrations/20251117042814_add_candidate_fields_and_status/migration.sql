/*
  Warnings:

  - You are about to drop the column `candidateId` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `isSubmitted` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `positionId` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `CandidatePoolEntry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[candidatePoolEntryId]` on the table `Assessment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `candidatePoolEntryId` to the `Assessment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."AssessmentStatus" AS ENUM ('NOT_ASSIGNED', 'ASSIGNED', 'SUBMITTED', 'EXPIRED', 'GRADED');

-- CreateEnum
CREATE TYPE "public"."DecisionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "public"."Assessment" DROP CONSTRAINT "Assessment_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Assessment" DROP CONSTRAINT "Assessment_positionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CandidatePoolEntry" DROP CONSTRAINT "CandidatePoolEntry_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CandidatePoolEntry" DROP CONSTRAINT "CandidatePoolEntry_positionId_fkey";

-- AlterTable
ALTER TABLE "public"."Assessment" DROP COLUMN "candidateId",
DROP COLUMN "isSubmitted",
DROP COLUMN "positionId",
ADD COLUMN     "candidatePoolEntryId" TEXT NOT NULL,
ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ALTER COLUMN "assignedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Candidate" ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "graduationDate" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "major" TEXT,
ADD COLUMN     "resumeUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."CandidatePoolEntry" DROP COLUMN "status",
ADD COLUMN     "assessmentStatus" "public"."AssessmentStatus" NOT NULL DEFAULT 'NOT_ASSIGNED',
ADD COLUMN     "decidedBy" TEXT,
ADD COLUMN     "decisionStatus" "public"."DecisionStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "public"."Status";

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_candidatePoolEntryId_key" ON "public"."Assessment"("candidatePoolEntryId");

-- CreateIndex
CREATE INDEX "CandidatePoolEntry_positionId_assessmentStatus_idx" ON "public"."CandidatePoolEntry"("positionId", "assessmentStatus");

-- CreateIndex
CREATE INDEX "CandidatePoolEntry_positionId_decisionStatus_idx" ON "public"."CandidatePoolEntry"("positionId", "decisionStatus");

-- AddForeignKey
ALTER TABLE "public"."CandidatePoolEntry" ADD CONSTRAINT "CandidatePoolEntry_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "public"."Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidatePoolEntry" ADD CONSTRAINT "CandidatePoolEntry_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "public"."Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidatePoolEntry" ADD CONSTRAINT "CandidatePoolEntry_decidedBy_fkey" FOREIGN KEY ("decidedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assessment" ADD CONSTRAINT "Assessment_candidatePoolEntryId_fkey" FOREIGN KEY ("candidatePoolEntryId") REFERENCES "public"."CandidatePoolEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
