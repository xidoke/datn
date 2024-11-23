-- DropForeignKey
ALTER TABLE "FileAsset" DROP CONSTRAINT "FileAsset_issueId_fkey";

-- DropForeignKey
ALTER TABLE "FileAsset" DROP CONSTRAINT "FileAsset_projectId_fkey";

-- DropForeignKey
ALTER TABLE "State" DROP CONSTRAINT "State_projectId_fkey";

-- DropForeignKey
ALTER TABLE "issues" DROP CONSTRAINT "issues_projectId_fkey";

-- DropEnum
DROP TYPE "WorkspacePermission";

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "State" ADD CONSTRAINT "State_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
