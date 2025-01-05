-- DropForeignKey
ALTER TABLE "FileAsset" DROP CONSTRAINT "FileAsset_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "WorkspaceInvitation" DROP CONSTRAINT "WorkspaceInvitation_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_workspaceId_fkey";

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceInvitation" ADD CONSTRAINT "WorkspaceInvitation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
