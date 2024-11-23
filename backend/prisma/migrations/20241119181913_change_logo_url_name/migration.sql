/*
  Warnings:

  - You are about to drop the column `logo_url` on the `workspaces` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "workspaces" DROP COLUMN "logo_url",
ADD COLUMN     "logoUrl" TEXT;
