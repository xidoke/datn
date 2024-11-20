/*
  Warnings:

  - You are about to drop the column `createdAt` on the `workspace_members` table. All the data in the column will be lost.
  - The `role` column on the `workspace_members` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId,workspaceId]` on the table `workspace_members` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- DropForeignKey
ALTER TABLE "workspace_members" DROP CONSTRAINT "workspace_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_members" DROP CONSTRAINT "workspace_members_workspaceId_fkey";

-- AlterTable
ALTER TABLE "workspace_members" DROP COLUMN "createdAt",
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "role",
ADD COLUMN     "role" "WorkspaceRole" NOT NULL DEFAULT 'MEMBER';

-- CreateIndex
CREATE INDEX "workspace_members_workspaceId_idx" ON "workspace_members"("workspaceId");

-- CreateIndex
CREATE INDEX "workspace_members_userId_idx" ON "workspace_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_members_userId_workspaceId_key" ON "workspace_members"("userId", "workspaceId");

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
