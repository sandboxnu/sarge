/*
  Warnings:

  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Tag" DROP CONSTRAINT "Tag_orgId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_PositionTags" DROP CONSTRAINT "_PositionTags_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_TaskTemplateTags" DROP CONSTRAINT "_TaskTemplateTags_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_TaskTemplateTags" DROP CONSTRAINT "_TaskTemplateTags_B_fkey";

-- DropTable
DROP TABLE "public"."Tag";

-- CreateTable
CREATE TABLE "public"."PositionTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "colorHexCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PositionTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TaskTemplateTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "colorHexCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskTemplateTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PositionTag_orgId_idx" ON "public"."PositionTag"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "PositionTag_name_orgId_key" ON "public"."PositionTag"("name", "orgId");

-- CreateIndex
CREATE INDEX "TaskTemplateTag_orgId_idx" ON "public"."TaskTemplateTag"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskTemplateTag_name_orgId_key" ON "public"."TaskTemplateTag"("name", "orgId");

-- AddForeignKey
ALTER TABLE "public"."PositionTag" ADD CONSTRAINT "PositionTag_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskTemplateTag" ADD CONSTRAINT "TaskTemplateTag_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PositionTags" ADD CONSTRAINT "_PositionTags_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."PositionTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TaskTemplateTags" ADD CONSTRAINT "_TaskTemplateTags_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."TaskTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TaskTemplateTags" ADD CONSTRAINT "_TaskTemplateTags_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."TaskTemplateTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
