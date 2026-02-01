/*
  Warnings:

  - You are about to drop the column `taskTemplates` on the `AssessmentTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."AssessmentTemplate" DROP COLUMN "taskTemplates";

-- CreateTable
CREATE TABLE "public"."AssessmentTemplateTask" (
    "assessmentTemplateId" TEXT NOT NULL,
    "taskTemplateId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "AssessmentTemplateTask_pkey" PRIMARY KEY ("assessmentTemplateId","taskTemplateId")
);

-- CreateIndex
CREATE INDEX "AssessmentTemplateTask_assessmentTemplateId_order_idx" ON "public"."AssessmentTemplateTask"("assessmentTemplateId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentTemplateTask_assessmentTemplateId_order_key" ON "public"."AssessmentTemplateTask"("assessmentTemplateId", "order");

-- AddForeignKey
ALTER TABLE "public"."AssessmentTemplateTask" ADD CONSTRAINT "AssessmentTemplateTask_assessmentTemplateId_fkey" FOREIGN KEY ("assessmentTemplateId") REFERENCES "public"."AssessmentTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssessmentTemplateTask" ADD CONSTRAINT "AssessmentTemplateTask_taskTemplateId_fkey" FOREIGN KEY ("taskTemplateId") REFERENCES "public"."TaskTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
