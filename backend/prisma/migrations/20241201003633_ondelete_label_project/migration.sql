-- DropForeignKey
ALTER TABLE "Label" DROP CONSTRAINT "Label_projectId_fkey";

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
