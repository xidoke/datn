-- DropForeignKey
ALTER TABLE "State" DROP CONSTRAINT "State_projectId_fkey";

-- AddForeignKey
ALTER TABLE "State" ADD CONSTRAINT "State_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
