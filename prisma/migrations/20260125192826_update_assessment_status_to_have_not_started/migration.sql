/*
  Warnings:

  - The values [ASSIGNED] on the enum `AssessmentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."AssessmentStatus_new" AS ENUM ('NOT_ASSIGNED', 'NOT_STARTED', 'SUBMITTED', 'EXPIRED', 'GRADED');
ALTER TABLE "public"."Application" ALTER COLUMN "assessmentStatus" DROP DEFAULT;
ALTER TABLE "public"."Application" ALTER COLUMN "assessmentStatus" TYPE "public"."AssessmentStatus_new" USING ("assessmentStatus"::text::"public"."AssessmentStatus_new");
ALTER TYPE "public"."AssessmentStatus" RENAME TO "AssessmentStatus_old";
ALTER TYPE "public"."AssessmentStatus_new" RENAME TO "AssessmentStatus";
DROP TYPE "public"."AssessmentStatus_old";
ALTER TABLE "public"."Application" ALTER COLUMN "assessmentStatus" SET DEFAULT 'NOT_ASSIGNED';
COMMIT;
