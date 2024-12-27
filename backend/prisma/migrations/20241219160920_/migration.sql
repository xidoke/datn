-- DropForeignKey
ALTER TABLE "cycles" DROP CONSTRAINT "cycles_creatorId_workspaceId_fkey";

-- AddForeignKey
ALTER TABLE "cycles" ADD CONSTRAINT "cycles_creatorId_workspaceId_fkey" FOREIGN KEY ("creatorId", "workspaceId") REFERENCES "workspace_members"("userId", "workspaceId") ON DELETE SET NULL ON UPDATE CASCADE;
