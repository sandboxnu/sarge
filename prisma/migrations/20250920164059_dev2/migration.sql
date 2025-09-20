-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_orgId_fkey";

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "orgId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
