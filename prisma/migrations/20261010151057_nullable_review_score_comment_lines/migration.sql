-- AlterTable
ALTER TABLE "public"."Comment" ALTER COLUMN "endLine" DROP NOT NULL,
ALTER COLUMN "startLine" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Review" ALTER COLUMN "score" DROP NOT NULL;
