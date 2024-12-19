/*
  Warnings:

  - You are about to drop the column `userId` on the `issue_assignees` table. All the data in the column will be lost.
  - Added the required column `memberId` to the `issue_assignees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `issue_assignees` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "issue_assignees" DROP CONSTRAINT "issue_assignees_userId_fkey";

-- AlterTable
ALTER TABLE "issue_assignees" DROP COLUMN "userId",
ADD COLUMN     "memberId" TEXT NOT NULL,
ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "issue_assignees" ADD CONSTRAINT "issue_assignees_memberId_workspaceId_fkey" FOREIGN KEY ("memberId", "workspaceId") REFERENCES "workspace_members"("userId", "workspaceId") ON DELETE RESTRICT ON UPDATE CASCADE;
