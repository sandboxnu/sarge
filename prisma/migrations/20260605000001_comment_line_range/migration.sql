-- AlterTable
ALTER TABLE "public"."Comment" DROP COLUMN "line",
ADD COLUMN     "endLine" INTEGER NOT NULL,
ADD COLUMN     "startLine" INTEGER NOT NULL;
