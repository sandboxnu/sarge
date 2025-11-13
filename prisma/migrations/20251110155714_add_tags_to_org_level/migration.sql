/*
  Warnings:

  - You are about to drop the column `tags` on the `CandidatePoolEntry` table. All the data in the column will be lost.
  - You are about to drop the `CodingConcept` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PositionCodingConcepts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_PositionCodingConcepts" DROP CONSTRAINT "_PositionCodingConcepts_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_PositionCodingConcepts" DROP CONSTRAINT "_PositionCodingConcepts_B_fkey";

-- AlterTable
ALTER TABLE "CandidatePoolEntry" DROP COLUMN "tags";

-- DropTable
DROP TABLE "public"."CodingConcept";

-- DropTable
DROP TABLE "public"."_PositionCodingConcepts";

-- CreateTable
CREATE TABLE "tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "colorHexCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TaskTemplateTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TaskTemplateTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "tag_id_key" ON "tag"("id");

-- CreateIndex
CREATE INDEX "tag_orgId_idx" ON "tag"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_orgId_key" ON "tag"("name", "orgId");

-- CreateIndex
CREATE INDEX "_TaskTemplateTags_B_index" ON "_TaskTemplateTags"("B");

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskTemplateTags" ADD CONSTRAINT "_TaskTemplateTags_A_fkey" FOREIGN KEY ("A") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskTemplateTags" ADD CONSTRAINT "_TaskTemplateTags_B_fkey" FOREIGN KEY ("B") REFERENCES "TaskTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
