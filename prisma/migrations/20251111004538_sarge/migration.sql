/*
  Warnings:

  - The `status` column on the `CandidatePoolEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ASSIGNED', 'SUBMITTED');

-- DropForeignKey
ALTER TABLE "public"."UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserRole" DROP CONSTRAINT "UserRole_userId_fkey";

-- AlterTable
ALTER TABLE "public"."CandidatePoolEntry" DROP COLUMN "status",
ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'ASSIGNED';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "roleId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."UserRole";

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
