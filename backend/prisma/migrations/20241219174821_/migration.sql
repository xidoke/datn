/*
  Warnings:

  - You are about to drop the column `workspaceId` on the `cycles` table. All the data in the column will be lost.
  - Made the column `creatorId` on table `cycles` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "cycles" DROP CONSTRAINT "cycles_creatorId_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "cycles" DROP CONSTRAINT "cycles_workspaceId_fkey";

-- AlterTable
ALTER TABLE "cycles" DROP COLUMN "workspaceId",
ALTER COLUMN "creatorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "cycles" ADD CONSTRAINT "cycles_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
