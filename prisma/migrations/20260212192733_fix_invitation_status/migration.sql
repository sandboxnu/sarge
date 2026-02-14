/*
  Warnings:

  - The values [PENDING,ACCEPTED,EXPIRED,REVOKED] on the enum `InvitationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."InvitationStatus_new" AS ENUM ('pending', 'accepted', 'rejected', 'canceled');
ALTER TABLE "public"."Invitation" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Invitation" ALTER COLUMN "status" TYPE "public"."InvitationStatus_new" USING ("status"::text::"public"."InvitationStatus_new");
ALTER TYPE "public"."InvitationStatus" RENAME TO "InvitationStatus_old";
ALTER TYPE "public"."InvitationStatus_new" RENAME TO "InvitationStatus";
DROP TYPE "public"."InvitationStatus_old";
ALTER TABLE "public"."Invitation" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Invitation" ALTER COLUMN "status" SET DEFAULT 'pending';
