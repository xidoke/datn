-- DropForeignKey
ALTER TABLE "issue_comments" DROP CONSTRAINT "issue_comments_issueId_fkey";

-- DropForeignKey
ALTER TABLE "issue_comments" DROP CONSTRAINT "issue_comments_userId_fkey";

-- AddForeignKey
ALTER TABLE "issue_comments" ADD CONSTRAINT "issue_comments_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_comments" ADD CONSTRAINT "issue_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
