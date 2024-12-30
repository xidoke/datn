-- DropForeignKey
ALTER TABLE "issue_assignees" DROP CONSTRAINT "issue_assignees_issueId_fkey";

-- AddForeignKey
ALTER TABLE "issue_assignees" ADD CONSTRAINT "issue_assignees_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
