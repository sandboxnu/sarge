/*
  Warnings:

  - You are about to drop the column `decidedBy` on the `Application` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Application" DROP CONSTRAINT "Application_decidedBy_fkey";

-- AlterTable
ALTER TABLE "public"."Application" DROP COLUMN "decidedBy",
ADD COLUMN     "graderId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_graderId_fkey" FOREIGN KEY ("graderId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
