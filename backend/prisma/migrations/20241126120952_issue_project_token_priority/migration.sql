/*
  Warnings:

  - A unique constraint covering the columns `[projectId,sequenceNumber]` on the table `issues` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceId,token]` on the table `projects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectToken` to the `issues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sequenceNumber` to the `issues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "issues" ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "projectToken" VARCHAR(5) NOT NULL,
ADD COLUMN     "sequenceNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "lastIssueNumber" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "token" VARCHAR(5) NOT NULL;

-- CreateIndex
CREATE INDEX "issues_projectId_idx" ON "issues"("projectId");

-- CreateIndex
CREATE INDEX "issues_stateId_idx" ON "issues"("stateId");

-- CreateIndex
CREATE INDEX "issues_creatorId_idx" ON "issues"("creatorId");

-- CreateIndex
CREATE INDEX "issues_priority_idx" ON "issues"("priority");

-- CreateIndex
CREATE INDEX "issues_dueDate_idx" ON "issues"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "issues_projectId_sequenceNumber_key" ON "issues"("projectId", "sequenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "projects_workspaceId_token_key" ON "projects"("workspaceId", "token");
