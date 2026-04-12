/*
  Warnings:

  - You are about to drop the column `uniqueLink` on the `Assessment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Assessment_uniqueLink_key";

-- AlterTable
ALTER TABLE "public"."Assessment" DROP COLUMN "uniqueLink";
