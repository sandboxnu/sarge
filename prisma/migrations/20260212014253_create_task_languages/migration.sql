-- CreateEnum
CREATE TYPE "public"."ProgrammingLanguage" AS ENUM ('python', 'javascript', 'c', 'typescript', 'ruby');

-- CreateTable
CREATE TABLE "public"."TaskTemplateLanguage" (
    "id" SERIAL NOT NULL,
    "taskTemplateId" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "stub" TEXT NOT NULL,
    "language" "public"."ProgrammingLanguage" NOT NULL,

    CONSTRAINT "TaskTemplateLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskTemplateLanguage_id_key" ON "public"."TaskTemplateLanguage"("id");

-- AddForeignKey
ALTER TABLE "public"."TaskTemplateLanguage" ADD CONSTRAINT "TaskTemplateLanguage_taskTemplateId_fkey" FOREIGN KEY ("taskTemplateId") REFERENCES "public"."TaskTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
