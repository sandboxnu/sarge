/*
  Warnings:

  - Made the column `assignedAt` on table `Assessment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Assessment" ALTER COLUMN "assignedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Task" ALTER COLUMN "lastUpdated" DROP NOT NULL;
