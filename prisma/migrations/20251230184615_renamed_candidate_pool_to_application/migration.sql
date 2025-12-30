/*
  Warnings:

  - You are about to drop the column `candidatePoolEntryId` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the `CandidatePoolEntry` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[applicationId]` on the table `Assessment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `applicationId` to the `Assessment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Assessment" DROP CONSTRAINT "Assessment_candidatePoolEntryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CandidatePoolEntry" DROP CONSTRAINT "CandidatePoolEntry_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CandidatePoolEntry" DROP CONSTRAINT "CandidatePoolEntry_decidedBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."CandidatePoolEntry" DROP CONSTRAINT "CandidatePoolEntry_positionId_fkey";

-- DropIndex
DROP INDEX "public"."Assessment_candidatePoolEntryId_key";

-- AlterTable
ALTER TABLE "public"."Assessment" DROP COLUMN "candidatePoolEntryId",
ADD COLUMN     "applicationId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."CandidatePoolEntry";

-- CreateTable
CREATE TABLE "public"."Application" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "assessmentStatus" "public"."AssessmentStatus" NOT NULL DEFAULT 'NOT_ASSIGNED',
    "decisionStatus" "public"."DecisionStatus" NOT NULL DEFAULT 'PENDING',
    "decidedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_id_key" ON "public"."Application"("id");

-- CreateIndex
CREATE INDEX "Application_positionId_assessmentStatus_idx" ON "public"."Application"("positionId", "assessmentStatus");

-- CreateIndex
CREATE INDEX "Application_positionId_decisionStatus_idx" ON "public"."Application"("positionId", "decisionStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Application_candidateId_positionId_key" ON "public"."Application"("candidateId", "positionId");

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_applicationId_key" ON "public"."Assessment"("applicationId");

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "public"."Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "public"."Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_decidedBy_fkey" FOREIGN KEY ("decidedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assessment" ADD CONSTRAINT "Assessment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
