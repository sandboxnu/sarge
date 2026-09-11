-- AlterTable
ALTER TABLE "public"."Session" ADD COLUMN     "impersonatedBy" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "banExpires" TIMESTAMP(3),
ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "banned" BOOLEAN DEFAULT false,
ADD COLUMN     "role" TEXT;
