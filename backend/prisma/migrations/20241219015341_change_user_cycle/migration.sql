/*
  Warnings:

  - Added the required column `workspaceId` to the `cycles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cycles" DROP CONSTRAINT "cycles_creatorId_fkey";

-- AlterTable
ALTER TABLE "cycles" ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "cycles" ADD CONSTRAINT "cycles_creatorId_workspaceId_fkey" FOREIGN KEY ("creatorId", "workspaceId") REFERENCES "workspace_members"("userId", "workspaceId") ON DELETE RESTRICT ON UPDATE CASCADE;
