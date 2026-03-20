/*
  Warnings:

  - You are about to drop the column `timeLimitMinutes` on the `TaskTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."TaskTemplate" DROP COLUMN "timeLimitMinutes",
ADD COLUMN     "estimatedTime" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "timeout" INTEGER NOT NULL DEFAULT 0;
