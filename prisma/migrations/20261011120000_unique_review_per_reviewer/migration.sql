-- CreateIndex
CREATE UNIQUE INDEX "Review_taskId_reviewerId_key" ON "public"."Review"("taskId", "reviewerId");

