/*
  Warnings:

  - You are about to drop the column `lastWorkspaceId` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "lastWorkspaceId",
ADD COLUMN     "lastWorkspaceSlug" TEXT;
