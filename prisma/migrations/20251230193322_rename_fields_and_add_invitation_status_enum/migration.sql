/*
  Warnings:

  - The `status` column on the `Invitation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `lastUpdated` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `private_test_cases` on the `TaskTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `public_test_cases` on the `TaskTemplate` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');

-- AlterTable
ALTER TABLE "public"."Invitation" DROP COLUMN "status",
ADD COLUMN     "status" "public"."InvitationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "lastUpdated",
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."TaskTemplate" DROP COLUMN "private_test_cases",
DROP COLUMN "public_test_cases",
ADD COLUMN     "privateTestCases" JSONB[],
ADD COLUMN     "publicTestCases" JSONB[];
