-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_code_key" ON "Invitation"("code");
