/*
  Warnings:

  - You are about to drop the column `order` on the `State` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,projectId]` on the table `State` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId,isDefault]` on the table `State` will be added. If there are existing duplicate values, this will fail.

*/

-- DropForeignKey
ALTER TABLE "State" DROP CONSTRAINT "State_projectId_fkey";

-- DropIndex
DROP INDEX "State_projectId_name_key";

-- AlterTable
ALTER TABLE "State" DROP COLUMN "order",
ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE INDEX "State_projectId_idx" ON "State"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "State_name_projectId_key" ON "State"("name", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "State_projectId_isDefault_key" ON "State"("projectId", "isDefault");

-- AddForeignKey
ALTER TABLE "State" ADD CONSTRAINT "State_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
