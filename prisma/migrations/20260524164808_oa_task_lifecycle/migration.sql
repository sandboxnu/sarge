-- AlterEnum
ALTER TYPE "public"."AssessmentStatus" ADD VALUE 'IN_PROGRESS';

-- AlterEnum
ALTER TYPE "public"."SnapshotType" ADD VALUE 'UNFOCUS';

-- AlterTable
ALTER TABLE "public"."Task" ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "submission" DROP NOT NULL,
ALTER COLUMN "submittedAt" DROP NOT NULL,
ALTER COLUMN "submittedAt" DROP DEFAULT;
