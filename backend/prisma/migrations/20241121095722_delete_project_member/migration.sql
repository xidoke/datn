/*
  Warnings:

  - You are about to drop the column `role` on the `WorkspaceInvitation` table. All the data in the column will be lost.
  - You are about to drop the `project_members` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "project_members" DROP CONSTRAINT "project_members_projectId_fkey";

-- DropForeignKey
ALTER TABLE "project_members" DROP CONSTRAINT "project_members_userId_fkey";

-- AlterTable
ALTER TABLE "WorkspaceInvitation" DROP COLUMN "role";

-- DropTable
DROP TABLE "project_members";
