DELETE FROM "issues" WHERE "stateId" IS NULL;

/*
  Warnings:

  - Made the column `stateId` on table `issues` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "issues" DROP CONSTRAINT "issues_stateId_fkey";

-- AlterTable
ALTER TABLE "issues" ALTER COLUMN "stateId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
