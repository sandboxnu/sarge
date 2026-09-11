 -- AlterTable
 ALTER TABLE "public"."Snapshot" ADD COLUMN "content" TEXT;

 ALTER TABLE "public"."Snapshot" ADD CONSTRAINT "Snapshot_content_matches_type" CHECK (("type" = 'CONTENT') = ("content" IS NOT NULL));
