-- CreateTable
CREATE TABLE "public"."_PositionTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PositionTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PositionTags_B_index" ON "public"."_PositionTags"("B");

-- AddForeignKey
ALTER TABLE "public"."_PositionTags" ADD CONSTRAINT "_PositionTags_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PositionTags" ADD CONSTRAINT "_PositionTags_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
