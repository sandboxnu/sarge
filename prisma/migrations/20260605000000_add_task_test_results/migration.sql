-- CreateEnum
CREATE TYPE "public"."TestVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "failedTestCases",
DROP COLUMN "passedTestCases";

-- CreateTable
CREATE TABLE "public"."TaskTestResult" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "visibility" "public"."TestVisibility" NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "input" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "actualOutput" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskTestResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskTestResult_taskId_visibility_idx" ON "public"."TaskTestResult"("taskId", "visibility");

-- AddForeignKey
ALTER TABLE "public"."TaskTestResult" ADD CONSTRAINT "TaskTestResult_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
