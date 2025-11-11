/*
  Warnings:

  - The `status` column on the `CandidatePoolEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ASSIGNED', 'SUBMITTED');

-- AlterTable
ALTER TABLE "CandidatePoolEntry" ADD COLUMN     "tags" TEXT[],
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ASSIGNED';
