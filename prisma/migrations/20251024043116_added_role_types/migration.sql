/*
  Warnings:

  - Changed the type of `role` on the `Role` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."RoleType" AS ENUM ('ADMIN', 'RECRUITER', 'REVIEWER');

-- DropIndex
DROP INDEX "public"."Role_role_key";

-- AlterTable
ALTER TABLE "public"."Role" DROP COLUMN "role",
ADD COLUMN     "role" "public"."RoleType" NOT NULL;
