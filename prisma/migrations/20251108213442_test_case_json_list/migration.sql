/*
  Warnings:

  - The `public_test_cases` column on the `TaskTemplate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `private_test_cases` column on the `TaskTemplate` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."TaskTemplate" DROP COLUMN "public_test_cases",
ADD COLUMN     "public_test_cases" JSONB[],
DROP COLUMN "private_test_cases",
ADD COLUMN     "private_test_cases" JSONB[];
