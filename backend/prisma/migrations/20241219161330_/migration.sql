-- DropForeignKey
ALTER TABLE "issue_assignees" DROP CONSTRAINT "issue_assignees_memberId_workspaceId_fkey";

-- AddForeignKey
ALTER TABLE "issue_assignees" ADD CONSTRAINT "issue_assignees_memberId_workspaceId_fkey" FOREIGN KEY ("memberId", "workspaceId") REFERENCES "workspace_members"("userId", "workspaceId") ON DELETE CASCADE ON UPDATE CASCADE;
