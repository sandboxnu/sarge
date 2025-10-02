/*
  Warnings:

  - A unique constraint covering the columns `[createdById]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdById` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Organization" ADD COLUMN     "createdById" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_createdById_key" ON "public"."Organization"("createdById");

-- AddForeignKey
ALTER TABLE "public"."Organization" ADD CONSTRAINT "Organization_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
