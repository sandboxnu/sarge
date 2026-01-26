/*
  Warnings:

  - You are about to drop the column `content` on the `TaskTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."TaskTemplate" DROP COLUMN "content",
ADD COLUMN     "description" JSONB NOT NULL DEFAULT '[]';

-- CreateTable
CREATE TABLE "public"."StarterCode" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "taskTemplateId" TEXT NOT NULL,

    CONSTRAINT "StarterCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StarterCode_id_key" ON "public"."StarterCode"("id");

-- CreateIndex
CREATE UNIQUE INDEX "StarterCode_taskTemplateId_language_key" ON "public"."StarterCode"("taskTemplateId", "language");

-- AddForeignKey
ALTER TABLE "public"."StarterCode" ADD CONSTRAINT "StarterCode_taskTemplateId_fkey" FOREIGN KEY ("taskTemplateId") REFERENCES "public"."TaskTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
