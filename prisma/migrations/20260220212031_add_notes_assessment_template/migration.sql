/*
  Warnings:

  - Added the required column `notes` to the `AssessmentTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."AssessmentTemplate" ADD COLUMN     "notes" JSONB NOT NULL;
